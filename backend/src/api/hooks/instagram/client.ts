const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0"
const GRAPH_BASE = `https://graph.instagram.com/${GRAPH_VERSION}`

export async function replyToComment(
  commentId: string,
  message: string,
  accessToken: string
): Promise<void> {
  const res = await fetch(`${GRAPH_BASE}/${commentId}/replies`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, access_token: accessToken }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`IG reply failed (${res.status}): ${text}`)
  }
}

export async function sendDirectMessage(
  recipientIgsid: string,
  text: string,
  accessToken: string
): Promise<void> {
  const res = await fetch(`${GRAPH_BASE}/me/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientIgsid },
      message: { text },
      access_token: accessToken,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`IG DM failed (${res.status}): ${body}`)
  }
}
