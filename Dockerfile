# Dockerfile

# --- FASE 1: Construcción/Preparación de la Imagen ---
FROM node:20-alpine AS development

# Argumento para especificar el entorno
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instalar Git, paquetes de compilación (build-base) y Python/pip
RUN apk update && \
    apk add --no-cache \
    git \
    build-base \
    python3 \
    py3-pip \
    postgresql-client # Añadido cliente de PG para pg_isready

# -----------------------------------------------------
# PASO CRÍTICO: Instalación de dependencias del Backend
# Esto se hace en la fase de construcción (BUILD) para que el 'command' de inicio sea rápido.
# Copiamos solo el requirements.txt para aprovechar la caché de Docker.
COPY Backend/requirements.txt /usr/src/app/Backend/
RUN pip install --break-system-packages -r Backend/requirements.txt
# -----------------------------------------------------

# Copiar el resto del código del repositorio
COPY . .

# Exponer los puertos (FastAPI: 8000, Vite: 5173)
EXPOSE 5173
EXPOSE 8000

# Comando por defecto (solo como fallback)
CMD ["/bin/sh"]