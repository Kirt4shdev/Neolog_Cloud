import { Pool } from "pg";
import { Debug } from "@shared/utils/Debug";
import { envs } from "@shared/envs";
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";
import { z } from "zod";
import type { PoolClient } from "pg";
import type {
  DatabaseQueryArguments,
  DatabaseQueryResult,
  PostgresError,
} from "./types";

class PostgresDatabase {
  #pool: Pool | null = null;
  #reconnecting: boolean = false;

  constructor(private readonly connectionString: string) {}

  /**
   * Inicializa el pool de conexiones
   * @throws {Error} Si el pool ya está inicializado.
   * @example
   * database.initPool();
   */
  public initPool(): void {
    if (this.#pool) {
      return Debug.warning("Pool already initialized");
    }

    Debug.info("Pool initializing...");

    this.#pool = new Pool({
      connectionString: this.connectionString,
      max: 100,
      min: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handler de errores del pool (crítico para evitar crashes)
    this.#pool.on("error", (err: any) => {
      Debug.error("Unexpected pool error (database connection lost):");
      Debug.error(`Code: ${err.code || "UNKNOWN"}`);
      Debug.error(`Message: ${err.message}`);

      // Si es un error de conexión terminal, intentar reconectar
      if (this.isTerminalError(err)) {
        Debug.warning(
          "Terminal database error detected. Attempting to reconnect..."
        );
        this.attemptReconnection();
      }
    });

    // Handler de conexión de cliente
    this.#pool.on("connect", () => {
      Debug.success("New client connected to pool");
    });

    // Handler de remoción de cliente
    this.#pool.on("remove", () => {
      Debug.info("Client removed from pool");
    });

    return Debug.success("Pool initialized successfully");
  }

  /**
   * Verifica si un error es terminal (requiere reconexión)
   */
  private isTerminalError(err: any): boolean {
    const terminalCodes = [
      "57P01", // terminating connection due to administrator command
      "57P02", // terminating connection due to crash
      "57P03", // cannot connect now
      "ECONNREFUSED", // Connection refused
      "ENOTFOUND", // Host not found
      "ETIMEDOUT", // Connection timeout
    ];

    return terminalCodes.includes(err.code);
  }

  /**
   * Intenta reconectar al pool después de un error terminal
   */
  private async attemptReconnection(): Promise<void> {
    // Evitar múltiples intentos de reconexión simultáneos
    if (this.#reconnecting) {
      return;
    }

    this.#reconnecting = true;

    try {
      // Esperar 5 segundos antes de intentar reconectar
      await new Promise((resolve) => setTimeout(resolve, 5000));

      Debug.info("Attempting to reconnect to database...");

      // Probar la conexión
      await this.isAlive(3, 2000);

      Debug.success("Successfully reconnected to database");
    } catch (error) {
      Debug.error("Failed to reconnect to database. Will retry on next query.");
    } finally {
      this.#reconnecting = false;
    }
  }

  /**
   * Cierra el pool de conexiones de manera segura
   * @example
   * await database.close();
   */
  public async close(): Promise<void> {
    if (!this.#pool) {
      return Debug.warning("Pool not initialized. Nothing to close.");
    }

    try {
      Debug.info("Closing database pool...");
      await this.#pool.end();
      this.#pool = null;
      Debug.success("Database pool closed successfully");
    } catch (error) {
      Debug.error("Error closing database pool:");
      Debug.error(error as string);
    }
  }

  /**
   * Verifica que la conexión a la base de datos esté activa
   * @param maxRetries - Número máximo de reintentos (default: 3)
   * @param retryDelay - Delay inicial entre reintentos en ms (default: 1000)
   * @throws {Error} Si no se puede establecer la conexión después de todos los reintentos
   * @example
   * await database.isAlive();
   * @example
   * await database.isAlive(5, 2000);
   */
  public async isAlive(
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<void> {
    if (!this.#pool) {
      throw new Error("Pool not initialized. Call initPool first.");
    }

    Debug.info("Checking database connection...");

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.#pool.query("SELECT NOW()");
        Debug.success("Database connection established");
        this.logPoolMetrics();
        return;
      } catch (error: any) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);

        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          Debug.warning(
            `Connection attempt ${attempt}/${maxRetries} failed: ${message}. Retrying in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(
      `Database connection failed after ${maxRetries} attempts: ${message}`
    );
  }

  /**
   * Muestra las métricas actuales del pool de conexiones
   * @example
   * database.logPoolMetrics();
   */
  public logPoolMetrics(): void {
    if (!this.#pool) {
      Debug.warning("Pool not initialized. Cannot log metrics.");
      return;
    }

    Debug.info("=== Pool Metrics ===");
    Debug.info(`Total connections: ${this.#pool.totalCount}`);
    Debug.info(`Idle connections: ${this.#pool.idleCount}`);
    Debug.info(`Waiting requests: ${this.#pool.waitingCount}`);
    const utilization =
      this.#pool.totalCount > 0
        ? Math.round(
            ((this.#pool.totalCount - this.#pool.idleCount) /
              this.#pool.totalCount) *
              100
          )
        : 0;
    Debug.info(`Pool utilization: ${utilization}%`);
    Debug.info("===================");
  }

  /**
   * Ejecuta una consulta a la base de datos
   * @param options - Argumentos de la consulta
   * @param options.query - Consulta SQL a ejecutar
   * @param options.params - Parámetros de la consulta (default: [])
   * @param options.single - Si debe retornar un solo resultado
   * @param options.schema - Esquema Zod para validación
   * @param options.emptyResponseMessageError - Mensaje de error para respuestas vacías
   * @param options.isEmptyResponseAnError - Si respuesta vacía es error (default: true)
   * @param options.transactionPool - Pool de transacción opcional
   * @returns Resultado de la consulta envuelto en Result<T, E>
   * @example
   * const { result, error } = await database.query({
   *   query: "SELECT * FROM users WHERE user_id = $1",
   *   params: [userId],
   *   single: true,
   *   emptyResponseMessageError: "User not found",
   *   isEmptyResponseAnError: true,
   *   schema: UserEntity,
   * });
   */
  public async query<T = unknown>(
    options: DatabaseQueryArguments<T> & { single: true }
  ): Promise<DatabaseQueryResult<T, true>>;

  public async query<T = unknown>(
    options: DatabaseQueryArguments<T> & { single: false }
  ): Promise<DatabaseQueryResult<T, false>>;

  public async query<T = unknown>({
    query,
    params = [],
    single,
    schema,
    emptyResponseMessageError = "Unhandled empty response message",
    isEmptyResponseAnError = true,
    transactionPool,
  }: DatabaseQueryArguments<T>): Promise<DatabaseQueryResult<T, boolean>> {
    const timer = new PerformanceTimer().init();
    if (!this.#pool && !transactionPool) {
      throw new Error("Pool not initialized. Call initPool first.");
    }

    const pool = transactionPool || this.#pool;

    // Normalizar params: convertir undefined a null (PostgreSQL no entiende undefined)
    const normalizedParams = params.map((param) =>
      param === undefined ? null : param
    );

    try {
      const result = await pool!.query(query, normalizedParams);

      if (result.rowCount === 0 && isEmptyResponseAnError) {
        const error: PostgresError = {
          name: "NotFoundError",
          message: emptyResponseMessageError,
          severity: "ERROR",
          code: "NO_DATA",
          routine: "query",
          line: 1,
          file: "database.ts",
        };

        return { error };
      }

      const rawResult = single ? result.rows[0] : result.rows;
      if (schema) {
        const validation = single
          ? schema.safeParse(rawResult)
          : z.array(schema).safeParse(rawResult);

        if (!validation.success) {
          const firstError = validation.error.issues[0];
          const error: PostgresError = {
            name: "ValidationError",
            message: `Database validation failed: ${firstError.path.join(
              "."
            )}: ${firstError.message}`,
            severity: "ERROR",
            code: "VALIDATION_ERROR",
            routine: "query",
            line: 1,
            file: "database.ts",
          };

          Debug.error(
            `Schema validation failed for query: ${query}\nError: ${validation.error.message}`
          );

          return { error };
        }

        return {
          result: validation.data as T | T[],
          error: undefined,
        };
      }

      // Si no hay schema, comportamiento original (sin validación)
      return {
        result: rawResult as T | T[],
        error: undefined,
      };
    } catch (error: any) {
      return { error };
    } finally {
      timer.stop(`Query: ${query}`);
    }
  }

  /**
   * Crea un pool de conexiones para transacciones
   * @returns {Promise<{pool: PoolClient, begin: () => Promise<void>, commit: () => Promise<void>, rollback: () => Promise<void>}>} Pool de conexiones para transacciones
   * @throws {Error} Si el pool no está inicializado. Llama a initPool primero.
   * @example
   * const { pool, begin, commit, rollback } = await database.createPoolWithTransaction();
   * try {
   *   await begin();
   *   await pool.query("BEGIN");
   *   await pool.query("COMMIT");
   *   await pool.query("ROLLBACK");
   * } catch (error) {
   *   await pool.query("ROLLBACK");
   * }
   */
  public async createPoolWithTransaction(): Promise<{
    pool: PoolClient;
    begin: () => Promise<void>;
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
  }> {
    if (!this.#pool) {
      throw new Error("Pool not initialized. Call initPool first.");
    }

    const pool = await this.#pool.connect();

    const transaction = {
      pool,
      begin: async () => {
        Debug.info("Transaction started");
        await pool.query("BEGIN");
      },
      commit: async () => {
        Debug.success("Transaction committed");
        await pool.query("COMMIT");
        pool.release();
        Debug.info("Transaction ended");
      },
      rollback: async () => {
        Debug.error("Transaction rolled back");
        await pool.query("ROLLBACK");
        Debug.info("Transaction ended");
        pool.release();
      },
    };

    return transaction;
  }
}

export const database = new PostgresDatabase(envs.POSTGRES_CONNECTION_STRING);
