import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../../modules/instagram_bot"
import type InstagramBotService from "../../modules/instagram_bot/service"
import { IgGraphClient, IgGraphError } from "../../lib/instagram/graph-client"
import { buildProductUrl } from "../../lib/storefront-url"
import { getDefaultBurstLimiter } from "../../lib/instagram/burst-limiter"

export type IgProcessCommentInput = {
  ig_comment_id: string
  ig_post_id: string
  ig_user_id: string
  ig_username?: string | null
  text: string
}

export type IgProcessCommentResult = {
  status:
    | "sent"
    | "failed"
    | "rate_limited"
    | "duplicate"
    | "opted_out"
    | "no_match"
  log_id?: string
  dm_message_id?: string
  reason?: string
  used_comment_reply?: boolean
}

// Meta error codes that indicate we're outside the 24h standard messaging
// window (or the IG user has no message thread open). In those cases we
// fall back to a public comment reply, which is always allowed.
const OUTSIDE_WINDOW_CODES = new Set<string | number>([10, 100, 551, 2534022])

const renderTemplate = (
  template: string,
  vars: { product_name: string; product_url: string }
): string =>
  template
    .replace(/\{product_name\}/g, vars.product_name)
    .replace(/\{product_url\}/g, vars.product_url)

const isOutsideWindow = (err: IgGraphError): boolean =>
  OUTSIDE_WINDOW_CODES.has(err.code)

const processCommentStep = createStep(
  "ig-process-comment-step",
  async (
    input: IgProcessCommentInput,
    { container }
  ): Promise<StepResponse<IgProcessCommentResult>> => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const igBot = container.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

    const existing = await igBot.listIgDmLogs({
      ig_comment_id: input.ig_comment_id,
    })
    if (existing.length > 0) {
      return new StepResponse({
        status: "duplicate",
        log_id: existing[0].id,
      })
    }

    const triggers = await igBot.findActiveTriggersForPost(input.ig_post_id)
    const matched = igBot.matchComment(input.text, triggers)
    if (!matched) {
      return new StepResponse({ status: "no_match" })
    }

    const canSend = await igBot.canSendDm(input.ig_user_id, matched)
    if (!canSend.ok) {
      const [log] = await igBot.createIgDmLogs([
        {
          trigger_id: matched.id,
          ig_user_id: input.ig_user_id,
          ig_username: input.ig_username ?? null,
          ig_comment_id: input.ig_comment_id,
          comment_text: input.text,
          product_handle: matched.product_handle,
          product_url: "",
          status: canSend.reason,
        },
      ])
      return new StepResponse({
        status: canSend.reason,
        log_id: log.id,
      })
    }

    const burst = getDefaultBurstLimiter()
    const burstOk = await burst.consume("global")
    if (!burstOk) {
      const [log] = await igBot.createIgDmLogs([
        {
          trigger_id: matched.id,
          ig_user_id: input.ig_user_id,
          ig_username: input.ig_username ?? null,
          ig_comment_id: input.ig_comment_id,
          comment_text: input.text,
          product_handle: matched.product_handle,
          product_url: "",
          status: "rate_limited",
          error: "burst_limit",
        },
      ])
      return new StepResponse({
        status: "rate_limited",
        log_id: log.id,
        reason: "burst_limit",
      })
    }

    const productModule = container.resolve(Modules.PRODUCT)
    const products = await productModule.listProducts({
      handle: matched.product_handle,
    })
    const product = products[0]
    if (!product) {
      const [log] = await igBot.createIgDmLogs([
        {
          trigger_id: matched.id,
          ig_user_id: input.ig_user_id,
          ig_username: input.ig_username ?? null,
          ig_comment_id: input.ig_comment_id,
          comment_text: input.text,
          product_handle: matched.product_handle,
          product_url: "",
          status: "failed",
          error: `Product with handle "${matched.product_handle}" not found`,
        },
      ])
      return new StepResponse({
        status: "failed",
        log_id: log.id,
        reason: "product_not_found",
      })
    }

    const metadata = (matched as { metadata?: Record<string, unknown> | null })
      .metadata
    const countryCode =
      typeof metadata?.country_code === "string" ? metadata.country_code : "pl"
    const productUrl = buildProductUrl(matched.product_handle, countryCode)
    const dmText = renderTemplate(matched.dm_template, {
      product_name: product.title ?? matched.product_handle,
      product_url: productUrl,
    })

    const accessToken = process.env.IG_PAGE_ACCESS_TOKEN
    const businessAccountId = process.env.IG_BUSINESS_ACCOUNT_ID
    if (!accessToken || !businessAccountId) {
      const [log] = await igBot.createIgDmLogs([
        {
          trigger_id: matched.id,
          ig_user_id: input.ig_user_id,
          ig_username: input.ig_username ?? null,
          ig_comment_id: input.ig_comment_id,
          comment_text: input.text,
          product_handle: matched.product_handle,
          product_url: productUrl,
          status: "failed",
          error: "IG_PAGE_ACCESS_TOKEN or IG_BUSINESS_ACCOUNT_ID not configured",
        },
      ])
      return new StepResponse({
        status: "failed",
        log_id: log.id,
        reason: "missing_credentials",
      })
    }

    const client = new IgGraphClient({ accessToken, businessAccountId })

    try {
      const { message_id } = await client.sendDm(input.ig_user_id, dmText)
      const [log] = await igBot.createIgDmLogs([
        {
          trigger_id: matched.id,
          ig_user_id: input.ig_user_id,
          ig_username: input.ig_username ?? null,
          ig_comment_id: input.ig_comment_id,
          comment_text: input.text,
          product_handle: matched.product_handle,
          product_url: productUrl,
          dm_message_id: message_id,
          status: "sent",
        },
      ])
      return new StepResponse({
        status: "sent",
        log_id: log.id,
        dm_message_id: message_id,
      })
    } catch (err) {
      const isGraphErr = err instanceof IgGraphError
      const canFallback = isGraphErr && isOutsideWindow(err)

      if (canFallback) {
        try {
          const { id: replyId } = await client.replyToComment(
            input.ig_comment_id,
            dmText
          )
          const [log] = await igBot.createIgDmLogs([
            {
              trigger_id: matched.id,
              ig_user_id: input.ig_user_id,
              ig_username: input.ig_username ?? null,
              ig_comment_id: input.ig_comment_id,
              comment_text: input.text,
              product_handle: matched.product_handle,
              product_url: productUrl,
              dm_message_id: `reply:${replyId}`,
              status: "sent",
              error: "fallback_comment_reply",
            },
          ])
          logger.info(
            `ig-process-comment: fell back to comment reply for ${input.ig_comment_id}`
          )
          return new StepResponse({
            status: "sent",
            log_id: log.id,
            dm_message_id: replyId,
            used_comment_reply: true,
          })
        } catch (replyErr) {
          const replyMsg =
            replyErr instanceof IgGraphError
              ? `[${replyErr.status}/${replyErr.code}] ${replyErr.message}`
              : replyErr instanceof Error
                ? replyErr.message
                : "Unknown error"
          const [log] = await igBot.createIgDmLogs([
            {
              trigger_id: matched.id,
              ig_user_id: input.ig_user_id,
              ig_username: input.ig_username ?? null,
              ig_comment_id: input.ig_comment_id,
              comment_text: input.text,
              product_handle: matched.product_handle,
              product_url: productUrl,
              status: "failed",
              error: `dm+reply failed: ${replyMsg}`,
            },
          ])
          return new StepResponse({
            status: "failed",
            log_id: log.id,
            reason: replyMsg,
          })
        }
      }

      const errorMessage = isGraphErr
        ? `[${err.status}/${err.code}] ${err.message}`
        : err instanceof Error
          ? err.message
          : "Unknown error"
      logger.warn(
        `ig-process-comment: DM send failed for comment ${input.ig_comment_id}: ${errorMessage}`
      )
      const [log] = await igBot.createIgDmLogs([
        {
          trigger_id: matched.id,
          ig_user_id: input.ig_user_id,
          ig_username: input.ig_username ?? null,
          ig_comment_id: input.ig_comment_id,
          comment_text: input.text,
          product_handle: matched.product_handle,
          product_url: productUrl,
          status: "failed",
          error: errorMessage,
        },
      ])
      return new StepResponse({
        status: "failed",
        log_id: log.id,
        reason: errorMessage,
      })
    }
  }
)

export const igProcessCommentWorkflow = createWorkflow(
  "ig-process-comment",
  (input: IgProcessCommentInput) => {
    const result = processCommentStep(input)
    return new WorkflowResponse(result)
  }
)

export default igProcessCommentWorkflow
