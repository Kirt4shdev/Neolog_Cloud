import "reflect-metadata";
import { container } from "tsyringe";
import { EmailSender } from "./EmailSender";
import { envs } from "@shared/envs";

// Crear instancia singleton de SmtpEmailSender
const emailSender = new EmailSender({
  host: envs.SMTP_HOST,
  port: envs.SMTP_PORT,
  secure: envs.SMTP_SECURE,
  auth: {
    user: envs.SMTP_USERNAME,
    pass: envs.SMTP_PASSWORD,
  },
  from: envs.SMTP_FROM_ADDRESS,
  pool: true,
});

export function registerMailerDependencies() {
  // Registrar la instancia singleton como IEmailSender
  container.registerInstance("IEmailSender", emailSender);
}

// Exportar la instancia para inicialización en app.ts
export { emailSender as smtpEmailSender };
