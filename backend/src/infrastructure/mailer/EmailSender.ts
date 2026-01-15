import nodemailer from "nodemailer";
import { Debug } from "@shared/utils/Debug";
import { envs } from "@shared/envs";
import { SMTP_EMAIL } from "@shared/constants/smtpEmail";
import type SMTPPool from "nodemailer/lib/smtp-pool";
import type { Transporter } from "nodemailer";
import type {
  IEmailSender,
  EmailOptions,
} from "@core/shared/services/IEmailSender";

export class EmailSender implements IEmailSender {
  #transporter: Transporter | undefined;

  constructor(private readonly smtpOptions: SMTPPool.Options) {
    this.smtpOptions = smtpOptions;
  }

  #handleMissingAuthSmtpOptions(): void {
    for (const [key, value] of Object.entries(this.smtpOptions?.auth!)) {
      if (!value) {
        Debug.error(`Missing SMTP auth option: ${key}`);
        throw new Error(`Missing SMTP auth option: ${key}`);
      }
    }
  }

  public async initTransporter(): Promise<void> {
    Debug.info("SMTP Mailer initializing...");

    this.#handleMissingAuthSmtpOptions();

    const transporter = nodemailer.createTransport(this.smtpOptions);

    await transporter
      .verify()
      .then(() => {
        Debug.success("SMTP Mailer ready");
        this.#transporter = transporter;
      })
      .catch((error: any) => {
        Debug.error("SMTP Mailer connection error");
        Debug.error(error.message);
        Debug.warning("Email sending will not be available");
        // No lanzar error - permitir que la app arranque sin SMTP
        this.#transporter = undefined;
      });

    return;
  }

  public async send(options: EmailOptions): Promise<void> {
    if (!this.#transporter) {
      Debug.error("SMTP Mailer not ready");
      throw new Error("SMTP Mailer not ready");
    }

    try {
      await this.#transporter.sendMail({
        from: {
          name: SMTP_EMAIL.FROM_NAME_DEFAULT,
          address: envs.SMTP_FROM_ADDRESS,
        },
        to: options?.to,
        subject: options?.subject,
        html: options?.html,
        text: options?.text,
      });

      Debug.success(`Email sent to ${options.to}`);
    } catch (error: any) {
      Debug.error({ SmtpEmailSender_sendEmail_ERROR: error });
      throw error;
    }
  }
}
