# Instagram bot module

Automates the "comment a keyword, get a DM with the product link" flow on Instagram posts. Stage 1 (this file set) is the foundation: data model, matchers, service. No network I/O yet.

## Data model

| Table | Purpose |
|---|---|
| `ig_trigger` | One row per (post, pattern, product) triple configured by the merchant. |
| `ig_dm_log` | One row per comment we processed (sent / failed / rate-limited / duplicate / opted-out / no-match). |
| `ig_opt_out` | IG users who replied STOP. Blocks future DMs globally. |

## Environment variables (used by later stages)

Add to `backend/.env`:

```
IG_APP_SECRET=           # Meta app secret, used to HMAC-verify webhooks
IG_VERIFY_TOKEN=         # shared string used when registering the webhook
IG_PAGE_ACCESS_TOKEN=    # long-lived page token with instagram_manage_messages
IG_BUSINESS_ACCOUNT_ID=  # IG Business/Creator account id
STOREFRONT_URL=https://lunulaoil.pl
ENABLE_INSTAGRAM_BOT=false
```

## Meta sandbox setup (one-time, before stage 2)

1. Create a Meta app (type: **Business**) at [developers.facebook.com](https://developers.facebook.com).
2. Add the **Instagram** product and link a Facebook Page to an IG Business/Creator test account.
3. Request permissions: `instagram_basic`, `instagram_manage_comments`, `instagram_manage_messages`, `pages_show_list`, `pages_read_engagement`.
4. Generate a long-lived Page access token bound to the IG account.
5. Register the webhook callback URL `{BACKEND_URL}/hooks/instagram/webhook` with the verify token above. Subscribe to `comments` and `messages` on the IG account.
6. Add the merchant's real IG account as an **app tester** so it can receive DMs while the app is still in development mode (no review needed for sandbox).

## Caveat: 24h messaging window

Meta only allows an automated DM in response to a comment if sent **inside the 24h standard messaging window**. Outside that window a public comment reply is the only option — planned for stage 4 as a fallback path.

## Stages

1. **Foundation** *(this PR)* — module, models, migrations, matchers, service helpers.
2. **Meta integration** — webhook endpoints, signature verifier, Graph client, comment-processing workflow.
3. **Admin UI** — Medusa admin pages for triggers CRUD + DM log viewer.
4. **Analytics & polish** — dashboard chart, STOP opt-out, burst rate limiter, comment-reply fallback.
