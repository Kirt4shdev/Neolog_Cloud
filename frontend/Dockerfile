# Frontend Dockerfile - Neologg Cloud
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias del root y frontend
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Instalar dependencias del monorepo
RUN npm install --legacy-peer-deps

# Copiar código fuente del frontend Y tipos del backend (necesarios para el build)
COPY frontend ./frontend
COPY backend/src/core ./backend/src/core
COPY backend/src/shared ./backend/src/shared

# Build de producción (genera en /app/dist/frontend según frontend/package.json)
WORKDIR /app/frontend
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Copiar build al servidor nginx (está en /app/dist/frontend)
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
