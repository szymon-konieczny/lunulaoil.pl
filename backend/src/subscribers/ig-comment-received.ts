import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import igProcessCommentWorkflow, {
  type IgProcessCommentInput,
} from "../workflows/ig-process-comment"

export default async function igCommentReceivedHandler({
  event: { data },
  container,
}: SubscriberArgs<IgProcessCommentInput>): Promise<void> {
  if (process.env.ENABLE_INSTAGRAM_BOT !== "true") return

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const { result } = await igProcessCommentWorkflow(container).run({
      input: data,
    })
    logger.info(
      `ig-comment-received: processed comment ${data.ig_comment_id} → ${result.status}${
        result.reason ? ` (${result.reason})` : ""
      }`
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error(
      `ig-comment-received: workflow failed for comment ${data.ig_comment_id}: ${msg}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "instagram.comment.received",
}
