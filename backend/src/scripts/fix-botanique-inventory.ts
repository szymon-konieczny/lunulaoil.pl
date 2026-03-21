import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixBotaniqueInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  const stockLocation = stockLocations[0]

  if (!stockLocation) {
    logger.error("No stock location found.")
    return
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
  })
  const existingItemIds = new Set(
    existingLevels.map((l: any) => l.inventory_item_id)
  )

  const inventoryLevels: CreateInventoryLevelInput[] = []
  for (const item of inventoryItems) {
    if (!existingItemIds.has(item.id)) {
      inventoryLevels.push({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      })
    }
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    })
    logger.info(`Created ${inventoryLevels.length} inventory levels.`)
  } else {
    logger.info("All inventory levels already exist.")
  }

  logger.info("Done!")
}
