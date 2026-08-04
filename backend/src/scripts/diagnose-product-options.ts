import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * READ-ONLY. Dumps a product's options straight from Postgres, including
 * soft-deleted rows that the Admin/Store API hides, plus any orphaned option
 * values left behind by failed variant creations.
 *
 * A product with zero live options cannot get variants: the product module
 * builds a ProductOptionValue with no `value` and MikroORM rejects it, so
 * POST /admin/products/:id/variants returns 500 with
 * "Value for ProductOptionValue.value is required, 'undefined' found".
 *
 * Usage:
 *   npx medusa exec src/scripts/diagnose-product-options.ts [handle]
 */
export default async function diagnoseProductOptions({ container, args }: ExecArgs) {
  const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const handle = args?.[0] ?? "wiedzmywbiznesie";

  const { rows: products } = await knex.raw(
    `SELECT id, title, status, created_at, updated_at, deleted_at
       FROM product WHERE handle = ?`,
    [handle]
  );
  if (!products.length) {
    logger.error(`No product with handle '${handle}'`);
    return;
  }
  const product = products[0];
  logger.info(
    `product ${product.id} — "${product.title}" [${product.status}] ` +
      `created=${product.created_at?.toISOString?.() ?? product.created_at} ` +
      `deleted=${product.deleted_at ?? "no"}`
  );

  const { rows: options } = await knex.raw(
    `SELECT o.id, o.title, o.created_at, o.deleted_at,
            count(v.id) FILTER (WHERE v.deleted_at IS NULL) AS live_values,
            count(v.id) FILTER (WHERE v.deleted_at IS NOT NULL) AS deleted_values,
            coalesce(string_agg(v.value, ' | ' ORDER BY v.value), '') AS values
       FROM product_option o
       LEFT JOIN product_option_value v ON v.option_id = o.id
      WHERE o.product_id = ?
      GROUP BY o.id, o.title, o.created_at, o.deleted_at
      ORDER BY o.created_at`,
    [product.id]
  );

  if (!options.length) {
    logger.warn("options: NONE — not even soft-deleted. Variants cannot be created.");
  } else {
    for (const o of options) {
      logger.info(
        `option ${o.id} "${o.title}" deleted=${o.deleted_at ?? "no"} ` +
          `values(live/deleted)=${o.live_values}/${o.deleted_values} [${o.values}]`
      );
    }
    const live = options.filter((o: any) => !o.deleted_at);
    if (!live.length) {
      logger.warn(
        `All ${options.length} option(s) are soft-deleted — the API reports options: [] ` +
          `and variant creation fails. Add a fresh option.`
      );
    }
  }

  const { rows: variants } = await knex.raw(
    `SELECT id, title, deleted_at FROM product_variant WHERE product_id = ?`,
    [product.id]
  );
  logger.info(
    `variants: ${variants.length}` +
      (variants.length
        ? " — " + variants.map((v: any) => `${v.title}${v.deleted_at ? " (deleted)" : ""}`).join(", ")
        : "")
  );

  const { rows: orphans } = await knex.raw(
    `SELECT v.id, v.value, v.created_at
       FROM product_option_value v
       LEFT JOIN product_option o ON o.id = v.option_id
      WHERE v.option_id IS NULL OR o.id IS NULL OR v.value IS NULL
      ORDER BY v.created_at DESC
      LIMIT 20`
  );
  logger.info(
    `orphaned/valueless product_option_value rows: ${orphans.length}` +
      (orphans.length ? " — " + orphans.map((o: any) => o.id).join(", ") : " (none)")
  );
}
