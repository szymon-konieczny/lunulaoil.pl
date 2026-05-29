import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import nodemailer, { Transporter } from "nodemailer"

type SmtpOptions = {
  host: string
  port: number
  secure: boolean
  user?: string
  pass?: string
  from: string
}

type InjectedDependencies = {
  logger: Logger
}

/**
 * Notification provider that sends emails over SMTP (e.g. the VPS mail server
 * mail.lunulaoil.pl) using nodemailer. The subscriber builds the subject/html;
 * this provider just delivers `notification.content`.
 */
class SmtpNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "smtp"

  protected logger_: Logger
  protected options_: SmtpOptions
  protected transporter_: Transporter

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.host) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "SMTP notification: `host` option is required."
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "SMTP notification: `from` option is required."
      )
    }
  }

  constructor({ logger }: InjectedDependencies, options: SmtpOptions) {
    super()
    this.logger_ = logger
    this.options_ = options
    this.transporter_ = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth:
        options.user && options.pass
          ? { user: options.user, pass: options.pass }
          : undefined,
    })
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!notification?.to) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "SMTP notification: missing recipient (`to`)."
      )
    }

    const content = notification.content
    const from = notification.from?.trim() || this.options_.from

    try {
      const info = await this.transporter_.sendMail({
        from,
        to: notification.to,
        subject: content?.subject || "Lunula Botanique",
        text: content?.text || undefined,
        html: content?.html || undefined,
      })
      this.logger_.info(
        `SMTP notification sent to ${notification.to} (${info.messageId})`
      )
      return { id: info.messageId }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      this.logger_.error(`SMTP notification failed for ${notification.to}: ${msg}`)
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, msg)
    }
  }
}

export default SmtpNotificationProviderService
