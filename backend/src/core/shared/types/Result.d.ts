/**
 * Result - Resultado de una operación
 * Se declara para poder tipar los resultados de las operaciones y tener intelisense en el editor de código.
 */
declare global {
  /**
   * Resultado de una operación
   * @param T - Tipo de resultado
   * @param E - Tipo de error
   * @returns Result<T, E>
   */
  type Result<T, E = ApplicationError> =
    | { error: E; result?: never }
    | { error?: never; result: T };
}

export {};
