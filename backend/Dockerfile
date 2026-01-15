# Backend Dockerfile - Neologg Cloud
FROM node:20-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias del root y backend
COPY package*.json ./
COPY backend/package*.json ./backend/

# Instalar dependencias del monorepo
RUN npm install --legacy-peer-deps

# Copiar código fuente del backend
COPY backend ./backend

# Compilar TypeScript (genera en /app/dist/backend según backend/package.json)
WORKDIR /app/backend
RUN npm run build

# Etapa de producción
FROM node:20-alpine

# Instalar docker CLI y wget para gestionar Mosquitto y healthcheck
RUN apk add --no-cache docker-cli wget

WORKDIR /app

# Copiar node_modules desde builder (solo los del root que son los que se usan)
COPY --from=builder /app/node_modules ./node_modules

# Copiar código compilado (está en /app/dist/backend)
COPY --from=builder /app/dist/backend ./dist

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080
ENV NODE_PATH=/app/node_modules

# Comando de inicio
CMD ["node", "dist/app.js"]
