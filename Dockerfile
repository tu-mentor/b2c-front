# Argumentos para versiones
ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.18

# Etapa de construcción
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa final
FROM alpine:${ALPINE_VERSION}

# Instalar Node.js y npm
RUN apk add --no-cache nodejs npm

# Crear un usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Instalar un servidor ligero para servir contenido estático
RUN npm install -g serve

WORKDIR /app

# Copiar los archivos construidos
COPY --from=builder /app/dist ./dist
# Copiar la configuración del servidor en múltiples ubicaciones para compatibilidad
COPY serve.json ./serve.json
COPY serve.json ./dist/serve.json

# Cambiar la propiedad de los archivos al usuario no root
RUN chown -R appuser:appgroup /app

# Cambiar al usuario no root
USER appuser

# Usar una variable de entorno para el puerto
ENV PORT=4173
EXPOSE ${PORT}

# Añadir un healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT} || exit 1

# Comando para iniciar el servidor
CMD ["serve", "-s", "dist", "-l", "4173"]

LABEL version="1.0.0"
LABEL description="Tu-Mentor Frontend Docker Image"