# Guía de Implementación de Funcionalidades en el Backend

Esta guía explica paso a paso cómo implementar una nueva funcionalidad en el backend, desde la definición del core hasta la exposición de endpoints REST. Usaremos el módulo de **Autenticación (Auth)** como ejemplo principal por su casuística completa.

---

## Tabla de Contenidos

1. [Estructura de Monorepo](#estructura-de-monorepo)
2. [Comandos del Package.json](#comandos-del-packagejson)
3. [Arquitectura General](#arquitectura-general)
4. [Paso 1: Definir el Core](#paso-1-definir-el-core)
5. [Paso 2: Implementar Infrastructure](#paso-2-implementar-infrastructure)
6. [Paso 3: Implementar Application Use Cases](#paso-3-implementar-application-use-cases)
7. [Paso 4: Crear Controllers](#paso-4-crear-controllers)
8. [Paso 5: Configurar Routes](#paso-5-configurar-routes)
9. [Flujo Completo de una Request](#flujo-completo-de-una-request)
10. [Middlewares y res.locals](#middlewares-y-reslocals)
11. [Carpeta Shared](#carpeta-shared)
12. [Decisiones Arquitectónicas Pragmáticas](#decisiones-arquitectónicas-pragmáticas)

---

## Estructura de Monorepo

Este backend **forma parte de un monorepo** que contiene tanto el frontend como el backend. La estructura del proyecto es:

```
dilus-app-template/
├── frontend/              # Aplicación React + Vite
├── backend/               # API REST con Express + PostgreSQL
├── package.json           # Configuración del workspace raíz
└── dist/                  # Build de producción (generado)
```

**Características del monorepo:**

- **Workspaces de npm** - Se usa `npm workspaces` para gestionar las dependencias compartidas
- **Dependencias compartidas** - Las dependencias comunes se instalan en la raíz y se comparten entre frontend y backend
- **Scripts coordinados** - Los scripts del `package.json` raíz permiten ejecutar ambos proyectos en paralelo
- **Build unificado** - Un solo comando construye tanto frontend como backend en la carpeta `dist/`

**Ventajas:**

- ✅ Instalación única de dependencias (`npm install` en la raíz)
- ✅ Reutilización de tipos entre frontend y backend (si se configura)
- ✅ Despliegue simplificado (todo en una carpeta `dist/`)
- ✅ Versionado coherente de dependencias

---

## Comandos del Package.json

### Comandos del Monorepo (raíz)

Ubicación: `/package.json`

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:backend dev:frontend",
    "dev:backend": "clear && npm --workspace backend run dev",
    "dev:frontend": "npm --workspace frontend run dev",
    "build": "rimraf dist && npm-run-all build:backend build:frontend",
    "build:frontend": "npm --workspace frontend run build",
    "build:backend": "npm --workspace backend run build",
    "database:create": "npm --workspace backend run database:create"
  }
}
```

**Comandos principales:**

- `npm run dev` - **Desarrollo en paralelo** - Ejecuta frontend y backend simultáneamente
- `npm run dev:backend` - Solo backend en modo desarrollo (con hot reload)
- `npm run dev:frontend` - Solo frontend en modo desarrollo (Vite dev server)
- `npm run build` - **Build de producción** - Construye frontend y backend en `dist/`
- `npm run database:create` - Crea la base de datos PostgreSQL

### Comandos del Backend

Ubicación: `/backend/package.json`

```json
{
  "scripts": {
    "transpile": "tsc -p . && tsc-alias && copyfiles -u 1 -f \"src/media/**/!(*.ts)\" dist/media",
    "copy:package": "node ./scripts/copy-package.js",
    "copy:env": "node ./scripts/copy-env.js",
    "dev": "cross-env DEBUG=backend:dev tsx --watch ./src/app.ts",
    "build": "rimraf ../dist/backend && npm-run-all transpile copy:package copy:env",
    "start": "npm run build && node ./dist/app.js",
    "database:create": "node ./scripts/create-database.js"
  }
}
```

**Comandos principales:**

- `npm run dev` - **Modo desarrollo** con hot reload (tsx watch + debug logs)
- `npm run build` - **Build de producción** (transpila TypeScript + copia archivos)
- `npm run start` - Construye y ejecuta el servidor en modo producción
- `npm run database:create` - Script para crear la base de datos desde cero

**Desglose del build:**

1. `transpile` - Compila TypeScript a JavaScript + resuelve alias + copia archivos estáticos
2. `copy:package` - Copia el `package.json` necesario a `dist/`
3. `copy:env` - Copia el `.env` a `dist/` (para producción)

**Variables de entorno:**

- `DEBUG=backend:dev` - Activa logs de debug en desarrollo
- Los archivos `.env` deben estar en `/backend/.env`

**Docker:**

El backend se conecta a servicios Docker (PostgreSQL y Valkey):

```bash
# Levantar servicios Docker
npm run docker:up

# Inicializar base de datos (genera + ejecuta SQL)
npm run database:init

# El backend se conectará automáticamente a:
# - PostgreSQL en localhost:5433 (puerto 5433 para evitar conflictos)
# - Valkey en localhost:6379
```

Ver [DOCKER.md](../DOCKER.md) para más información sobre Docker.

---

## Arquitectura General

El backend sigue una **arquitectura hexagonal (Clean Architecture)** con las siguientes capas:

```
backend/src/
├── core/                    # Lógica de negocio pura (domain)
│   ├── auth/
│   │   ├── contracts/       # DTOs de entrada (validados con Zod)
│   │   ├── entities/        # Modelos de dominio (validados con Zod)
│   │   ├── events/          # Interfaces de eventos de dominio
│   │   └── repositories/    # Interfaces de repositorios
│   └── shared/              # Tipos y contratos compartidos
│
├── infrastructure/          # Implementaciones técnicas
│   ├── database/
│   │   └── sql/
│   │       └── procedures/  # Funciones SQL almacenadas
│   ├── repositories/        # Implementación de repositorios
│   └── events/              # Implementación de eventos
│
├── application/             # Casos de uso y servicios
│   ├── use-cases/           # Casos de uso (ejecutados por input del cliente)
│   └── services/            # Servicios (usados internamente en middlewares)
│
└── presentation/            # Capa de presentación (REST API)
    ├── controllers/         # Controllers de Express
    ├── routes/              # Definición de rutas
    ├── middlewares/         # Middlewares de Express
    └── adapters/            # Adaptadores (ContextBuilder)
```

---

## Paso 1: Definir el Core

El core define la **lógica de negocio pura** sin dependencias externas. Todas las validaciones se hacen con **Zod**.

### 1.1 Constantes (`/src/shared/constants`)

**Las constantes deben declararse antes de usarlas en los contratos.**

```typescript
// backend/src/shared/constants/user.ts
export const USER = {
  NAME_MIN_LENGTH: 5,
  NAME_MAX_LENGTH: 50,
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  ROLES: ["admin", "client"],
} as const;
```

### 1.2 Contratos (`/src/core/auth/contracts`)

Los contratos definen los **datos de entrada** a través de la API.

```typescript
// backend/src/core/auth/contracts/LoginContract.ts
import { z } from "zod";
import { USER } from "@shared/constants/user";

/**
 * LoginContract - Contrato de login
 * @property email - Email del usuario
 * @property password - Contraseña del usuario
 */
export const LoginContract = z.object({
  email: z
    .string({ message: "email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" })
    .min(USER.EMAIL_MIN_LENGTH, {
      message: `email must be at least ${USER.EMAIL_MIN_LENGTH} characters`,
    })
    .max(USER.EMAIL_MAX_LENGTH, {
      message: `email must be at most ${USER.EMAIL_MAX_LENGTH} characters`,
    }),
  password: z
    .string({ message: "password is required" })
    .trim()
    .min(USER.PASSWORD_MIN_LENGTH, {
      message: `password must be at least ${USER.PASSWORD_MIN_LENGTH} characters`,
    })
    .max(USER.PASSWORD_MAX_LENGTH, {
      message: `password must be at most ${USER.PASSWORD_MAX_LENGTH} characters`,
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      {
        message:
          "password must include uppercase, lowercase, number, and special char",
      }
    ),
});

export type LoginContract = z.infer<typeof LoginContract>;
```

**Reglas importantes:**

- ✅ Usar constantes en lugar de magic numbers/strings
- ✅ Mensajes de error descriptivos
- ✅ Exportar tanto el schema como el tipo TypeScript

### 1.3 Entidades (`/src/core/auth/entities`)

Las entidades representan el **modelo de datos** que se devuelve desde la base de datos.

```typescript
// backend/src/core/auth/entities/AuthEntity.ts
import { USER } from "@shared/constants/user";
import { z } from "zod";

/**
 * AuthEntity - Entidad de autenticación
 * @property userId - ID del usuario
 * @property name - Nombre del usuario
 * @property email - Email del usuario
 */
export const AuthEntity = z.object({
  userId: z.uuid().trim(),
  name: z.string().trim().min(USER.NAME_MIN_LENGTH).max(USER.NAME_MAX_LENGTH),
  email: z
    .email({ message: "Invalid email address" })
    .min(USER.EMAIL_MIN_LENGTH)
    .max(USER.EMAIL_MAX_LENGTH)
    .trim()
    .toLowerCase(),
});

export type AuthEntity = z.infer<typeof AuthEntity>;
```

**Entidades base compartidas:**

Si tu entidad tiene campos comunes (createdAt, deletedAt, etc.), extiende de las entidades base:

```typescript
import { BaseEntity } from "@core/shared/base/BaseEntity";
import { CreatableEntity } from "@core/shared/base/CreatableEntity";
import { SoftDeletableEntity } from "@core/shared/base/SoftDeletableEntity";

// Ejemplo: Entidad con soft delete
export const RoleEntity = z
  .object({
    userId: z.uuid().trim(),
    roles: Roles,
  })
  .extend(CreatableEntity.shape) // Agrega createdAt, createdBy
  .extend(SoftDeletableEntity.shape) // Agrega deletedAt, deletedBy
  .strict();
```

### 1.4 Repositorios (`/src/core/auth/repositories`)

Define la **interfaz** del repositorio (el contrato de qué operaciones se pueden hacer).

```typescript
// backend/src/core/auth/repositories/IAuthRepository.ts
import type { LoginContract } from "../contracts/LoginContract";
import type { RegisterContract } from "../contracts/RegisterContract";
import type { AuthEntity } from "../entities/AuthEntity";

/**
 * IAuthRepository - Interfaz de repositorio de autenticación
 */
export interface IAuthRepository {
  /**
   * Método para iniciar sesión
   * @param data - Datos de login
   * @returns Promise<Result<AuthEntity>>
   */
  login(data: LoginContract): Promise<Result<AuthEntity>>;

  /**
   * Método para registrar un nuevo usuario
   * @param data - Datos de registro
   * @returns Promise<Result<AuthEntity>>
   */
  register(data: RegisterContract): Promise<Result<AuthEntity>>;
}
```

**Importante:**

- ✅ Todos los repositorios **siempre devuelven `Result<T>`** (Result Pattern)
- ✅ `Result` está definido en `/src/core/shared/types/Result.d.ts`

```typescript
// Result Pattern
type Result<T, E = ApplicationError> =
  | { result: T; error?: never }
  | { result?: never; error: E };
```

### 1.5 Eventos (`/src/core/auth/events`)

Define la **interfaz** de los eventos de dominio que puede emitir esta entidad.

```typescript
// backend/src/core/auth/events/IAuthDomainEventFactory.ts
import type { DomainEvent } from "@core/events/entities/DomainEvent";

export interface IAuthDomainEventFactory {
  login(): DomainEvent;
  loginWithFailure(failureReason?: string): DomainEvent;

  register(): DomainEvent;
  registerWithFailure(failureReason?: string): DomainEvent;

  logout(): DomainEvent;
  logoutWithFailure(failureReason?: string): DomainEvent;
}
```

---

## Paso 2: Implementar Infrastructure

La capa de infraestructura implementa los detalles técnicos (PostgreSQL, Redis, SMTP, etc.).

### 2.1 Funciones SQL (`/src/infrastructure/database/sql/procedures`)

**Todas las operaciones de base de datos deben ser funciones SQL almacenadas en PostgreSQL.**

**Estructura de carpetas:**

```
backend/src/infrastructure/database/sql/procedures/
├── auth/
│   ├── login.sql
│   └── register.sql
├── role/
│   ├── assign_role.sql
│   └── remove_role.sql
└── session/
    ├── create_session.sql
    ├── get_sessions_by_user_id.sql
    └── delete_session.sql
```

**Ejemplo de función SQL:**

```sql
-- backend/src/infrastructure/database/sql/procedures/auth/login.sql
DROP FUNCTION IF EXISTS login(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION login(
    _email VARCHAR,
    _userPassword VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    name VARCHAR,
    email VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id AS "userId", u.name, u.email
    FROM users u
    WHERE u.email = _email
      AND u.password = crypt(_userPassword, u.password);
END;
$$ LANGUAGE plpgsql;
```

**Reglas importantes:**

- ✅ Usar `DROP FUNCTION IF EXISTS ... CASCADE` al inicio
- ✅ Nombres de columnas en camelCase con comillas dobles: `"userId"`
- ✅ `RETURNS TABLE` debe coincidir exactamente con la entidad TypeScript
- ✅ **NO usar casts explícitos** (`::VARCHAR`, `::TEXT`) en el SELECT (PostgreSQL infiere el tipo)

### 2.2 PostgresDatabase.ts - La Capa de Acceso a Datos

`PostgresDatabase.ts` es la **única clase que interactúa con PostgreSQL**. Proporciona una capa de abstracción sobre `node-postgres (pg)` con validación automática de Zod, manejo de errores y soporte para transacciones.

**Ubicación:** `/src/infrastructure/database/PostgresDatabase.ts`

#### Características principales:

**1. Pool de Conexiones**

Maneja un pool de conexiones reutilizables a PostgreSQL:

```typescript
database.initPool(); // Inicializa el pool (max: 100, min: 10)
await database.isAlive(); // Verifica que la conexión esté activa (con reintentos)
database.logPoolMetrics(); // Muestra métricas del pool
```

**2. Método `query()` - Ejecución de Consultas**

El método principal que **todos los repositorios deben usar**:

```typescript
const { result, error } = await database.query({
  query: "SELECT * FROM login($1, $2)",
  params: [email, password],
  single: true, // true = objeto, false = array
  schema: AuthEntity, // Esquema Zod para validar
  emptyResponseMessageError: "User not found",
  isEmptyResponseAnError: true, // Si respuesta vacía es error
});
```

**Flujo interno del método `query()`:**

```
1. Normaliza params (undefined → null)
   ↓
2. Ejecuta query en PostgreSQL
   ↓
3. Si rowCount === 0 y isEmptyResponseAnError === true
   → Devuelve { error: NotFoundError }
   ↓
4. Valida respuesta con schema de Zod
   → Si falla: { error: ValidationError }
   ↓
5. Devuelve { result: data validada }
```

**3. Validación Automática con Zod**

Si proporcionas un `schema`, `PostgresDatabase` valida la respuesta automáticamente:

- Para `single: true` → Valida con `schema.safeParse(row)`
- Para `single: false` → Valida con `z.array(schema).safeParse(rows)`

**Ventajas:**

- ✅ **Type safety** - Los datos están garantizados por Zod
- ✅ **Fail fast** - Errores de validación se detectan inmediatamente
- ✅ **Sin datos corruptos** - Solo se devuelven datos validados

**4. Soporte para Transacciones**

Para operaciones que requieren atomicidad:

```typescript
const { pool, begin, commit, rollback } =
  await database.createPoolWithTransaction();

try {
  await begin();

  await database.query({
    query: "SELECT * FROM transfer_funds($1, $2, $3)",
    params: [fromUserId, toUserId, amount],
    transactionPool: pool, // ✅ Usa el pool de la transacción
    single: true,
    schema: TransferEntity,
  });

  await database.query({
    query: "SELECT * FROM log_transfer($1)",
    params: [transferId],
    transactionPool: pool,
    single: false,
    schema: LogEntity,
  });

  await commit(); // ✅ Confirma cambios
} catch (error) {
  await rollback(); // ❌ Revierte cambios
  throw error;
}
```

**5. Manejo de Errores**

`PostgresDatabase` devuelve errores estructurados usando el **Result Pattern**:

```typescript
type Result<T, E = PostgresError> =
  | { result: T; error?: never }
  | { result?: never; error: E };
```

**Tipos de errores que devuelve:**

- `NotFoundError` - Cuando `rowCount === 0` y `isEmptyResponseAnError === true`
- `ValidationError` - Cuando la validación de Zod falla
- `PostgreSQL Errors` - Errores nativos de PostgreSQL (23505, 42883, etc.)

**6. Performance Monitoring**

Cada query registra automáticamente su tiempo de ejecución con `PerformanceTimer`:

```
Query: SELECT * FROM login($1, $2) - 12.34ms
```

---

### 2.3 Repositorios (`/src/infrastructure/repositories`)

Implementa la interfaz del repositorio usando `PostgresDatabase.query()`.

```typescript
// backend/src/infrastructure/repositories/auth/AuthRepository.ts
import { database } from "@infrastructure/database/PostgresDatabase";
import { AuthRepositoryErrorFactory } from "./AuthRepositoryErrorFactory";
import { AuthEntity } from "@core/auth/entities/AuthEntity";
import type { LoginContract } from "@core/auth/contracts/LoginContract";
import type { IAuthRepository } from "@core/auth/repositories/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  public async login(data: LoginContract): Promise<Result<AuthEntity>> {
    const { error, result } = await database.query({
      query: "SELECT * FROM login($1, $2)",
      params: [data?.email, data?.password],
      single: true,
      schema: AuthEntity,
      emptyResponseMessageError: "User not found",
    });

    if (error) {
      return { error: new AuthRepositoryErrorFactory(error).create() };
    }

    return { result };
  }
}
```

**Parámetros de `database.query()`:**

- `query`: La consulta SQL con placeholders `$1, $2, ...`
- `params`: Array de parámetros en orden
- `single`: `true` para un solo resultado, `false` para array
- `schema`: Schema de Zod para validar la respuesta
- `emptyResponseMessageError`: Mensaje si no hay resultados
- `isEmptyResponseAnError`: `true` si respuesta vacía es error (default: `false`)
- `transactionPool`: Pool de transacción opcional (para atomicidad)

### 2.4 Error Factory (`/src/infrastructure/repositories/auth`)

Extiende `PostgresErrorFactory` para manejar errores específicos o sobrescribir errores ya existentes.

```typescript
// backend/src/infrastructure/repositories/auth/AuthRepositoryErrorFactory.ts
import { PostgresErrorFactory } from "@infrastructure/database/PostgresErrorFactory";

export class AuthRepositoryErrorFactory extends PostgresErrorFactory {
  protected getErrorCases(): Record<string, string> {
    return {
      "23505": "User already registered",
      // Puedes agregar más casos específicos aquí
    };
  }
}
```

**Códigos de error PostgreSQL comunes:**

- `23505`: Violación de constraint UNIQUE
- `23503`: Violación de foreign key
- `23502`: Violación de NOT NULL
- `P0001`: RAISE EXCEPTION en funciones PL/pgSQL
- `42883`: Función SQL no existe
- `42804`: Tipos no coinciden en RETURNS TABLE

### 2.5 Registro de Dependencias

Registra los repositorios en el contenedor de inyección de dependencias.

```typescript
// backend/src/infrastructure/repositories/auth/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { AuthRepository } from "./AuthRepository";

export function registerAuthDependencies() {
  container.registerSingleton("IAuthRepository", AuthRepository);
}
```

Luego, importa y registra en el archivo central:

```typescript
// backend/src/infrastructure/registerAllDependencies.ts
import { registerAuthDependencies } from "./repositories/auth";

export function registerAllDependencies() {
  registerAuthDependencies();
  // ... otros registros
}
```

### 2.6 Event Factory (`/src/infrastructure/events/handlers`)

Implementa la interfaz de eventos de dominio.

```typescript
// backend/src/infrastructure/events/handlers/AuthDomainEventFactory.ts
import type { IAuthDomainEventFactory } from "@core/auth/events/IAuthDomainEventFactory";
import type { DomainApplicationEvent } from "../DomainApplicationEvent";

export class AuthDomainEventFactory implements IAuthDomainEventFactory {
  constructor(public event?: Partial<DomainApplicationEvent>) {
    this.event = event;
  }

  login(): DomainApplicationEvent {
    return {
      ...this.event,
      action: "login",
      table: "users",
      isSuccessful: true,
      endpoint: "/api/unprotected/auth/login",
      requiredRole: undefined,
      occurredAt: new Date(),
      method: "POST",
    };
  }

  loginWithFailure(failureReason?: string): DomainApplicationEvent {
    return {
      ...this.event,
      action: "login",
      table: "users",
      isSuccessful: false,
      endpoint: "/api/unprotected/auth/login",
      requiredRole: undefined,
      occurredAt: new Date(),
      failureReason: failureReason,
      method: "POST",
    };
  }

  // ... otros eventos
}
```

---

## Paso 3: Implementar Application Use Cases

Los casos de uso orquestan la lógica de negocio y coordinan repositorios, validaciones y eventos.

### 3.1 Diferencia entre Use Cases y Services

**Use Cases (`/application/use-cases`):**

- Se ejecutan **por input directo del cliente** (endpoint REST)
- Emiten eventos de dominio
- Validan DTOs con `DtoValidator`
- Ejemplo: LoginUseCase, RegisterUseCase, AssignRoleUseCase

**Services (`/application/services`):**

- Se usan **internamente en middlewares**
- NO emiten eventos de dominio
- Validaciones mínimas
- Ejemplo: UserService (para `checkUser`), RoleService (para `checkRoles`)

### 3.2 Decisión Pragmática: Event Factories desde Infrastructure

**⚠️ Importante - Decisión Arquitectónica:**

Por **pragmatismo**, los Event Factories se importan **directamente desde Infrastructure** en los Use Cases:

```typescript
// ✅ Importación pragmática aceptada
import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
```

**¿Por qué está permitido?**

Técnicamente, Application no debería depender de Infrastructure (viola Clean Architecture estricta). Sin embargo, **esta violación es aceptable** porque:

1. ✅ **Event Factories son helpers sin lógica de negocio** - Solo construyen objetos de datos
2. ✅ **Ya implementan interfaces del Core** - `AuthDomainEventFactory implements IAuthDomainEventFactory`
3. ✅ **No afectan testabilidad crítica** - Los eventos son fire-and-forget (no bloquean flujo de negocio)
4. ✅ **Simplicidad sobre purismo** - Evita over-engineering con DI de factories

**Alternativa purista (NO recomendada para este proyecto):**

Si quisieras ser 100% purista, tendrías que:

- Inyectar Event Factories por DI
- Registrar cada factory en el contenedor
- Agregar método `create()` a la interfaz

**Esto añade complejidad innecesaria para el beneficio obtenido.**

**Conclusión:** Esta es una **violación menor y pragmática** de Clean Architecture que priorizamos por simplicidad y velocidad de desarrollo.

### 3.3 Estructura de un Use Case

**Pasos obligatorios en orden:**

1. Inicializar evento de dominio
2. Validar datos de entrada con `DtoValidator`
3. Manejar errores de validación y emitir eventos
4. Llamar al repositorio
5. Manejar errores del repositorio y emitir eventos
6. Emitir evento de éxito
7. Devolver resultado

**Ejemplo completo:**

```typescript
// backend/src/application/use-cases/auth/LoginUseCase.ts
import { injectable, inject } from "tsyringe";
import { ServerError } from "@shared/utils/ServerError";
import { DtoValidator } from "@shared/utils/DtoValidator";
import { LoginContract } from "@core/auth/contracts/LoginContract";
import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
import { EventService } from "@application/services/EventService";
import type { IAuthRepository } from "@core/auth/repositories/IAuthRepository";

@injectable()
export class LoginUseCase {
  constructor(
    @inject("IAuthRepository")
    private readonly authRepository: IAuthRepository
  ) {}

  public async execute(data: {
    contract: LoginContract;
    ctx: ExecutionContext;
  }) {
    const { contract, ctx } = data;

    // 1. Inicializar evento
    const event = new AuthDomainEventFactory({
      ip: ctx?.ip,
      metadata: { email: contract?.email },
    });

    // 2. Validar datos de entrada
    const dto = DtoValidator.validate(LoginContract, contract);

    // 3. Manejar errores de validación
    if (dto.error) {
      await EventService.emit(event.loginWithFailure(dto.error));
      throw ServerError.badRequest(dto.error);
    }

    if (!dto.result) {
      const errorMessage = "Invalid login data";
      await EventService.emit(event.loginWithFailure(errorMessage));
      throw ServerError.badRequest(errorMessage);
    }

    // Validación de lógica de negocio (opcional)
    const jwtToken = ctx.jwt;
    if (jwtToken) {
      await EventService.emit(event.loginWithFailure("User already logged in"));
      throw ServerError.badRequest("User already logged in");
    }

    // 4. Llamar al repositorio
    const { error: repositoryError, result: repositoryResult } =
      await this.authRepository.login(dto.result);

    // 5. Manejar errores del repositorio
    if (repositoryError) {
      await EventService.emit(event.loginWithFailure(repositoryError.message));
      throw ServerError[repositoryError.type](repositoryError.message);
    }

    // 6. Emitir evento de éxito
    await EventService.emit(event.login());

    // 7. Devolver resultado
    return repositoryResult;
  }
}
```

**ExecutionContext:**

- El contexto contiene información de la request y response de Express
- Se construye con `ContextBuilder.build(req, res)`
- Contiene: `ip`, `userId`, `adminId`, `clientId`, `jwt`, `sessionId`, `clientInfo`

---

## Paso 4: Crear Controllers

Los controllers son la **capa de presentación** que conecta HTTP con los casos de uso.

### 4.1 Responsabilidades del Controller

**El controller SOLO debe:**

1. Resolver el caso de uso (dependency injection)
2. Construir el contexto con `ContextBuilder`
3. Llamar al caso de uso con el contexto
4. Devolver la respuesta HTTP

**NO debe:**

- ❌ Validar datos (lo hace el use case)
- ❌ Emitir eventos (lo hace el use case)
- ❌ Contener lógica de negocio

### 4.2 ContextBuilder

`ContextBuilder` convierte `req` y `res` de Express en un `ExecutionContext` tipado.

```typescript
// backend/src/presentation/adapters/ContextBuilder.ts
export class ContextBuilder {
  private static base(req: Request, res: Response): ExecutionContext {
    return {
      ip: req?.ip || req?.socket?.remoteAddress || "unknown",
      userId: res?.locals?.userId as UUID,
      adminId: res?.locals?.adminId as UUID,
      clientId: res?.locals?.clientId as UUID,
      jwt: req?.cookies?.jwt,
      sessionId: req?.cookies?.session as UUID,
      clientInfo: res?.locals?.clientInfo as ClientInfo,
    };
  }

  static build(req: Request, res: Response): ExecutionContext {
    return this.base(req, res);
  }
}
```

**Uso en controllers:**

Los use cases ahora reciben un objeto con dos propiedades: `contract` (datos de entrada) y `ctx` (contexto de ejecución).

```typescript
// Caso simple: pasar contract del body
const ctx = ContextBuilder.build(req, res);
await useCase.execute({
  contract: req.body,
  ctx: ctx,
});

// Caso con propiedades adicionales en el contract (ej: createdBy)
const ctx = ContextBuilder.build(req, res);
await useCase.execute({
  contract: { ...req.body, createdBy: ctx.adminId },
  ctx: ctx,
});

// Caso complejo (Auth): enriquecer contract con info generada en el controller
const user = await loginUseCase.execute({
  contract: req.body,
  ctx: ctx,
});

const jwt = Jwt.createToken({ userId: user.userId });

await createSessionUseCase.execute({
  contract: {
    userId: user.userId as UUID,
    jwt: jwt.token,
    ...ctx?.clientInfo,
  },
  ctx: ctx,
});
```

### 4.3 Ejemplo de Controller

```typescript
// backend/src/presentation/controllers/Auth.controller.ts
import { container } from "tsyringe";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { CreateSessionUseCase } from "@application/use-cases/session/CreateSessionUseCase";
import { ContextBuilder } from "@presentation/adapters/ContextBuilder";
import { Jwt } from "@shared/utils/Jwt";
import type { Request, Response } from "express";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const loginUseCase = container.resolve(LoginUseCase);
    const createSessionUseCase = container.resolve(CreateSessionUseCase);

    const ctx = ContextBuilder.build(req, res);

    const user = await loginUseCase.execute({
      contract: req.body,
      ctx: ctx,
    });

    const jwt = Jwt.createToken({ userId: user.userId });

    const session = await createSessionUseCase.execute({
      contract: {
        userId: user.userId as UUID,
        jwt: jwt.token,
        ...ctx?.clientInfo,
      },
      ctx: ctx,
    });

    // Guardar JWT en cookie
    res.cookie(jwt.cookieName, jwt.token, jwt.options);

    // Guardar session ID en cookie
    res.cookie("session", session.sessionId, jwt.options);

    return res
      .status(200)
      .json({ message: `${user.email} successfully logged in` });
  }
}
```

**Controller simple (90% de los casos):**

```typescript
// backend/src/presentation/controllers/Role.controller.ts
export class RoleController {
  public static async assignRole(
    req: Request,
    res: Response
  ): Promise<Response> {
    const assignRoleUseCase = container.resolve(AssignRoleUseCase);

    const ctx = ContextBuilder.build(req, res);

    const role = await assignRoleUseCase.execute({
      contract: { ...req.body, createdBy: ctx.adminId },
      ctx: ctx,
    });

    return res.status(200).json({
      message: "Role assigned successfully",
      data: role,
    });
  }
}
```

---

## Paso 5: Configurar Routes

Las rutas definen los endpoints y aplican middlewares específicos.

### 5.1 Estructura de Routes

```
backend/src/presentation/routes/
├── ApiRouter.ts                  # Router principal de /api (protegido)
├── unprotected/
│   ├── UnprotectedRouter.ts      # Router de /unprotected (sin auth)
│   └── Auth.routes.ts
├── admin/
│   ├── AdminRouter.ts            # Aplica requireAdminAuth
│   ├── Role.routes.ts
│   └── Users.routes.ts
├── user/
│   ├── UserRouter.ts
│   └── Profile.routes.ts
└── common/
    └── CommonRouter.ts
```

### 5.2 Ejemplo de Routes

**Rutas sin protección (login, register):**

```typescript
// backend/src/presentation/routes/unprotected/Auth.routes.ts
import { Router } from "express";
import { AuthController } from "@presentation/controllers/Auth.controller";
import { checkUser } from "@presentation/middlewares/auth/checkUser";
import { asyncHandler } from "@presentation/helpers/asyncHandler";

export class AuthRoutes {
  public static get routes(): Router {
    const router = Router();
    const authRouter = Router();

    authRouter.post("/login", AuthController.login);
    authRouter.post("/register", AuthController.register);

    // Logout requiere autenticación
    authRouter.get("/logout", asyncHandler(checkUser), AuthController.logout);

    router.use("/auth", authRouter);

    return router;
  }
}
```

**Rutas protegidas (solo admin):**

```typescript
// backend/src/presentation/routes/admin/Role.routes.ts
import { Router } from "express";
import { RoleController } from "@presentation/controllers/Role.controller";

export class RoleRoutes {
  public static get routes(): Router {
    const router = Router();
    const roleRouter = Router();

    roleRouter.post("/", RoleController.assignRole);
    roleRouter.delete("/", RoleController.removeRole);

    router.use("/role", roleRouter);

    return router;
  }
}
```

### 5.3 Routers de Scope

**UnprotectedRouter** (sin autenticación):

```typescript
// backend/src/presentation/routes/unprotected/UnprotectedRouter.ts
import { Router } from "express";
import { AuthRoutes } from "./Auth.routes";
import { PasswordRoutes } from "./Password.routes";
import { HealthRoutes } from "./Health.routes";

export class UnprotectedRouter {
  static init(): Router {
    const unprotectedRouter = Router();

    unprotectedRouter.use(AuthRoutes.routes);
    unprotectedRouter.use(PasswordRoutes.routes);
    unprotectedRouter.use(HealthRoutes.routes);

    return unprotectedRouter;
  }
}
```

**AdminRouter** (solo admins):

```typescript
// backend/src/presentation/routes/admin/AdminRouter.ts
import { Router } from "express";
import { RoleRoutes } from "./Role.routes";
import { BlacklistRoutes } from "./BlackList.routes";
import { UsersRoutes } from "./Users.routes";
import { requireAdminAuth } from "@presentation/middlewares/auth/requireAdminAuth";
import { asyncHandler } from "@presentation/helpers/asyncHandler";

export class AdminRouter {
  public static init(): Router {
    const adminRouter = Router();

    // Este middleware se aplica a TODAS las rutas de admin
    adminRouter.use(asyncHandler(requireAdminAuth));

    adminRouter.use(RoleRoutes.routes);
    adminRouter.use(BlacklistRoutes.routes);
    adminRouter.use(UsersRoutes.routes);

    return adminRouter;
  }
}
```

### 5.4 ApiRouter (Orquestador de rutas protegidas)

```typescript
// backend/src/presentation/routes/ApiRouter.ts
import { Router } from "express";
import { CommonRouter } from "./common/CommonRouter";
import { UserRouter } from "./user/UserRouter";
import { AdminRouter } from "./admin/AdminRouter";
import { ClientRouter } from "./client/ClientRouter";
import { requireValidToken } from "@presentation/middlewares/auth/requireValidToken";
import { checkUser } from "@presentation/middlewares/auth/checkUser";
import { checkBlacklist } from "@presentation/middlewares/auth/checkBlacklist";
import { asyncHandler } from "@presentation/helpers/asyncHandler";
import { checkRoles } from "@presentation/middlewares/auth/checkRoles";
import { checkSession } from "@presentation/middlewares/auth/checkSession";

export class ApiRouter {
  public static init(): Router {
    const apiRouter = Router();

    // Middlewares que se aplican a TODAS las rutas /api/*
    apiRouter.use(
      requireValidToken, // 1. Valida JWT
      asyncHandler(checkUser), // 2. Valida que el usuario existe
      asyncHandler(checkBlacklist), // 3. Valida que no está en blacklist
      asyncHandler(checkSession), // 4. Valida que la sesión es válida
      asyncHandler(checkRoles) // 5. Obtiene roles del usuario
    );

    // Rutas específicas por scope
    apiRouter.use("/user", UserRouter.init());
    apiRouter.use("/admin", AdminRouter.init());
    apiRouter.use("/client", ClientRouter.init());
    apiRouter.use("/common", CommonRouter.init());

    return apiRouter;
  }
}
```

---

## Flujo Completo de una Request

### Flujo de Login (Unprotected)

```
1. CLIENT
   POST /unprotected/auth/login
   Body: { email: "admin@email.com", password: "Password123*" }

2. EXPRESS SERVER (app.ts)
   → httpRequestLogger (log de request)
   → trust proxy (para obtener IP real)
   → Middlewares de seguridad:
      • CORS
      • User Agent Parser (extrae info del navegador → res.locals.clientInfo)
      • Request Limiter (rate limiting)
      • Helmet (headers de seguridad)
      • HPP (previene HTTP Parameter Pollution)
      • JSON Parser
      • URL Encoded
      • XSS Protection
      • Cookie Parser
      • Compression
      • HTTPS Redirect
      • HSTS Security

3. UNPROTECTED ROUTER
   → AuthRoutes → POST /auth/login

4. AUTH CONTROLLER
   → ContextBuilder.build(req, res)
      • Extrae: ip, userId, adminId, clientId, jwt, sessionId, clientInfo
   → LoginUseCase.execute({ contract: req.body, ctx: ctx })

5. LOGIN USE CASE
   → Extrae contract y ctx
   → Inicializa AuthDomainEventFactory con ctx.ip
   → Valida LoginContract con DtoValidator usando contract
   → Si error → emite evento de fallo y lanza ServerError
   → Llama a authRepository.login(dto.result)

6. AUTH REPOSITORY
   → Ejecuta query: SELECT * FROM login($1, $2)
   → Valida respuesta con AuthEntity (Zod)
   → Si error → AuthRepositoryErrorFactory.create()
   → Devuelve Result<AuthEntity>

7. FUNCIÓN SQL (login)
   → SELECT userId, name, email FROM users
   → WHERE email = _email AND password = crypt(_userPassword, password)
   → RETURNS TABLE con los datos

8. VUELTA AL USE CASE
   → Si repositoryError → emite evento de fallo y lanza ServerError
   → Emite evento de éxito
   → Devuelve AuthEntity

9. VUELTA AL CONTROLLER
   → Genera JWT con Jwt.createToken({ userId })
   → Crea sesión con CreateSessionUseCase
   → Guarda JWT y sessionId en cookies
   → Responde 200 con mensaje

10. CLIENT
    ← 200 { message: "admin@email.com successfully logged in" }
    ← Cookies: jwt=..., session=...
```

### Flujo de Assign Role (Protected - Admin Only)

```
1. CLIENT
   POST /api/admin/role
   Headers: Cookie: jwt=...; session=...
   Body: { userIdToAssignRole: "uuid", role: "client" }

2. EXPRESS SERVER
   → Middlewares de seguridad (igual que arriba)

3. API ROUTER
   → requireValidToken
      • Extrae JWT de cookies
      • Valida JWT con Jwt.verify()
      • Si inválido → 401 Unauthorized

   → checkUser
      • Decodifica JWT → obtiene userId
      • Verifica que el usuario existe en DB
      • Guarda en: res.locals.userId

   → checkBlacklist
      • Verifica que userId no está en blacklist
      • Si está → 403 Forbidden

   → checkSession
      • Extrae sessionId de cookies
      • Obtiene todas las sesiones del usuario
      • Verifica que sessionId existe y jwt coincide
      • Si inválido → borra cookies y 401 Unauthorized
      • Guarda en: res.locals.sessionId

   → checkRoles
      • Obtiene roles del userId
      • Guarda en: res.locals.adminId, res.locals.clientId

4. ADMIN ROUTER
   → requireAdminAuth
      • Verifica que res.locals.adminId existe
      • Si no existe → 401 "Admin access required"

5. ROLE ROUTES
   → POST /role → RoleController.assignRole

6. ROLE CONTROLLER
   → ContextBuilder.build(req, res)
   → AssignRoleUseCase.execute({ contract: { ...req.body, createdBy: ctx.adminId }, ctx: ctx })

7. ASSIGN ROLE USE CASE
   → Extrae contract y ctx
   → Valida AssignRoleContract con el contract
   → Inicializa RoleDomainEventFactory
   → Llama a roleRepository.assignRole(dto.result)

8. ROLE REPOSITORY
   → Ejecuta: SELECT * FROM assign_role($1, $2, $3)
   → Valida respuesta con RoleEntity

9. FUNCIÓN SQL (assign_role)
   → Verifica que usuario existe
   → Verifica que _createdBy es admin activo
   → Verifica que no tiene el rol ya activo
   → INSERT INTO admins/clients
   → RETURNS roles actuales del usuario

10. VUELTA AL CONTROLLER
    → Responde 200 con el RoleEntity

11. CLIENT
    ← 200 { message: "Role assigned successfully", data: {...} }
```

---

## Middlewares y res.locals

### Cadena de Middlewares de Seguridad (ExpressServer)

**Orden de ejecución (para TODAS las requests):**

1. **CORS** - Permite cross-origin requests
2. **User Agent Parser** - Extrae información del navegador
   - Guarda en: `res.locals.clientInfo`
3. **Request Limiter** - Rate limiting por IP
4. **Helmet** - Headers de seguridad HTTP
5. **HPP Protection** - Previene HTTP Parameter Pollution
6. **JSON Parser** - Parsea body JSON (limit: 10mb)
7. **URL Encoded** - Parsea body URL encoded
8. **XSS Protection** - Sanitiza query, params, body
9. **Cookie Parser** - Parsea cookies
10. **Compression** - Comprime responses
11. **HTTPS Redirect** - Redirige HTTP → HTTPS (producción)
12. **HSTS Security** - Strict-Transport-Security header

### Middlewares de Autenticación (ApiRouter)

**Se aplican solo a rutas `/api/*` en este orden:**

#### 1. `requireValidToken`

```typescript
// Extrae JWT de cookies y verifica que es válido
const token = req?.cookies?.jwt;
if (!token) throw ServerError.unauthorized("No API token provided");
Jwt.verify(token);
```

**Guarda en res.locals:** Nada (solo valida)

#### 2. `checkUser`

```typescript
// Decodifica JWT y verifica que el usuario existe en DB
const token = req.cookies.jwt;
const userId: UUID = Jwt.decode(token)?.userId;

const userService = container.resolve(UserService);
const isValidUserId = await userService.isValidUserId(userId);

if (!isValidUserId) {
  throw ServerError.notFound("No session initialized");
}

res.locals.userId = userId;
```

**Guarda en res.locals:**

- `userId: UUID` - ID del usuario autenticado

#### 3. `checkBlacklist`

```typescript
// Verifica que el usuario no está en la blacklist
const userId = res.locals.userId;

const blacklistService = container.resolve(BlacklistService);
const isBlacklisted = await blacklistService.isUserInBlacklist(userId);

if (isBlacklisted) {
  throw ServerError.forbidden("You are in the black list");
}
```

**Guarda en res.locals:** Nada (solo valida)

#### 4. `checkSession`

```typescript
// Valida que la sesión es válida
const jwtToken = req?.cookies?.jwt;
const sessionId = req.cookies?.session;

if (!sessionId) {
  throw ServerError.unauthorized("No session ID provided");
}

// Obtiene todas las sesiones del usuario
const sessions = await getSessionsUseCase.execute(ctx);

// Valida que sessionId existe y jwt coincide
const validSession = sessions.find(
  (session) => session.sessionId === sessionId && session.jwt === jwtToken
);

if (!validSession) {
  // Borra cookies y lanza error
  throw ServerError.unauthorized("Invalid session");
}
```

**Guarda en res.locals:**

- `sessionId: UUID` - ID de la sesión activa (opcional, si lo implementas)

#### 5. `checkRoles`

```typescript
// Obtiene los roles del usuario (adminId, clientId)
const userId = res?.locals?.userId;

const roleService = container.resolve(RoleService);
const roles = await roleService.getRolesByUserId(userId);

res.locals.adminId = roles.adminId as UUID;
res.locals.clientId = roles.clientId as UUID;
```

**Guarda en res.locals:**

- `adminId: UUID | undefined` - ID del admin (null si no es admin)
- `clientId: UUID | undefined` - ID del cliente (null si no es cliente)

### Middlewares de Autorización (Scope-specific)

Después de los middlewares de autenticación, cada scope aplica su propio middleware:

#### `requireAdminAuth` (AdminRouter)

```typescript
// Verifica que el usuario tiene adminId
const adminId = res?.locals?.adminId;

if (!adminId) {
  throw ServerError.unauthorized("Admin access required");
}
```

#### `requireClientAuth` (ClientRouter)

```typescript
// Verifica que el usuario tiene clientId
const clientId = res?.locals?.clientId;

if (!clientId) {
  throw ServerError.unauthorized("Client access required");
}
```

### Resumen de res.locals

Después de pasar por todos los middlewares, `res.locals` contiene:

```typescript
res.locals = {
  // De User Agent Parser (siempre)
  clientInfo: {
    userAgent: string,
    browser: string,
    browserVersion: string,
    os: string,
    ip: string,
    isMobile: boolean,
    isTablet: boolean,
    isDesktop: boolean,
    isBot: boolean,
    // ... más campos
  },

  // De checkUser (solo en /api/*)
  userId: UUID,

  // De checkRoles (solo en /api/*)
  adminId: UUID | undefined,
  clientId: UUID | undefined,

  // De checkSession (solo en /api/*, si lo implementas)
  sessionId: UUID,
};
```

---

## Flujo de App Startup

```typescript
// backend/src/app.ts

// 1. Registrar todas las dependencias (tsyringe)
registerAllDependencies();

// 2. Inicializar servicios externos (conectan a contenedores Docker)
await redisServer.init(); // Conecta a Valkey en Docker (localhost:6379)
database.initPool(); // Inicializa pool de conexiones
await database.isAlive(); // Verifica conexión a PostgreSQL en Docker (localhost:5432)
await smtpEmailSender.initTransporter(); // Inicializa SMTP

// 3. Crear servidor Express
const server = new ExpressServer();
const app = server.create();

// 4. Aplicar middlewares globales
app.use(httpRequestLogger);
app.set("trust proxy", true);
app.use(server.initMiddlewares()); // Middlewares de seguridad

// 5. Registrar routers
app.use("/unprotected", UnprotectedRouter.init()); // Sin auth
app.use("/api", ApiRouter.init()); // Con auth

// 6. Handlers de error
app.use(server.notFoundHandler()); // 404
app.use(server.defaultErrorHandler()); // 500, etc.

// 7. Iniciar servidor
app.listen(server.port, () => server.listenCallback());
```

**⚠️ Importante:** Antes de ejecutar el backend, asegúrate de que los contenedores Docker están corriendo:

```bash
# Levantar contenedores
npm run docker:up

# Verificar que están corriendo
docker ps
```

Si los contenedores no están corriendo, el backend fallará al iniciar con errores de conexión.

---

## Checklist de Implementación

Cuando implementes una nueva funcionalidad, sigue este checklist:

### Core (Domain)

- [ ] **Definir constantes** en `/shared/constants` (ej: `user.ts`, `session.ts`)
  - Usar `as const` para type safety
  - Definir antes de crear contratos
- [ ] **Crear contratos** en `/core/{module}/contracts`
  - Validar con Zod
  - Usar constantes de `/shared/constants`
  - Mensajes de error descriptivos
- [ ] **Crear entidades** en `/core/{module}/entities`
  - Validar con Zod
  - Extender de `BaseEntity`, `CreatableEntity`, `SoftDeletableEntity` si aplica
- [ ] **Definir interfaz de repositorio** en `/core/{module}/repositories`
  - Métodos deben devolver `Promise<Result<T>>`
- [ ] **Definir interfaz de eventos** en `/core/{module}/events`
  - Métodos de éxito y fallo (ej: `login()`, `loginWithFailure()`)

### Infrastructure

- [ ] **Crear funciones SQL** en `/infrastructure/database/sql/procedures/{module}`
  - Usar `DROP FUNCTION IF EXISTS ... CASCADE`
  - `RETURNS TABLE` debe coincidir con la entidad TypeScript
  - Nombres en camelCase con comillas: `"userId"`
  - NO usar casts explícitos si el tipo se puede inferir
- [ ] **Implementar repositorio** en `/infrastructure/repositories/{module}`
  - Usar `database.query()` de `PostgresDatabase`
  - Validar respuesta con schema de Zod
  - Manejar errores con `ErrorFactory`
- [ ] **Crear error factory** que extienda `PostgresErrorFactory`
  - Sobrescribir códigos de error específicos (23505, P0001, etc.)
- [ ] **Implementar event factory** en `/infrastructure/events/handlers`
  - Implementar la interfaz de eventos del core
- [ ] **Registrar dependencias** en `/infrastructure/repositories/{module}/index.ts`
  - Usar `container.registerSingleton("IRepository", Repository)`
- [ ] **Importar registro** en `/infrastructure/registerAllDependencies.ts`

### Application

- [ ] **Crear use case** en `/application/use-cases/{module}`
  - Seguir estructura obligatoria:
    1. Inicializar evento de dominio
    2. Validar con `DtoValidator.validate()`
    3. Manejar errores de validación y emitir eventos
    4. Llamar al repositorio
    5. Manejar errores del repositorio y emitir eventos
    6. Emitir evento de éxito
    7. Devolver resultado
  - Usar `@inject("IRepository")` para inyección de dependencias
  - Lanzar errores con `ServerError[type](message)`
  - **Importar Event Factory directamente desde Infrastructure** (decisión pragmática aceptada)
    ```typescript
    import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
    ```
- [ ] **Si necesitas servicios para middlewares**, créalos en `/application/services`
  - Los services NO emiten eventos de dominio
  - Validaciones mínimas

### Presentation

- [ ] **Crear controller** en `/presentation/controllers`
  - Mantenerlos simples (3-10 líneas ideal)
  - Usar `ContextBuilder.build(req, res)` para construir contexto
  - Enriquecer contexto con metadata si es necesario (`createdBy`, etc.)
  - NO duplicar lógica de negocio
- [ ] **Crear routes** en `/presentation/routes/{scope}`
  - Agrupar por scope (admin, user, client, common, unprotected)
  - Aplicar middlewares de autorización en el router de scope
  - Usar `asyncHandler()` para middlewares async
- [ ] **Importar routes** en el router correspondiente (AdminRouter, UserRouter, etc.)
- [ ] **Si es un nuevo scope**, agregarlo en `ApiRouter.ts`

### Testing

- [ ] Probar endpoint con Postman/Insomnia
- [ ] Verificar que los middlewares se ejecutan en orden correcto
- [ ] Verificar que los eventos se emiten correctamente (consultar tabla `events`)
- [ ] Verificar respuestas de error (validación, repositorio, etc.)
- [ ] Verificar que `res.locals` se popula correctamente
- [ ] Probar casos edge (datos vacíos, tokens inválidos, ownership, etc.)

---

## Ejemplos de Casos Comunes

### Caso 1: CRUD Simple (Sin autenticación previa)

**Ejemplo: Register**

```typescript
// 1. Core
export const RegisterContract = z.object({
  name: z.string().min(5).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export const AuthEntity = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.string(),
});

// 2. SQL
CREATE OR REPLACE FUNCTION register(_name VARCHAR, _email VARCHAR, _password VARCHAR)
RETURNS TABLE ("userId" UUID, name VARCHAR, email VARCHAR)
AS $$ ... $$;

// 3. Repository
public async register(data: RegisterContract): Promise<Result<AuthEntity>> {
  const { error, result } = await database.query({
    query: "SELECT * FROM register($1, $2, $3)",
    params: [data.name, data.email, data.password],
    single: true,
    schema: AuthEntity,
  });

  if (error) {
    return { error: new AuthRepositoryErrorFactory(error).create() };
  }

  return { result };
}

// 4. Use Case
public async execute(data: { contract: RegisterContract; ctx: ExecutionContext }) {
  const { contract, ctx } = data;

  const event = new AuthDomainEventFactory({ ip: ctx?.ip });
  const dto = DtoValidator.validate(RegisterContract, contract);

  if (dto.error) {
    await EventService.emit(event.registerWithFailure(dto.error));
    throw ServerError.badRequest(dto.error);
  }

  const { error, result } = await this.authRepository.register(dto.result);

  if (error) {
    await EventService.emit(event.registerWithFailure(error.message));
    throw ServerError[error.type](error.message);
  }

  await EventService.emit(event.register());
  return result;
}

// 5. Controller
public static async register(req: Request, res: Response): Promise<Response> {
  const registerUseCase = container.resolve(RegisterUseCase);
  const ctx = ContextBuilder.build(req, res);
  const user = await registerUseCase.execute({
    contract: req.body,
    ctx: ctx,
  });

  return res.status(200).json({ message: `${user.email} successfully registered` });
}

// 6. Routes
authRouter.post("/register", AuthController.register);
```

### Caso 2: Operación con createdBy (Admin crea recurso)

**Ejemplo: Assign Role**

```typescript
// 1. Contrato incluye createdBy
export const AssignRoleContract = z.object({
  userIdToAssignRole: z.uuid(),
  role: z.enum(["admin", "client"]),
  createdBy: z.uuid(),  // Lo inyecta el controller desde res.locals.adminId
});

// 2. SQL recibe adminId directamente
CREATE OR REPLACE FUNCTION assign_role(
    _userId UUID,
    _createdBy UUID,  -- Este es el adminId
    _role VARCHAR
)
RETURNS TABLE (...) AS $$
BEGIN
    -- Verificar que _createdBy es un admin activo
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _createdBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can assign roles';
    END IF;

    INSERT INTO admins(user_id, created_by) VALUES (_userId, _createdBy);
    ...
END;
$$ LANGUAGE plpgsql;

// 3. Use Case
public async execute(data: {
  contract: AssignRoleContract;
  ctx: ExecutionContext;
}): Promise<RoleEntity> {
  const { contract, ctx } = data;

  const dto = DtoValidator.validate(AssignRoleContract, contract);

  const event = new RoleDomainEventFactory({
    ip: ctx?.ip,
    userId: ctx?.userId,
    metadata: {
      createdBy: contract?.createdBy,
      role: contract?.role,
    },
  });

  // ... resto del flujo estándar
}

// 4. Controller
public static async assignRole(req: Request, res: Response): Promise<Response> {
  const assignRoleUseCase = container.resolve(AssignRoleUseCase);

  const ctx = ContextBuilder.build(req, res);

  const role = await assignRoleUseCase.execute({
    contract: { ...req.body, createdBy: ctx.adminId },
    ctx: ctx,
  });

  return res.status(200).json({ message: "Role assigned", data: role });
}
```

### Caso 3: Operación con validación de ownership

**Ejemplo: Delete My Session (usuario solo puede borrar sus propias sesiones)**

```typescript
// Use Case valida que la sesión pertenece al usuario
public async execute(data: {
  contract: DeleteSessionContract;
  ctx: ExecutionContext;
}): Promise<SessionEntity> {
  const { contract, ctx } = data;

  const sessionId = contract?.sessionId;
  const userId = ctx?.userId;

  // Obtener todas las sesiones del usuario
  const { result: userSessions } =
    await this.sessionRepository.getSessionsByUserId(userId);

  // Verificar ownership
  const sessionBelongsToUser = userSessions?.some(
    (session) => session.sessionId === sessionId
  );

  if (!sessionBelongsToUser) {
    const errorMessage = "You can only delete your own sessions";
    await EventService.emit(event.deleteSessionWithFailure(errorMessage));
    throw ServerError.forbidden(errorMessage);
  }

  // Proceder a borrar
  const { error, result } = await this.sessionRepository.deleteSession(sessionId);

  // ... manejo de errores y return
}
```

---

## Buenas Prácticas

### SQL

- ✅ Siempre usar `DROP FUNCTION IF EXISTS ... CASCADE`
- ✅ Nombres en camelCase con comillas: `"userId"`
- ✅ NO usar casts explícitos si el tipo se puede inferir
- ✅ Usar `RAISE EXCEPTION` para errores de negocio
- ✅ Para soft delete: crear índices únicos parciales
  ```sql
  CREATE UNIQUE INDEX unique_active_admin_per_user
  ON admins(user_id) WHERE deleted_at IS NULL;
  ```

### Use Cases

- ✅ Siempre emitir eventos (éxito y fallo)
- ✅ Validar con `DtoValidator.validate()`
- ✅ Usar `ServerError[error.type](message)` para lanzar errores
- ✅ Inyectar repositorios con `@inject("IRepository")`
- ✅ **Pragmatismo**: Importar Event Factories directamente desde Infrastructure
  ```typescript
  // ✅ Aceptado por pragmatismo
  import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
  ```

### Controllers

- ✅ Mantenerlos simples (3-10 líneas ideal)
- ✅ Usar `ContextBuilder.build()` para crear contexto
- ✅ Enriquecer contexto con metadata necesaria (`createdBy`, `adminId`, etc.)
- ✅ NO duplicar lógica de negocio

### Routes

- ✅ Agrupar por scope (admin, user, client, common, unprotected)
- ✅ Aplicar middlewares de autorización en el router de scope
- ✅ Usar `asyncHandler()` para middlewares async

### Eventos

- ✅ Emitir eventos de éxito al final del use case
- ✅ Emitir eventos de fallo en cada punto de error
- ✅ Incluir metadata útil (userId, ip, etc.)

---

## Errores Comunes

### 1. "structure of query does not match function result type"

**Causa:** El `RETURNS TABLE` de la función SQL no coincide con los campos que devuelve el `SELECT`.

**Solución:**

- Verifica que `RETURNS TABLE` tenga todos los campos de la entidad
- Asegúrate de que los tipos coincidan (VARCHAR vs TEXT)
- Verifica que el SELECT devuelva todos los campos declarados

### 2. "Function does not exist"

**Causa:** La función SQL no se ejecutó en la base de datos o hay múltiples versiones.

**Solución:**

- Ejecuta la migración: `npm run db:migrate`
- Si persiste, ejecuta manualmente: `DROP FUNCTION IF EXISTS function_name CASCADE;`

### 3. "Property X does not exist on ExecutionContext"

**Causa:** Intentas acceder a una propiedad que no está en `ExecutionContext`.

**Solución:**

- Si es información de la request (body, params, query), pásala en el `contract`
- Si es información del contexto de ejecución (userId, ip, etc.), agrégala a la interfaz en `/core/shared/types/ExecutionContext.d.ts`

### 4. "Only active admins can assign roles"

**Causa:** Estás pasando `userId` en lugar de `adminId` a funciones SQL que esperan `admin_id`.

**Solución:**

- Usa `res.locals.adminId` (del middleware `checkRoles`)
- Pasa `adminId` como `createdBy` o `deletedBy` en el contexto

---

## Carpeta Shared

La carpeta `/src/shared` contiene **utilidades, herramientas y constantes compartidas** en todo el backend. Esta carpeta es fundamental ya que proporciona funcionalidades transversales que se usan en todas las capas.

**Ubicación:** `/backend/src/shared`

### Estructura de la Carpeta Shared

```
backend/src/shared/
├── constants/             # Constantes de negocio
│   ├── blacklist.ts
│   ├── jwt.ts
│   ├── recoveryToken.ts
│   ├── redisServer.ts
│   ├── smtpEmail.ts
│   ├── user-card.ts
│   └── user.ts
├── envs.ts               # Variables de entorno tipadas
└── utils/                # Herramientas y utilidades
    ├── CryptoTool.ts
    ├── Debug.ts
    ├── DtoValidator.ts
    ├── execAsync.ts
    ├── Generator.ts
    ├── Jwt.ts
    ├── LogColorFormatter.ts
    ├── PerformanceTimer.ts
    ├── ServerError.ts
    ├── types.d.ts
    └── ZodErrorFormatter.ts
```

### Constants (`/shared/constants`)

**Propósito:** Definir constantes de negocio que se usan en validaciones y lógica.

**Ejemplo: `/shared/constants/user.ts`**

```typescript
export const USER = {
  NAME_MIN_LENGTH: 5,
  NAME_MAX_LENGTH: 50,
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  ROLES: ["admin", "client"],
} as const;
```

**Uso:**

```typescript
import { USER } from "@shared/constants/user";

export const RegisterContract = z.object({
  name: z.string().min(USER.NAME_MIN_LENGTH).max(USER.NAME_MAX_LENGTH),
  email: z.string().email().min(USER.EMAIL_MIN_LENGTH),
});
```

**Ventajas:**

- ✅ **Single source of truth** - Cambios en un solo lugar
- ✅ **Evita magic numbers** - Código más legible
- ✅ **Type safety** - Usando `as const` para tipos literales

### Envs (`/shared/envs.ts`)

**Propósito:** Variables de entorno tipadas y validadas con `env-var`.

```typescript
import env from "env-var";

export const envs = {
  PORT: env.get("PORT").default("3000").asPortNumber(),
  POSTGRES_CONNECTION_STRING: env
    .get("POSTGRES_CONNECTION_STRING")
    .required()
    .asString(),
  JWT_SECRET: env.get("JWT_SECRET").required().asString(),
  REDIS_HOST: env.get("REDIS_HOST").default("localhost").asString(),
  REDIS_PORT: env.get("REDIS_PORT").default("6379").asPortNumber(),
};
```

**Ventajas:**

- ✅ **Validación en startup** - Falla rápido si falta una variable requerida
- ✅ **Type safety** - No más `process.env.VAR as string`
- ✅ **Defaults** - Valores por defecto para desarrollo

### Utils (`/shared/utils`)

#### 1. **DtoValidator** - Validación de DTOs

Valida datos con esquemas Zod y devuelve `Result<T>`:

```typescript
import { DtoValidator } from "@shared/utils/DtoValidator";
import { LoginContract } from "@core/auth/contracts/LoginContract";

const dto = DtoValidator.validate(LoginContract, ctx?.body);

if (dto.error) {
  throw ServerError.badRequest(dto.error);
}

// dto.result está validado y tipado ✅
const { email, password } = dto.result;
```

**Flujo interno:**

```
1. Ejecuta schema.safeParse(data)
   ↓
2. Si error → formatea con ZodErrorFormatter
   ↓
3. Devuelve { result } o { error }
```

#### 2. **ServerError** - Creación de Errores HTTP

Clase estática para crear errores HTTP estandarizados:

```typescript
import { ServerError } from "@shared/utils/ServerError";

throw ServerError.badRequest("Invalid credentials");
throw ServerError.unauthorized("No token provided");
throw ServerError.forbidden("You are blacklisted");
throw ServerError.notFound("User not found");
throw ServerError.conflict("Email already registered");
throw ServerError.internalServerError("Database connection failed");
```

**Estructura del error:**

```typescript
{
  statusCode: number; // 400, 401, 403, 404, 409, 500
  message: string; // Mensaje descriptivo
  timestamp: Date; // Fecha del error
}
```

#### 3. **Jwt** - Gestión de JWT

Utilidad para crear, verificar y decodificar tokens JWT:

```typescript
import { Jwt } from "@shared/utils/Jwt";

// Crear token
const jwt = Jwt.createToken({ userId: "uuid" });
// jwt.token: string
// jwt.cookieName: "jwt"
// jwt.options: CookieOptions (httpOnly, secure, sameSite, maxAge)

// Verificar token
Jwt.verify(token); // Lanza error si es inválido

// Decodificar token
const payload = Jwt.decode(token);
// payload.userId: string
```

#### 4. **CryptoTool** - Hashing y Encriptación

Herramientas criptográficas para generar hashes seguros:

```typescript
import { CryptoTool } from "@shared/utils/CryptoTool";

// Generar token seguro
const token = CryptoTool.generateSecureToken(32); // 64 caracteres hex

// Hash de contraseña (usa bcrypt o similar)
const hashedPassword = await CryptoTool.hash(password);

// Comparar hash
const isValid = await CryptoTool.compare(password, hashedPassword);
```

#### 5. **Debug** - Logs con Colores

Sistema de logging con colores para desarrollo:

```typescript
import { Debug } from "@shared/utils/Debug";

Debug.info("Server starting...");
Debug.success("Database connected");
Debug.warning("Rate limit exceeded");
Debug.error("Authentication failed");
```

**Características:**

- ✅ **Colores** - Verde para success, amarillo para warnings, rojo para errors
- ✅ **Timestamps** - Cada log tiene timestamp
- ✅ **Condicional** - Solo se muestra si `DEBUG=backend:dev` está activo

#### 6. **PerformanceTimer** - Medición de Performance

Mide el tiempo de ejecución de operaciones:

```typescript
import { PerformanceTimer } from "@shared/utils/PerformanceTimer";

const timer = new PerformanceTimer().init();
// ... operación costosa ...
timer.stop("Query execution"); // Output: Query execution - 123.45ms
```

**Uso en PostgresDatabase:**

```typescript
const timer = new PerformanceTimer().init();
const result = await pool.query(query, params);
timer.stop(`Query: ${query}`);
```

#### 7. **Generator** - Generadores de IDs

Genera IDs únicos para diferentes propósitos:

```typescript
import { Generator } from "@shared/utils/Generator";

const requestId = Generator.uuid(); // UUID v4
const sessionId = Generator.randomId(16); // String aleatorio de 16 chars
const otp = Generator.numericCode(6); // Código numérico de 6 dígitos
```

#### 8. **ZodErrorFormatter** - Formato de Errores de Zod

Formatea errores de validación de Zod a mensajes legibles:

```typescript
import { ZodErrorFormatter } from "@shared/utils/ZodErrorFormatter";

const validation = LoginContract.safeParse(data);

if (!validation.success) {
  const errorMessage = ZodErrorFormatter.format(validation.error);
  // Output: "email: Invalid email format; password: Required"
}
```

### Buenas Prácticas con Shared

**1. Constants antes de Contracts**

```typescript
// ✅ Correcto: Definir constantes primero
export const USER = { NAME_MIN_LENGTH: 5 } as const;

// Luego usar en contracts
export const UserContract = z.object({
  name: z.string().min(USER.NAME_MIN_LENGTH),
});
```

**2. DtoValidator en todos los Use Cases**

```typescript
// ✅ Siempre validar DTOs en use cases
const { contract, ctx } = data;
const dto = DtoValidator.validate(Contract, contract);
if (dto.error) throw ServerError.badRequest(dto.error);
```

**3. ServerError para todas las excepciones**

```typescript
// ✅ Usar ServerError para errores HTTP
throw ServerError[error.type](error.message);

// ❌ NO usar Error genérico
throw new Error("Something went wrong");
```

**4. Debug para logs de desarrollo**

```typescript
// ✅ Usar Debug para logs informativos
Debug.info("Processing login request");

// ❌ NO usar console.log
console.log("Processing login request");
```

---

## Resumen del Flujo

```
REQUEST
  ↓
EXPRESS MIDDLEWARES DE SEGURIDAD
  ↓ (res.locals.clientInfo)
API ROUTER MIDDLEWARES DE AUTH
  ↓ (res.locals.userId, adminId, clientId, sessionId)
SCOPE ROUTER (Admin/User/Client/Common)
  ↓ (middlewares específicos del scope)
ROUTES ESPECÍFICAS
  ↓
CONTROLLER
  ↓ (ContextBuilder → ExecutionContext)
  ↓ (Separa contract y ctx)
USE CASE
  ↓ (validación del contract → repo → eventos)
REPOSITORY
  ↓ (database.query → Zod validation)
FUNCIÓN SQL
  ↓ (RETURNS TABLE)
POSTGRES
  ↓
← RESPONSE
```

---

## Estructura Completa de un Módulo

Para referencia, esta es la estructura completa del módulo `auth`:

```
backend/src/
├── core/auth/
│   ├── contracts/
│   │   ├── LoginContract.ts
│   │   └── RegisterContract.ts
│   ├── entities/
│   │   └── AuthEntity.ts
│   ├── events/
│   │   └── IAuthDomainEventFactory.ts
│   └── repositories/
│       └── IAuthRepository.ts
│
├── infrastructure/
│   ├── database/sql/procedures/auth/
│   │   ├── login.sql
│   │   └── register.sql
│   ├── repositories/auth/
│   │   ├── AuthRepository.ts
│   │   ├── AuthRepositoryErrorFactory.ts
│   │   └── index.ts (registro de dependencias)
│   └── events/handlers/
│       └── AuthDomainEventFactory.ts
│
├── application/use-cases/auth/
│   ├── LoginUseCase.ts
│   ├── RegisterUseCase.ts
│   └── LogoutUseCase.ts
│
└── presentation/
    ├── controllers/
    │   └── Auth.controller.ts
    └── routes/unprotected/
        └── Auth.routes.ts
```

Sigue esta estructura para cualquier nueva funcionalidad y mantendrás la consistencia en todo el backend.

---

## Decisiones Arquitectónicas Pragmáticas

Este proyecto prioriza **pragmatismo sobre purismo arquitectónico** en casos específicos donde el beneficio no justifica la complejidad adicional.

### Event Factories desde Infrastructure

**Decisión:** Application importa Event Factories directamente desde Infrastructure.

```typescript
// Use Case en Application
import { AuthDomainEventFactory } from "@infrastructure/events/handlers/AuthDomainEventFactory";
```

**Justificación:**

- ✅ Event Factories son **helpers sin lógica de negocio** (solo construyen objetos)
- ✅ Ya implementan **interfaces del Core** (`IAuthDomainEventFactory`)
- ✅ No afectan **testabilidad crítica** (eventos son fire-and-forget)
- ✅ **Simplicidad** - Evita DI innecesaria de factories

**Trade-off aceptado:**

- ⚠️ Técnicamente viola Clean Architecture (Application → Infrastructure)
- ✅ Pero es una violación **menor y pragmática** que acelera el desarrollo

**Alternativa descartada:**

Inyectar factories por DI añadiría:

- Registro de cada factory en el contenedor
- Método `create()` adicional en interfaces
- Complejidad innecesaria para el beneficio obtenido

**Conclusión:** Esta decisión está **documentada y aceptada** como parte del diseño del proyecto.
