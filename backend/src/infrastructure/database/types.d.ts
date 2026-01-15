import type { Pool, PoolClient } from "pg";

/**
 * Error de PostgreSQL extendido con todos los campos posibles
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export type PostgresError = {
  name: string;
  severity: string;
  code: string;
  file: string;
  line: number | string;
  routine: string;
  message: string;
  position?: number | string;
  hint?: string;
  detail?: string;
  where?: string;
  schema?: string;
  table?: string;
  constraint?: string;
  column?: string;
  length?: number;
};

/**
 * Tipo de parámetro que PostgreSQL acepta nativamente
 */
type PostgresParam = string | number | boolean | null | Date | Buffer;

/**
 * Tipo de parámetro que el usuario puede pasar (incluye undefined para comodidad)
 * El undefined será convertido a null automáticamente antes de enviarlo a PostgreSQL
 */
type UserParam = PostgresParam | undefined;

/**
 * Resultado de una consulta a la base de datos
 * @template T - Tipo de datos del resultado
 * @template IsSingle - Si es un solo resultado (true) o array (false)
 *
 * Nota: Los parámetros pueden incluir undefined, que será convertido a null automáticamente
 */
export type DatabaseQueryArguments<T = any> = {
  query: string;
  params?: UserParam[];
  single: boolean;
  schema?: import("zod").z.ZodSchema<T>;
  emptyResponseMessageError?: string;
  isEmptyResponseAnError?: boolean;
  transactionPool?: Pool | PoolClient;
};

export type DatabaseQueryResult<T, IsSingle extends boolean> = Result<
  IsSingle extends true ? T : T[],
  PostgresError
>;
