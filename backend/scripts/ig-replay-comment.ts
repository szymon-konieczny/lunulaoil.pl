/**
 * ig-replay-comment.ts — replay ONE Instagram `comments` webhook event.
 *
 * Why this exists: Instagram does NOT deliver `comments` webhooks in development
 * mode (only `messages`), so the comment→DM flow can't be shown live during an
 * App Review screencast. This tool builds the EXACT payload Instagram would send,
 * signs it with `X-Hub-Signature-256` (HMAC-SHA256 keyed by IG_APP_SECRET) and
 * POSTs it to our own webhook — driving the real bot path.
 *
 * Use a REAL comment_id / media_id / from_id (comment from a second account on a
 * real post, then `GET /{media-id}/comments`). The bot then sends a REAL private
 * reply (DM) to that real commenter. The only thing "simulated" is webhook
 * *delivery* — in production Instagram does this automatically.
 *
 * Usage:
 *   IG_APP_SECRET=<secret of the TARGET env> \
 *   npm run ig:replay -- \
 *     --comment-id 17900000000000000 \
 *     --media-id   17841400000000000 \
 *     --from-id    17841400000000000 \
 *     --text HIAL \
 *     [--username someone] \
 *     [--account-id <ig business id>] \
 *     [--url https://api.lunulaoil.pl/hooks/instagram/webhook] \
 *     [--dry-run]
 *
 * IG_APP_SECRET MUST equal the secret on the target webhook's environment
 * (prod = api.lunulaoil.pl) — otherwise the webhook returns 401 Invalid signature.
 * Run with --dry-run first to inspect the payload without sending anything.
 */

import { createHmac } from "crypto"

const DEFAULT_URL = "https://api.lunulaoil.pl/hooks/instagram/webhook"

type Args = Record<string, string | boolean>

const parseArgs = (argv: string[]): Args => {
  const out: Args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith("--")) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith("--")) {
      out[key] = true
    } else {
      out[key] = next
      i++
    }
  }
  return out
}

const die = (msg: string): never => {
  console.error(`\n✗ ${msg}\n`)
  process.exit(1)
}

const str = (v: string | boolean | undefined): string | undefined =>
  typeof v === "string" ? v : undefined

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  const commentId = str(args["comment-id"])
  const mediaId = str(args["media-id"])
  const fromId = str(args["from-id"])
  const text = str(args["text"]) ?? "HIAL"
  const username = str(args["username"]) ?? null
  const accountId = str(args["account-id"]) ?? mediaId ?? "0"
  const url = str(args["url"]) ?? process.env.IG_WEBHOOK_URL ?? DEFAULT_URL
  const dryRun = args["dry-run"] === true
  const timeArg = str(args["time"])
  const time = timeArg ? Number(timeArg) : Math.floor(Date.now() / 1000)

  const secret = process.env.IG_APP_SECRET

  const missing = [
    !commentId && "--comment-id",
    !mediaId && "--media-id",
    !fromId && "--from-id",
  ].filter(Boolean) as string[]
  if (missing.length) {
    die(`Missing required: ${missing.join(", ")}. See file header for usage.`)
  }
  if (!secret) {
    die("IG_APP_SECRET env is required (must match the target webhook's env).")
  }

  // Exact shape the webhook route parses (entry[].changes[].value, field=comments)
  const payload = {
    object: "instagram",
    entry: [
      {
        id: accountId,
        time,
        changes: [
          {
            field: "comments",
            value: {
              id: commentId,
              text,
              from: username ? { id: fromId, username } : { id: fromId },
              media: { id: mediaId },
            },
          },
        ],
      },
    ],
  }

  const body = JSON.stringify(payload)
  const signature =
    "sha256=" + createHmac("sha256", secret!).update(body).digest("hex")

  console.log("\n— Payload —")
  console.log(JSON.stringify(payload, null, 2))
  console.log("\n— Signature —")
  console.log(`X-Hub-Signature-256: ${signature}`)
  console.log(`\n— Target —\n${url}`)

  if (dryRun) {
    const safeBody = body.replace(/'/g, "'\\''")
    console.log("\n(dry-run) Equivalent curl:\n")
    console.log(
      [
        `curl -X POST '${url}' \\`,
        `  -H 'Content-Type: application/json' \\`,
        `  -H 'X-Hub-Signature-256: ${signature}' \\`,
        `  -d '${safeBody}'`,
      ].join("\n")
    )
    console.log("\n(dry-run) Nothing sent.\n")
    return
  }

  console.log(
    "\n⚠️  SENDING — this drives the REAL bot path and sends a REAL DM to the commenter.\n"
  )

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hub-Signature-256": signature,
    },
    body,
  })

  const respText = await res.text()
  console.log(`← HTTP ${res.status}`)
  console.log(respText)

  if (res.status === 401) {
    console.log(
      "\n✗ 401 Invalid signature → IG_APP_SECRET ≠ the secret on the target env."
    )
  } else if (respText.includes('"skipped":"disabled"')) {
    console.log(
      "\n✗ Bot disabled → ENABLE_INSTAGRAM_BOT is not 'true' on the target env."
    )
  } else if (res.ok) {
    console.log(
      "\n✓ Accepted. Check admin → Instagram → logs for status 'sent', and the DM in the recipient's inbox."
    )
  }
}

main().catch((e) => die(e instanceof Error ? e.message : String(e)))
