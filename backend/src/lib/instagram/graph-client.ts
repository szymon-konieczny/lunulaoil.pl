const API_BASE = "https://graph.instagram.com/v21.0"

export class IgGraphError extends Error {
  readonly status: number
  readonly code: string | number
  readonly body: unknown

  constructor(
    message: string,
    status: number,
    code: string | number,
    body: unknown
  ) {
    super(message)
    this.name = "IgGraphError"
    this.status = status
    this.code = code
    this.body = body
  }

  get isRateLimit(): boolean {
    return (
      this.status === 429 ||
      this.code === 4 ||
      this.code === 17 ||
      this.code === 32 ||
      this.code === 613
    )
  }

  get isAuth(): boolean {
    return this.status === 401 || this.status === 403
  }
}

export type IgGraphClientOptions = {
  accessToken: string
  businessAccountId: string
  fetchImpl?: typeof fetch
}

export class IgGraphClient {
  private readonly token: string
  private readonly businessAccountId: string
  private readonly fetchImpl: typeof fetch

  constructor(opts: IgGraphClientOptions) {
    this.token = opts.accessToken
    this.businessAccountId = opts.businessAccountId
    this.fetchImpl = opts.fetchImpl ?? fetch
  }

  async sendDm(
    recipientIgId: string,
    text: string
  ): Promise<{ message_id: string }> {
    const res = await this.fetchImpl(
      `${API_BASE}/${this.businessAccountId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          recipient: { id: recipientIgId },
          message: { text },
        }),
      }
    )
    const json = (await res.json().catch(() => ({}))) as any
    if (!res.ok) {
      throw new IgGraphError(
        json?.error?.message ?? `HTTP ${res.status}`,
        res.status,
        json?.error?.code ?? "UNKNOWN",
        json
      )
    }
    return { message_id: String(json.message_id ?? "") }
  }

  async replyToComment(
    commentId: string,
    text: string
  ): Promise<{ id: string }> {
    const res = await this.fetchImpl(`${API_BASE}/${commentId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ message: text }),
    })
    const json = (await res.json().catch(() => ({}))) as any
    if (!res.ok) {
      throw new IgGraphError(
        json?.error?.message ?? `HTTP ${res.status}`,
        res.status,
        json?.error?.code ?? "UNKNOWN",
        json
      )
    }
    return { id: String(json.id ?? "") }
  }
}
