# 🚀 TypeScript Fullstack Monorepo - Clean Architecture Template

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react)
![Express](https://img.shields.io/badge/Express-5.0-black?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Valkey](https://img.shields.io/badge/Valkey-8.1-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

**Template profesional de aplicación fullstack con arquitectura limpia, TypeScript y monorepo**

[🚀 Inicio Rápido](./QUICKSTART.md) •
[Características](#-características) •
[Instalación](#-instalación) •
[Arquitectura](#-arquitectura) •
[Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Seguridad](#-seguridad)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Autor](#-autor)

---

## 📖 Descripción

Este es un **template profesional y escalable** para desarrollar aplicaciones fullstack con TypeScript, implementando los principios de **Clean Architecture** (Arquitectura Limpia). El proyecto está estructurado como un **monorepo** que contiene tanto el backend (API REST) como el frontend (aplicación React).

El template incluye patrones de diseño modernos, separación de responsabilidades, inyección de dependencias, sistema de eventos, autenticación completa con roles, **infraestructura dockerizada** con PostgreSQL y Valkey, y muchas otras características enterprise-ready.

### 🚀 ¿Por qué este template?

- ✨ **Setup en 5 minutos** con Docker Compose
- 🏗️ **Arquitectura probada** en producción
- 📚 **Documentación completa** y ejemplos
- 🔒 **Seguridad integrada** desde el día 1
- 🐳 **Docker Ready** - No más configuraciones manuales
- 📦 **Monorepo** - Frontend y backend en un solo lugar

---

## ✨ Características

### 🎯 Características Principales

- ✅ **Clean Architecture**: Separación clara de capas (Domain, Application, Infrastructure, Presentation)
- ✅ **Monorepo**: Gestión unificada de frontend y backend con npm workspaces
- ✅ **Docker Ready**: PostgreSQL y Valkey/Redis en contenedores Docker
- ✅ **TypeScript**: Tipado estático en toda la aplicación
- ✅ **Dependency Injection**: Uso de TSyringe para inyección de dependencias
- ✅ **Event-Driven**: Sistema de eventos de dominio y aplicación
- ✅ **Repository Pattern**: Abstracción de la capa de datos
- ✅ **Use Cases**: Lógica de negocio encapsulada en casos de uso
- ✅ **SOLID Principles**: Código mantenible y escalable

### 🔐 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Sistema de roles y permisos (Admin, Client, Common)
- ✅ Blacklist de usuarios
- ✅ Rate limiting y protección contra DDoS
- ✅ Helmet para seguridad HTTP
- ✅ XSS Protection
- ✅ HPP (HTTP Parameter Pollution) Protection
- ✅ CORS configurado
- ✅ Cookie security
- ✅ IP Tracking y Geolocalización

### 🔧 Funcionalidades Backend

- ✅ **Autenticación Completa**: Login, Register, Logout
- ✅ **Gestión de Usuarios**: CRUD completo con paginación
- ✅ **Gestión de Roles**: Asignación y revocación de roles
- ✅ **Recuperación de Contraseña**: Sistema completo de reset
- ✅ **Blacklist**: Sistema de bloqueo de usuarios
- ✅ **Email Service**: Envío de emails con Nodemailer
- ✅ **Task Scheduler**: Sistema de tareas programadas
- ✅ **Valkey Cache**: Gestión de caché y sesiones (Redis fork)
- ✅ **PostgreSQL**: Base de datos relacional con migraciones
- ✅ **Event Bus**: Sistema de eventos desacoplado
- ✅ **Docker Compose**: Infraestructura dockerizada
- ✅ **OpenAPI/Swagger**: Documentación de API

### 🎨 Funcionalidades Frontend

- ✅ **React 19**: Última versión de React
- ✅ **Vite**: Build tool ultra-rápido
- ✅ **React Router**: Navegación con protección de rutas
- ✅ **Context API**: Gestión de estado global
- ✅ **Protected Routes**: Rutas protegidas por rol
- ✅ **Axios**: Cliente HTTP configurado
- ✅ **CSS Modules**: Estilos encapsulados
- ✅ **TypeScript**: Tipado completo

---

## 🛠 Stack Tecnológico

### Backend

| Tecnología          | Descripción                       |
| ------------------- | --------------------------------- |
| **Node.js 20+**     | Runtime de JavaScript             |
| **TypeScript 5.2+** | Superset tipado de JavaScript     |
| **Express 5.0**     | Framework web minimalista         |
| **PostgreSQL 16**   | Base de datos relacional (Docker) |
| **Valkey 8.1**      | Cache y sesiones (Redis fork)     |
| **TSyringe**        | Inyección de dependencias         |
| **Zod**             | Validación de esquemas            |
| **JsonWebToken**    | Autenticación JWT                 |
| **Nodemailer**      | Envío de emails                   |
| **Helmet**          | Seguridad HTTP                    |
| **Node-Schedule**   | Tareas programadas                |

### Frontend

| Tecnología         | Descripción                   |
| ------------------ | ----------------------------- |
| **React 19**       | Librería UI                   |
| **TypeScript 5.8** | Superset tipado de JavaScript |
| **Vite 7**         | Build tool                    |
| **React Router 7** | Enrutamiento                  |
| **Axios**          | Cliente HTTP                  |
| **CSS Modules**    | Estilos encapsulados          |

### DevOps & Tools

| Tecnología         | Descripción                          |
| ------------------ | ------------------------------------ |
| **Docker Compose** | Orquestación de contenedores         |
| **npm workspaces** | Gestión de monorepo                  |
| **tsx**            | Ejecución de TypeScript en dev       |
| **ESLint**         | Linter para código                   |
| **cross-env**      | Variables de entorno multiplataforma |
| **rimraf**         | Limpieza de directorios              |

---

## 🏗 Arquitectura

Este proyecto implementa **Clean Architecture** (Arquitectura Limpia), propuesta por Robert C. Martin (Uncle Bob). La arquitectura se divide en capas concéntricas, donde las capas internas no conocen a las externas.

### Capas de la Arquitectura

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (Controllers, Routes, Middlewares)     │
├─────────────────────────────────────────┤
│        APPLICATION LAYER                │
│    (Use Cases, Services, DTOs)          │
├─────────────────────────────────────────┤
│           DOMAIN LAYER                  │
│  (Entities, Repositories, Events)       │
├─────────────────────────────────────────┤
│       INFRASTRUCTURE LAYER              │
│  (Database, External APIs, Email)       │
└─────────────────────────────────────────┘
```

#### 1. **Domain Layer (Core)** 🎯

- **Entities**: Objetos de negocio puros
- **Repositories**: Interfaces de acceso a datos
- **Events**: Eventos de dominio
- **Contracts**: DTOs y tipos de dominio
- **Regla**: No depende de ninguna otra capa

#### 2. **Application Layer** 💼

- **Use Cases**: Casos de uso de la aplicación
- **Services**: Servicios de aplicación
- **Regla**: Depende solo del Domain Layer

#### 3. **Infrastructure Layer** 🔧

- **Database**: Implementación de repositorios
- **Events**: Event Bus y handlers
- **Mailer**: Servicio de email
- **Redis**: Cache y sesiones
- **Schedulers**: Tareas programadas
- **Regla**: Implementa las interfaces del dominio

#### 4. **Presentation Layer** 🎨

- **Controllers**: Controladores de Express
- **Routes**: Definición de rutas
- **Middlewares**: Autenticación, seguridad, validación
- **Adapters**: Adaptadores de request/response
- **Regla**: Capa de entrada de la aplicación

### Flujo de Datos

```
Request → Middleware → Controller → Use Case → Repository → Database
                                         ↓
                                    Event Bus
                                         ↓
                                   Event Handlers
```

---

## 📁 Estructura del Proyecto

```
dilus-app-template/
├── 🐳 docker/                           # Configuración de Docker
│   ├── docker-compose.yml               # Servicios (PostgreSQL + Valkey)
│   ├── test-docker-setup.js             # Script de verificación
│   ├── .dockerignore                    # Archivos a ignorar en Docker
│   └── README.md                        # Documentación de Docker
│
├── 📦 backend/                          # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── 🎯 core/                     # Domain Layer
│   │   │   ├── auth/
│   │   │   │   ├── contracts/           # DTOs y contratos
│   │   │   │   ├── entities/            # Entidades de dominio
│   │   │   │   ├── events/              # Eventos de dominio
│   │   │   │   └── repositories/        # Interfaces de repositorios
│   │   │   ├── user/
│   │   │   ├── role/
│   │   │   ├── blacklist/
│   │   │   ├── password/
│   │   │   └── shared/                  # Entidades y tipos compartidos
│   │   │
│   │   ├── 💼 application/              # Application Layer
│   │   │   ├── use-cases/               # Casos de uso
│   │   │   │   ├── auth/                # Login, Register, Logout
│   │   │   │   ├── user/                # Gestión de usuarios
│   │   │   │   ├── role/                # Gestión de roles
│   │   │   │   ├── password/            # Recuperación de contraseña
│   │   │   │   └── blacklist/           # Gestión de blacklist
│   │   │   └── services/                # Servicios de aplicación
│   │   │
│   │   ├── 🔧 infrastructure/           # Infrastructure Layer
│   │   │   ├── database/                # PostgreSQL
│   │   │   │   └── sql/                 # Migraciones SQL
│   │   │   ├── repositories/            # Implementación de repositorios
│   │   │   ├── events/                  # Event Bus y handlers
│   │   │   ├── mailer/                  # Servicio de email
│   │   │   ├── redis-server/            # Cliente Redis
│   │   │   ├── schedulers/              # Tareas programadas
│   │   │   └── registerAllDependencies.ts
│   │   │
│   │   ├── 🎨 presentation/             # Presentation Layer
│   │   │   ├── controllers/             # Controladores
│   │   │   ├── routes/                  # Definición de rutas
│   │   │   │   ├── admin/               # Rutas de administrador
│   │   │   │   ├── client/              # Rutas de cliente
│   │   │   │   ├── common/              # Rutas comunes
│   │   │   │   ├── user/                # Rutas de usuario
│   │   │   │   ├── unprotected/         # Rutas públicas
│   │   │   │   └── openapi.yaml         # Documentación OpenAPI
│   │   │   ├── middlewares/             # Middlewares
│   │   │   │   ├── auth/                # Autenticación y autorización
│   │   │   │   ├── security/            # Seguridad
│   │   │   │   └── performance/         # Performance
│   │   │   ├── adapters/                # Adaptadores
│   │   │   └── ExpressServer.ts         # Configuración de Express
│   │   │
│   │   ├── 🔨 shared/                   # Utilidades compartidas
│   │   │   ├── constants/               # Constantes
│   │   │   ├── utils/                   # Utilidades
│   │   │   └── envs.ts                  # Variables de entorno
│   │   │
│   │   └── app.ts                       # Punto de entrada
│   │
│   ├── scripts/                         # Scripts de utilidad
│   ├── package.json
│   └── tsconfig.json
│
├── 📱 frontend/                         # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/                  # Componentes reutilizables
│   │   │   ├── NavBar/                  # Barra de navegación
│   │   │   ├── ProtectedRoute.tsx       # Componente de ruta protegida
│   │   │   └── Spinner.tsx              # Componente de carga
│   │   │
│   │   ├── pages/                       # Páginas
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   ├── ClientPage.tsx
│   │   │   ├── CommonPage.tsx
│   │   │   ├── ConfigurationPage.tsx
│   │   │   ├── HelpPage.tsx
│   │   │   ├── AccessDeniedPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   │
│   │   ├── context/                     # Context API
│   │   │   ├── auth/                    # Contexto de autenticación
│   │   │   └── spinner/                 # Contexto de spinner
│   │   │
│   │   ├── router/                      # Configuración de rutas
│   │   │   ├── AppRouter.tsx
│   │   │   └── routesConfig.ts
│   │   │
│   │   ├── middlewares/                 # Middlewares de rutas
│   │   │   ├── AdminRoute.tsx           # Protección para admin
│   │   │   ├── ClientRoute.tsx          # Protección para client
│   │   │   ├── CommonRoute.tsx          # Protección para common
│   │   │   └── PrivateRoute.tsx         # Protección para usuarios autenticados
│   │   │
│   │   ├── services/                    # Servicios
│   │   │   ├── axios.instance.tsx       # Instancia configurada de Axios
│   │   │   ├── configuration.ts         # Configuración
│   │   │   └── routes/                  # Rutas de API
│   │   │
│   │   ├── interfaces/                  # Interfaces TypeScript
│   │   ├── consts/                      # Constantes
│   │   └── main.tsx                     # Punto de entrada
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── package.json                         # Package.json raíz del monorepo
├── package-lock.json
├── DOCKER.md                            # Guía completa de Docker
├── QUICKSTART.md                        # Guía de inicio rápido
└── README.md                            # Este archivo
```

---

## 🐳 Infraestructura con Docker

Este proyecto usa **Docker Compose** para orquestar los servicios de infraestructura. No necesitas instalar PostgreSQL ni Redis/Valkey manualmente.

**Configuración:** Todos los archivos de Docker están en la carpeta [`docker/`](./docker/)

### ⚡ Inicio Rápido

```bash
# 1. Levantar servicios Docker (PostgreSQL + Valkey)
npm run docker:up

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env

# 3. Crear base de datos y ejecutar migraciones
npm run database:create

# 4. Iniciar desarrollo (backend + frontend)
npm run dev
```

### 🎯 ¿Qué incluye Docker?

| Servicio       | Versión   | Puerto | Propósito                     |
| -------------- | --------- | ------ | ----------------------------- |
| **PostgreSQL** | 16-alpine | 5432   | Base de datos relacional      |
| **Valkey**     | 8.1.3     | 6379   | Cache y sesiones (Redis fork) |

**Características:**

- ✅ Volúmenes persistentes para los datos
- ✅ Health checks automáticos
- ✅ Extensiones pre-instaladas (pgcrypto, uuid-ossp)
- ✅ Red aislada entre servicios
- ✅ Scripts de inicialización automáticos

### 📚 Documentación Docker

- **[QUICKSTART.md](./QUICKSTART.md)** - Guía paso a paso de 0 a desarrollo
- **[DOCKER.md](./DOCKER.md)** - Guía completa (comandos, troubleshooting, producción)

### 🛠 Comandos Docker Esenciales

```bash
# Verificar que todo funciona
npm run docker:check

# Ver logs en tiempo real
npm run docker:logs

# Reiniciar servicios
npm run docker:restart

# Detener servicios
npm run docker:down

# Limpiar todo (⚠️ elimina datos)
npm run docker:clean
```

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito          | Versión Mínima | Propósito                          |
| ------------------ | -------------- | ---------------------------------- |
| **Node.js**        | 20.x           | Runtime de JavaScript              |
| **npm**            | 9.x            | Gestor de paquetes                 |
| **Docker Desktop** | Latest         | Contenedores (PostgreSQL + Valkey) |
| **Git**            | Latest         | Control de versiones               |

> 💡 **Nota:** Ya **NO necesitas** instalar PostgreSQL ni Redis/Valkey manualmente. Docker se encarga de todo.

### Verificar Versiones

```bash
node --version    # Debe ser >= 20.x
npm --version     # Debe ser >= 9.x
docker --version  # Debe estar instalado
docker compose version  # Debe estar instalado
```

### Instalar Docker Desktop

Si no tienes Docker instalado:

- **Windows/Mac:** [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux:** [Instalar Docker Engine](https://docs.docker.com/engine/install/)

Después de instalar, asegúrate de que Docker está corriendo:

```bash
docker ps  # Debe mostrar la lista de contenedores (vacía al inicio)
```

---

## 🚀 Instalación

> **📖 Guía Rápida:** Para instrucciones detalladas paso a paso, consulta [QUICKSTART.md](./QUICKSTART.md)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/dilus-app-template.git
cd dilus-app-template
```

### 2. Instalar Dependencias

El proyecto utiliza **npm workspaces** para gestionar el monorepo. Una sola instalación instalará todas las dependencias de frontend y backend:

```bash
npm install
```

### 3. Levantar Servicios Docker

El proyecto usa **Docker Compose** para PostgreSQL y Valkey. Inicia los contenedores:

```bash
npm run docker:up
```

Esto levantará:

- **PostgreSQL 16** en el puerto `5432`
- **Valkey 8.1.3** en el puerto `6379`
- Volúmenes persistentes para los datos
- Extensiones PostgreSQL (pgcrypto, uuid-ossp)

**Verificar que están corriendo:**

```bash
# Ver contenedores activos
docker ps

# Verificar toda la configuración (recomendado)
npm run docker:check
```

> 📖 **Más información:** Ver [DOCKER.md](./DOCKER.md) para guía completa de Docker

### 4. Configurar Variables de Entorno

#### Backend

Copia el archivo de ejemplo:

```bash
cp backend/.env.example backend/.env
```

Las variables por defecto ya están configuradas para Docker:

```env
# API
API_PORT=3000
API_JWT_SECRET_TOKEN=your-super-secret-jwt-token-change-this-in-production
API_ALLOWED_CORS_ORIGINS=http://localhost:5173

# PostgreSQL (Docker)
POSTGRES_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5432/dilus_db

# Valkey (Docker)
VALKEY_HOST=localhost
VALKEY_PORT=6379
VALKEY_PASSWORD=valkey_password
```

> ⚠️ **Importante:** Cambia los valores de seguridad en producción

#### Frontend

Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Inicializar la Base de Datos

Con los contenedores corriendo, ejecuta:

```bash
npm run database:init
```

Este comando:

1. Genera el archivo `database.sql` con todas las migraciones
2. Copia el archivo al contenedor Docker de PostgreSQL
3. Ejecuta todas las migraciones automáticamente
4. Crea tablas, funciones, índices, triggers y procedimientos almacenados

**Comandos disponibles:**

```bash
# Inicializar base de datos completa (recomendado)
npm run database:init

# Solo generar database.sql (sin ejecutar)
npm run database:create
```

### 6. Iniciar el Proyecto

```bash
npm run dev
```

Esto iniciará:

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

¡Listo! 🎉

---

## 🎮 Scripts Disponibles

### Scripts Raíz (Monorepo)

#### Desarrollo

```bash
# Desarrollo: Inicia backend y frontend simultáneamente
npm run dev

# Desarrollo: Solo backend
npm run dev:backend

# Desarrollo: Solo frontend
npm run dev:frontend
```

#### Docker (Infraestructura)

```bash
# Iniciar servicios Docker (PostgreSQL + Valkey)
npm run docker:up

# Verificar configuración de Docker (recomendado)
npm run docker:check

# Detener servicios Docker
npm run docker:down

# Reiniciar servicios Docker
npm run docker:restart

# Ver logs en tiempo real
npm run docker:logs

# Ver logs de PostgreSQL
npm run docker:logs:postgres

# Ver logs de Valkey
npm run docker:logs:valkey

# Limpiar todo (⚠️ elimina datos)
npm run docker:clean
```

> 📖 **Más comandos Docker:** Ver [DOCKER.md](./DOCKER.md)

#### Build

```bash
# Build: Compila backend y frontend
npm run build

# Build: Solo backend
npm run build:backend

# Build: Solo frontend
npm run build:frontend
```

#### Base de Datos

```bash
# Inicializar base de datos completa (genera + ejecuta SQL en Docker)
npm run database:init

# Solo generar database.sql (sin ejecutar)
npm run database:create
```

### Scripts Backend

```bash
cd backend

# Desarrollo con hot reload
npm run dev

# Compilar
npm run build

# Compilar y ejecutar
npm run start

# Ejecutar migraciones
npm run database:migration
```

### Scripts Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Lint
npm run lint

# Preview de producción
npm run preview
```

---

## 🎯 Funcionalidades Implementadas

### 🔐 Autenticación y Autorización

#### Endpoints de Autenticación

| Método | Endpoint                         | Descripción          |
| ------ | -------------------------------- | -------------------- |
| POST   | `/api/unprotected/auth/register` | Registro de usuarios |
| POST   | `/api/unprotected/auth/login`    | Login de usuarios    |
| POST   | `/api/user/auth/logout`          | Logout de usuarios   |
| POST   | `/api/unprotected/auth/refresh`  | Refresh token        |

#### Sistema de Roles

El sistema implementa tres roles principales:

- **ADMIN**: Acceso completo al sistema
- **CLIENT**: Acceso a funcionalidades de cliente
- **COMMON**: Acceso a funcionalidades comunes

```typescript
// Ejemplo de uso en rutas
@Roles(['ADMIN'])
async adminOnlyEndpoint() {
  // Solo accesible por administradores
}

@Roles(['ADMIN', 'CLIENT'])
async adminOrClientEndpoint() {
  // Accesible por admin o client
}
```

### 👤 Gestión de Usuarios

| Método | Endpoint             | Roles | Descripción                    |
| ------ | -------------------- | ----- | ------------------------------ |
| GET    | `/api/admin/users`   | ADMIN | Listar usuarios con paginación |
| GET    | `/api/user/users/me` | ALL   | Obtener mi perfil              |
| PUT    | `/api/user/users/me` | ALL   | Actualizar mi perfil           |
| DELETE | `/api/user/users/me` | ALL   | Eliminar mi cuenta             |

### 🎭 Gestión de Roles

| Método | Endpoint                  | Roles | Descripción            |
| ------ | ------------------------- | ----- | ---------------------- |
| POST   | `/api/admin/roles/assign` | ADMIN | Asignar rol a usuario  |
| DELETE | `/api/admin/roles/remove` | ADMIN | Remover rol de usuario |

### 🔒 Blacklist

| Método | Endpoint                      | Roles | Descripción                  |
| ------ | ----------------------------- | ----- | ---------------------------- |
| POST   | `/api/admin/blacklist/add`    | ADMIN | Añadir usuario a blacklist   |
| DELETE | `/api/admin/blacklist/remove` | ADMIN | Remover usuario de blacklist |
| GET    | `/api/admin/blacklist`        | ADMIN | Listar usuarios en blacklist |

### 🔑 Recuperación de Contraseña

| Método | Endpoint                           | Descripción                   |
| ------ | ---------------------------------- | ----------------------------- |
| POST   | `/api/unprotected/password/forgot` | Solicitar reset de contraseña |
| POST   | `/api/unprotected/password/reset`  | Resetear contraseña con token |

---

## 📚 API Documentation

El proyecto incluye documentación OpenAPI/Swagger. Una vez iniciado el servidor, puedes acceder a:

```
http://localhost:3000/api/docs
```

La especificación OpenAPI se encuentra en:

```
backend/src/presentation/routes/openapi.yaml
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests backend
cd backend
npm run test

# Tests frontend
cd frontend
npm run test

# Tests con coverage
npm run test:coverage
```

### Estructura de Tests

```
backend/
  └── tests/
      ├── unit/
      ├── integration/
      └── e2e/

frontend/
  └── tests/
      ├── unit/
      └── integration/
```

---

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

#### 1. **Helmet**

Protección de headers HTTP

```typescript
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    // ... más configuraciones
  })
);
```

#### 2. **Rate Limiting**

Protección contra ataques de fuerza bruta y DDoS

```typescript
// Configuración global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de requests
});
```

#### 3. **CORS**

Control de origen cruzado

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
```

#### 4. **XSS Protection**

Sanitización de inputs contra XSS

```typescript
import xss from "xss";

const sanitizedInput = xss(userInput);
```

#### 5. **HPP Protection**

Protección contra HTTP Parameter Pollution

```typescript
app.use(hpp());
```

#### 6. **JWT Tokens**

- Access Token (corta duración)
- Refresh Token (larga duración)
- Rotación de tokens
- Blacklist de tokens

#### 7. **Password Hashing**

Uso de bcrypt con salt rounds configurables

#### 8. **IP Tracking**

Registro de IPs y geolocalización

#### 9. **Audit Trail**

Sistema de auditoría completo

### Buenas Prácticas

- ✅ No almacenar credenciales en el código
- ✅ Usar variables de entorno
- ✅ Validar todos los inputs
- ✅ Sanitizar outputs
- ✅ Usar HTTPS en producción
- ✅ Implementar logging seguro
- ✅ Mantener dependencias actualizadas

---

## 🎨 Frontend Routes

### Rutas Públicas

- `/` - Página de inicio
- `/login` - Página de login

### Rutas Protegidas (Requieren Autenticación)

- `/profile` - Perfil de usuario
- `/help` - Ayuda
- `/configuration` - Configuración

### Rutas por Rol

#### Admin

- `/admin` - Dashboard de administrador

#### Client

- `/client` - Dashboard de cliente

#### Common

- `/common` - Dashboard común

### Rutas de Error

- `/access-denied` - Acceso denegado
- `/404` - Página no encontrada

---

## 🌐 Internacionalización (i18n)

El proyecto está preparado para soportar múltiples idiomas. La estructura recomendada:

```
frontend/
  └── src/
      └── i18n/
          ├── en.json
          ├── es.json
          └── index.ts
```

---

## 📊 Sistema de Eventos

### Event Bus

El proyecto implementa un sistema de eventos desacoplado que permite la comunicación entre módulos sin crear dependencias directas.

#### Tipos de Eventos

1. **Domain Events**: Eventos de dominio puros
2. **Application Events**: Eventos de aplicación

#### Ejemplo de Uso

```typescript
// Emitir evento
this.eventBus.emit("user.registered", {
  userId: user.id,
  email: user.email,
});

// Escuchar evento
this.eventBus.on("user.registered", async (data) => {
  await this.sendWelcomeEmail(data.email);
});
```

#### Handlers Implementados

- `UserRegisteredHandler`: Envía email de bienvenida
- `PasswordResetHandler`: Envía email de recuperación
- `UserBlacklistedHandler`: Notifica bloqueo de usuario
- `RoleAssignedHandler`: Notifica asignación de rol

---

## 📦 Inyección de Dependencias

El proyecto utiliza **TSyringe** para la inyección de dependencias, siguiendo los principios SOLID.

### Ejemplo de Uso

```typescript
// Registrar dependencia
container.registerSingleton<IUserRepository>("IUserRepository", UserRepository);

// Inyectar dependencia
@injectable()
class UserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}
}
```

---

## 🗄️ Migraciones de Base de Datos

### Crear Nueva Migración

```bash
npm run database:migration
```

Este comando:

1. Te solicita un nombre para la migración
2. Crea un archivo SQL con timestamp
3. El archivo se guarda en `backend/src/infrastructure/database/sql/`

### Estructura de Migración

```sql
-- migration_TIMESTAMP_nombre.sql

-- UP: Cambios a aplicar
CREATE TABLE ejemplo (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- DOWN: Rollback
DROP TABLE IF EXISTS ejemplo;
```

---

## ⏰ Tareas Programadas

El sistema incluye un gestor de tareas programadas usando `node-schedule`.

### Tareas Implementadas

1. **CleanupExpiredTokensTask**: Limpia tokens expirados
2. **SendStatisticsTask**: Envía estadísticas diarias

### Crear Nueva Tarea

```typescript
// backend/src/infrastructure/schedulers/tasks/MyTask.ts
export class MyTask implements ITask {
  name = "MyTask";
  schedule = "0 0 * * *"; // Cron expression

  async execute(): Promise<void> {
    // Lógica de la tarea
  }
}
```

---

## 🔄 Patrones de Diseño Utilizados

1. **Repository Pattern**: Abstracción de acceso a datos
2. **Factory Pattern**: Creación de objetos complejos
3. **Observer Pattern**: Sistema de eventos
4. **Adapter Pattern**: Adaptadores de request/response
5. **Dependency Injection**: TSyringe
6. **Use Case Pattern**: Encapsulación de lógica de negocio
7. **Strategy Pattern**: Diferentes estrategias de autenticación

---

## 🚀 Deployment

### Backend (Node.js)

### Frontend (React)

#### Build para Producción

```bash
cd frontend
npm run build
```

Los archivos compilados estarán en `dist/frontend/`.

## 📈 Monitoreo y Logging

### Sistema de Logs

El proyecto incluye un sistema de logging con colores y niveles:

```typescript
logger.info("Información general");
logger.warn("Advertencia");
logger.error("Error");
logger.debug("Debug (solo en desarrollo)");
```

## 📚 Documentación Adicional

- **[QUICKSTART.md](./QUICKSTART.md)** - Guía de inicio rápido (0 a desarrollo en 5 minutos)
- **[DOCKER.md](./DOCKER.md)** - Guía completa de Docker (comandos, troubleshooting, avanzado)
- **[docker/PGADMIN.md](./docker/PGADMIN.md)** - Conectar con pgAdmin, DBeaver, DataGrip
- **[backend/cursor-guide.md](./backend/cursor-guide.md)** - Guía completa del backend (arquitectura, patrones, implementación)
- **[backend/scripts/README.md](./backend/scripts/README.md)** - Documentación de scripts del backend

---

## 🎯 Flujo de Trabajo Recomendado

### Primer Día

1. Clona el repositorio
2. Ejecuta `npm install`
3. Ejecuta `npm run docker:up`
4. Copia `backend/.env.example` a `backend/.env`
5. Ejecuta `npm run database:create`
6. Ejecuta `npm run dev`
7. Abre http://localhost:5173

### Día a Día

1. Asegúrate de que Docker está corriendo: `npm run docker:check`
2. Desarrolla: `npm run dev`
3. Commitea cambios
4. Al terminar (opcional): `npm run docker:down`

### Antes de un Commit

```bash
# Verifica que todo funciona
npm run docker:check
npm run dev

# En otra terminal, prueba los endpoints
curl http://localhost:3000/unprotected/health
```

---

## 🐛 Troubleshooting

### "Valkey connection timeout"

```bash
npm run docker:up
npm run docker:logs:valkey
```

### "Database connection failed"

```bash
npm run docker:up
npm run docker:logs:postgres
```

### "Puerto ya en uso"

Ver [DOCKER.md - Troubleshooting](./DOCKER.md#troubleshooting) para soluciones detalladas.

### Reiniciar desde cero

```bash
npm run docker:clean
npm run docker:up
npm run database:create
npm run dev
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👨‍💻 Autor

**Antonio Corbalán Navarro**

- Email: antoniocn1996@gmail.com

---

## 🌟 Agradecimientos

Gracias a la comunidad open source por las increíbles herramientas que hacen posible este template:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Valkey](https://valkey.io/)
- [Docker](https://www.docker.com/)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

[🚀 Inicio Rápido](./QUICKSTART.md) •
[🐳 Guía Docker](./DOCKER.md) •
[🗄️ pgAdmin](./docker/PGADMIN.md) •
[📖 Guía Backend](./backend/cursor-guide.md)

</div>
