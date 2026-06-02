# Instagram bot module

Automates the "comment a keyword → get a DM with the product link" flow on
Instagram. Fully implemented: data model, keyword/regex/exact matchers, webhook
(verify + HMAC), OAuth (Instagram API with Instagram Login), Graph client (DM +
public comment reply), processing workflow (rate limiter + 24h-window fallback),
admin UI (triggers + logs + analytics), and STOP opt-out.

## Data model

| Table | Purpose |
|---|---|
| `ig_trigger` | One row per (post, pattern, product) the merchant configures. |
| `ig_dm_log` | One row per processed comment (sent / failed / rate_limited / duplicate / opted_out / no_match). |
| `ig_opt_out` | IG users who replied STOP. Blocks future DMs globally. |

## HTTP endpoints

| Route | Purpose |
|---|---|
| `GET /hooks/instagram/webhook` | Meta webhook verification (`hub.verify_token` vs `IG_VERIFY_TOKEN`). |
| `POST /hooks/instagram/webhook` | Receives `comments` / `messages`; verifies HMAC (`IG_APP_SECRET`); emits events. |
| `GET /hooks/instagram/oauth/start` | Redirects to the Instagram authorization screen. |
| `GET /hooks/instagram/oauth/callback` | Exchanges code → long-lived token; logs token + user id. |
| `GET/POST /admin/instagram/triggers` | Manage keyword→product triggers. |
| `GET /admin/instagram/{logs,summary,analytics}` | DM log + dashboards. |

## OAuth / API

Uses **Instagram API with Instagram Login** (`graph.instagram.com`), scopes:
`instagram_business_basic`, `instagram_business_manage_messages`,
`instagram_business_manage_comments`. No Facebook Page token needed.

## Environment variables

Set on the backend host (Railway). Production backend URL: `https://api.lunulaoil.pl`.

```
ENABLE_INSTAGRAM_BOT=true
IG_APP_ID=                 # Meta app → App ID
IG_APP_SECRET=             # Meta app → App secret (also HMAC-verifies webhooks)
IG_VERIFY_TOKEN=           # any random string; must match the webhook config in Meta
IG_OAUTH_REDIRECT_URI=https://api.lunulaoil.pl/hooks/instagram/oauth/callback
STOREFRONT_URL=https://lunulaoil.pl
IG_BURST_PER_MINUTE=30     # optional, global DM rate limit (default 30)

# Optional fallback only — since the OAuth callback now persists the token in the
# DB (table ig_credential) and the ig-refresh-token job keeps it alive, you do NOT
# need to set these. They are read only if no DB credential exists.
IG_PAGE_ACCESS_TOKEN=
IG_BUSINESS_ACCOUNT_ID=
```

## Go-live

**1. Meta Developer App** ([developers.facebook.com](https://developers.facebook.com)):
- Create app, type **Business**.
- Add product **Instagram → "Instagram API with Instagram login"**.
- Copy **App ID** → `IG_APP_ID`, **App secret** → `IG_APP_SECRET`.
- OAuth **Redirect URI**: `https://api.lunulaoil.pl/hooks/instagram/oauth/callback`
- **Webhook** callback: `https://api.lunulaoil.pl/hooks/instagram/webhook`,
  verify token = your `IG_VERIFY_TOKEN`; subscribe to **comments** and **messages**.
- **App roles → Instagram Testers**: add the merchant's IG account; the merchant
  accepts the invite in Instagram. This lets the bot run for that account in
  **development mode — no App Review needed**.

**2. Deploy** with the env vars above (`ENABLE_INSTAGRAM_BOT=true`).

**3. Connect the account (one-time):** the merchant (logged into Instagram as the
brand) opens `https://api.lunulaoil.pl/hooks/instagram/oauth/start` and approves.
The callback **persists the long-lived token in the DB automatically** (table
`ig_credential`) — nothing to copy, no redeploy. The `ig-refresh-token` job
refreshes it before it expires (~60 days).

**4. Triggers:** admin → Instagram → add `ig_post_id` + pattern (e.g. `HIALCODE`)
+ `product_handle` (e.g. `hialcode`) + DM template (`{product_name}`,
`{product_url}` placeholders supported).

**5. Test:** comment the keyword on the post → bot sends the DM.

## Caveat: 24h messaging window

Meta only allows an automated DM in response to a comment **inside the 24h
standard messaging window**. Outside it, the workflow falls back to a public
comment reply (handled in `workflows/ig-process-comment`).

## Token persistence & refresh (implemented)

- The OAuth callback persists the long-lived token in the `ig_credential` table.
- The workflow reads the token **DB-first, env-fallback**.
- The `ig-refresh-token` scheduled job (daily) calls `refresh_access_token` once
  the token is within 10 days of expiry, so it never lapses.
- The raw token is **no longer logged** in plaintext.
