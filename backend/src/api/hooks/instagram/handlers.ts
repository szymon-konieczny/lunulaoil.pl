import type { MedusaContainer } from "@medusajs/framework/types"
import type {
  InstagramChange,
  InstagramCommentValue,
  InstagramMessagingEvent,
  InstagramWebhookEntry,
  InstagramWebhookPayload,
} from "./types"
import { replyToComment, sendDirectMessage } from "./client"

export async function handleInstagramEvent(
  payload: InstagramWebhookPayload,
  scope: MedusaContainer
): Promise<void> {
  const logger = scope.resolve("logger")

  if (payload.object !== "instagram") {
    logger.warn(`Instagram webhook: unexpected object type "${payload.object}"`)
    return
  }

  for (const entry of payload.entry) {
    await handleEntry(entry, scope)
  }
}

async function handleEntry(entry: InstagramWebhookEntry, scope: MedusaContainer): Promise<void> {
  for (const change of entry.changes ?? []) {
    await handleChange(change, scope)
  }
  for (const messagingEvent of entry.messaging ?? []) {
    await handleMessagingEvent(messagingEvent, scope)
  }
}

async function handleChange(change: InstagramChange, scope: MedusaContainer): Promise<void> {
  const logger = scope.resolve("logger")

  if (change.field === "comments") {
    const comment = change.value as InstagramCommentValue
    logger.info(
      `Instagram comment received: id=${comment.id} from=@${comment.from?.username ?? "?"} text="${comment.text ?? ""}"`
    )
    await onCommentReceived(comment, scope)
    return
  }

  logger.debug(`Instagram webhook: unhandled change field "${change.field}"`)
}

async function handleMessagingEvent(
  event: InstagramMessagingEvent,
  scope: MedusaContainer
): Promise<void> {
  const logger = scope.resolve("logger")

  if (event.message?.is_echo) {
    return
  }

  if (event.message) {
    logger.info(
      `Instagram DM received: from=${event.sender.id} text="${event.message.text ?? ""}"`
    )
    await onDirectMessageReceived(event, scope)
    return
  }

  if (event.postback) {
    logger.info(`Instagram postback: from=${event.sender.id} payload=${event.postback.payload}`)
  }
}

async function onCommentReceived(
  comment: InstagramCommentValue,
  scope: MedusaContainer
): Promise<void> {
  const logger = scope.resolve("logger")

  const token = process.env.IG_PAGE_ACCESS_TOKEN
  if (!token || !comment.text) return

  // TODO: implement bot logic (keyword matching, intent detection, etc.)
  // Example placeholder — reply only when comment contains a trigger word.
  const trigger = process.env.IG_COMMENT_TRIGGER?.toLowerCase()
  if (!trigger || !comment.text.toLowerCase().includes(trigger)) return

  try {
    await replyToComment(comment.id, "Dziękujemy za komentarz! Napisaliśmy do Ciebie w DM 💌", token)
  } catch (err) {
    logger.error(`Failed to reply to comment ${comment.id}`, err as Error)
  }
}

async function onDirectMessageReceived(
  event: InstagramMessagingEvent,
  scope: MedusaContainer
): Promise<void> {
  const logger = scope.resolve("logger")

  const token = process.env.IG_PAGE_ACCESS_TOKEN
  if (!token || !event.message?.text) return

  // TODO: implement conversational logic (LLM, FAQ lookup, handoff to human)
  try {
    await sendDirectMessage(
      event.sender.id,
      "Dzień dobry! Otrzymaliśmy Twoją wiadomość i odpowiemy wkrótce.",
      token
    )
  } catch (err) {
    logger.error(`Failed to send DM to ${event.sender.id}`, err as Error)
  }
}
