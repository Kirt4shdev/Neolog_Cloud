declare global {
  /**
   * Tipo de error de aplicación
   */
  type ApplicationErrorType =
    | "badRequest"
    | "unauthorized"
    | "forbidden"
    | "notFound"
    | "conflict"
    | "tooManyRequests"
    | "internalServer"
    | "mappingError"
    | "unprocessableEntity"
    | "validationError";

  /**
   * Error de aplicación
   */
  interface ApplicationError {
    message: string;
    type: ApplicationErrorType;
  }
}

export {};
