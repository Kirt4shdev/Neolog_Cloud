/**
 * IEmailSender - Interfaz para envío de emails
 * Abstracción que permite desacoplar la lógica de negocio de la implementación técnica
 */
export interface IEmailSender {
  /**
   * Enviar email
   * @param options - Opciones del email (to, subject, html/text)
   */
  send(options: EmailOptions): Promise<void>;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}
