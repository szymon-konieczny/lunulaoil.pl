import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../modules/instagram_bot"
import type InstagramBotService from "../modules/instagram_bot/service"

type IgMessagePayload = {
  ig_user_id: string
  text: string
  message_id?: string | null
}

const STOP_KEYWORDS = ["stop", "unsubscribe", "stop sub", "wypisz"]

const isStopMessage = (text: string): boolean => {
  const normalized = text.trim().toLowerCase()
  if (!normalized) return false
  return STOP_KEYWORDS.some(
    (kw) => normalized === kw || normalized.startsWith(`${kw} `)
  )
}

export default async function igMessageReceivedHandler({
  event: { data },
  container,
}: SubscriberArgs<IgMessagePayload>): Promise<void> {
  if (process.env.ENABLE_INSTAGRAM_BOT !== "true") return
  if (!isStopMessage(data.text)) return

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const igBot = container.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

  const existing = await igBot.listIgOptOuts({ ig_user_id: data.ig_user_id })
  if (existing.length > 0) return

  await igBot.createIgOptOuts([{ ig_user_id: data.ig_user_id }])
  logger.info(`ig-message-received: opted out user ${data.ig_user_id}`)
}

export const config: SubscriberConfig = {
  event: "instagram.message.received",
}
