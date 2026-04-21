export type InstagramWebhookPayload = {
  object: "instagram"
  entry: InstagramWebhookEntry[]
}

export type InstagramWebhookEntry = {
  id: string
  time: number
  changes?: InstagramChange[]
  messaging?: InstagramMessagingEvent[]
}

export type InstagramChange = {
  field: "comments" | "mentions" | "messages" | string
  value: InstagramCommentValue | Record<string, unknown>
}

export type InstagramCommentValue = {
  id: string
  text?: string
  from?: { id: string; username?: string }
  media?: { id: string; media_product_type?: string }
  parent_id?: string
}

export type InstagramMessagingEvent = {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message?: {
    mid: string
    text?: string
    is_echo?: boolean
    attachments?: Array<{ type: string; payload: Record<string, unknown> }>
  }
  postback?: { mid: string; title?: string; payload?: string }
}
