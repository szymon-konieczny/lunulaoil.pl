import { IgGraphError } from "./graph-client"

export type ShortLivedTokenResponse = {
  access_token: string
  user_id: string | number
  permissions?: string | string[]
}

export type LongLivedTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

export const buildAuthorizationUrl = (params: {
  clientId: string
  redirectUri: string
  scopes: string[]
  state?: string
}): string => {
  const url = new URL("https://www.instagram.com/oauth/authorize")
  url.searchParams.set("client_id", params.clientId)
  url.searchParams.set("redirect_uri", params.redirectUri)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", params.scopes.join(","))
  if (params.state) url.searchParams.set("state", params.state)
  return url.toString()
}

export const exchangeCodeForShortLivedToken = async (params: {
  clientId: string
  clientSecret: string
  redirectUri: string
  code: string
}): Promise<ShortLivedTokenResponse> => {
  const body = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    grant_type: "authorization_code",
    redirect_uri: params.redirectUri,
    code: params.code,
  })
  const res = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    throw new IgGraphError(
      typeof json.error_message === "string"
        ? json.error_message
        : `HTTP ${res.status}`,
      res.status,
      typeof json.code === "string" || typeof json.code === "number"
        ? json.code
        : "oauth_exchange",
      json
    )
  }
  return json as unknown as ShortLivedTokenResponse
}

export const exchangeForLongLivedToken = async (params: {
  clientSecret: string
  shortLivedToken: string
}): Promise<LongLivedTokenResponse> => {
  const url = new URL("https://graph.instagram.com/access_token")
  url.searchParams.set("grant_type", "ig_exchange_token")
  url.searchParams.set("client_secret", params.clientSecret)
  url.searchParams.set("access_token", params.shortLivedToken)
  const res = await fetch(url.toString(), { method: "GET" })
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const errorObj = (json.error ?? {}) as Record<string, unknown>
    throw new IgGraphError(
      typeof errorObj.message === "string"
        ? errorObj.message
        : `HTTP ${res.status}`,
      res.status,
      typeof errorObj.code === "string" || typeof errorObj.code === "number"
        ? errorObj.code
        : "oauth_long_lived",
      json
    )
  }
  return json as unknown as LongLivedTokenResponse
}

export const getInstagramUserInfo = async (params: {
  accessToken: string
}): Promise<{ id: string; username?: string }> => {
  const url = new URL("https://graph.instagram.com/v21.0/me")
  url.searchParams.set("fields", "id,username")
  url.searchParams.set("access_token", params.accessToken)
  const res = await fetch(url.toString())
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const errorObj = (json.error ?? {}) as Record<string, unknown>
    throw new IgGraphError(
      typeof errorObj.message === "string"
        ? errorObj.message
        : `HTTP ${res.status}`,
      res.status,
      typeof errorObj.code === "string" || typeof errorObj.code === "number"
        ? errorObj.code
        : "oauth_me",
      json
    )
  }
  return {
    id: String(json.id ?? ""),
    username: typeof json.username === "string" ? json.username : undefined,
  }
}
