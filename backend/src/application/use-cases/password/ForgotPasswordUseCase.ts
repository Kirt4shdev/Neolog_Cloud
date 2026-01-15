import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { ForgotPasswordContract } from "@core/password/contracts/ForgotPasswordContract";
import { EventService } from "@application/services/EventService";
import { PasswordRecoveryDomainEventFactory } from "@infrastructure/events/handlers/PasswordRecoveryDomainEventFactory";
import type { IPasswordRepository } from "@core/password/repositories/IPasswordRepository";
import type { IEmailSender } from "@core/shared/services/IEmailSender";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject("IPasswordRepository")
    private repository: IPasswordRepository,
    @inject("IEmailSender")
    private emailSender: IEmailSender
  ) {}

  public async execute(data: {
    contract: ForgotPasswordContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    const dto = DtoValidator.validate(ForgotPasswordContract, contract);

    const event = new PasswordRecoveryDomainEventFactory({
      ip: ctx?.ip,
      metadata: { email: contract?.email },
    });

    if (dto.error) {
      await EventService.emit(event.forgotPasswordWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid credentials";
      await EventService.emit(event.forgotPasswordWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    const { error: repositoryError, result: repositoryResult } =
      await this.repository.forgotPassword({
        email: dto.result.email,
      });

    if (repositoryError) {
      await EventService.emit(
        event.forgotPasswordWithFailure(repositoryError.message)
      );
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    if (!repositoryResult) {
      const errorMessage = "Email not found";
      await EventService.emit(event.forgotPasswordWithFailure(errorMessage));
      throw ServerError.notFound(errorMessage);
    }

    await EventService.emit(event.forgotPassword());

    // No poner el await porque el email se envía de forma asíncrona.
    // Si ponemos el await, el email se enviará de forma síncrona y bloquearemos la ejecución de la función.
    this.emailSender.send({
      to: repositoryResult.email,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Recuperación de contraseña</h2>
          <p>Has solicitado recuperar tu contraseña. Usa el siguiente token:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <code style="font-size: 16px; font-weight: bold;">${repositoryResult.token}</code>
          </div>
          <p>Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `,
    });

    return { email: repositoryResult.email };
  }
}
