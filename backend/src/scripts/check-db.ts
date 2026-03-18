import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function checkDb({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const regions = await query.graph({ entity: "region", fields: ["id", "name"] });
  logger.info(`Regions: ${JSON.stringify(regions.data)}`);

  const stockLocs = await query.graph({ entity: "stock_location", fields: ["id", "name"] });
  logger.info(`Stock locations: ${JSON.stringify(stockLocs.data)}`);

  const salesChannels = await query.graph({ entity: "sales_channel", fields: ["id", "name"] });
  logger.info(`Sales channels: ${JSON.stringify(salesChannels.data)}`);

  const products = await query.graph({ entity: "product", fields: ["id", "title"] });
  logger.info(`Products (${products.data.length}): ${JSON.stringify(products.data.map((p: any) => p.title))}`);

  const categories = await query.graph({ entity: "product_category", fields: ["id", "name"] });
  logger.info(`Categories: ${JSON.stringify(categories.data.map((c: any) => c.name))}`);
}
