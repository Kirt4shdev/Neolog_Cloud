import type { PostgresError } from "./types";

export abstract class PostgresErrorFactory {
  constructor(protected readonly error: PostgresError) {}

  /**
   * Obtiene los casos de error específicos para la consulta
   * @returns {Record<string, string>} Casos de error específicos para la consulta
   * @example
   * const errorCases = this.getErrorCases();
   */
  protected abstract getErrorCases(): Record<string, string>;

  /**
   * Obtiene el mensaje de error para la consulta
   * @param {string} error - Mensaje de error para la consulta
   * @returns {string} Mensaje de error para la consulta
   * @example
   * const errorString = this.errorString("User not found");
   */
  protected errorString(error: string): string {
    return JSON.stringify({
      message: error,
      detail: this.error?.detail,
      issue: this.error.message,
    });
  }

  /**
   * Obtiene los casos de error comunes para la consulta
   * @returns {Record<string, string>} Casos de error comunes para la consulta
   * @example
   * const commonErrorCases = this.getCommonErrorCases();
   */
  protected getCommonErrorCases(): Record<string, string> {
    return {
      NO_DATA: this.error?.message ?? "No data found",
      VALIDATION_ERROR: this.error?.message ?? "Validation error",
      P0001: this.error?.message ?? "Database exception", // RAISE EXCEPTION en funciones PL/pgSQL
      "23505": "Unique constraint violation",
      "42883": "No SQL function was found. Check if function was created in DB",
      "42703": "Invalid column name",
      "23503": "Foreign key violation",
      "23502": "Not null violation",
      "22P02": "Invalid text representation",
      "22003": "Numeric value out of range",
      "22001": "String data, right truncation",
      "22007": "Invalid datetime format",
      "22008": "Datetime field overflow",
      "22009": "Invalid time zone displacement value",
      "2200B": "Escape character conflict",
      "2200C": "Invalid use of escape character",
      "2200D": "Invalid escape octet",
      "2200F": "Zero length character string",
      "2200G": "Most specific type mismatch",
      "42P01": "Table does not exist",
      "42601": "Syntax error",
    };
  }

  /**
   * Obtiene el tipo de error para la consulta
   * @param {string} code - Código de error para la consulta
   * @returns {ApplicationErrorType} Tipo de error para la consulta
   * @example
   * const errorType = this.getErrorType("NO_DATA");
   */
  protected getErrorType(code: string): ApplicationErrorType {
    const errorTypeMap: Record<string, ApplicationErrorType> = {
      NO_DATA: "notFound",
      VALIDATION_ERROR: "internalServer",
      P0001: "badRequest", // RAISE EXCEPTION en funciones PL/pgSQL

      "23505": "conflict",
      "23503": "conflict",

      "42P01": "notFound",

      "22P02": "badRequest",
      "22003": "badRequest",
      "22001": "badRequest",
      "22007": "badRequest",
      "22008": "badRequest",
      "22009": "badRequest",
      "2200B": "badRequest",
      "2200C": "badRequest",
      "2200D": "badRequest",
      "2200F": "badRequest",
      "2200G": "badRequest",
      "42601": "badRequest",
      "42703": "badRequest",
      "42883": "badRequest",
      "23502": "badRequest",
    };

    return errorTypeMap[code] || "badRequest";
  }

  /**
   * Crea un error de aplicación para la consulta
   * @returns {ApplicationError} Error de aplicación para la consulta
   * @example
   * const error = this.create();
   */
  public create(): ApplicationError {
    const code = this.error?.code;

    if (!code || !this.error?.message)
      return {
        message: this.error?.message ?? "Unknown database error",
        type: "badRequest",
      };

    const errorCases = {
      ...this.getCommonErrorCases(),
      ...this.getErrorCases(),
    };

    if (errorCases[code]) {
      return {
        message: this.errorString(errorCases[code]),
        type: this.getErrorType(code),
      };
    }

    return {
      message: this.error?.message ?? "Unknown database error",
      type: "badRequest",
    };
  }
}
