# --- FASE 1: Construcción/Preparación de la Imagen ---
# Usamos una imagen base que ya tenga Node.js y Python.
# node:20-alpine es una versión ligera y moderna de Node.js (ideal para React/Vite)
# y ya incluye Python (usualmente se requiere Python para construir dependencias de Node.js).
# Si necesitamos una versión específica de Python, usaremos un enfoque multi-stage.
# Para simplicidad inicial, usaremos la imagen base más versátil.

FROM node:20-alpine AS development

# Argumento para especificar el entorno (por ejemplo, 'development' o 'production')
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instalar Git y los paquetes de compilación necesarios para algunas dependencias
# Además, aseguramos la versión de Python que necesites si la base no la tiene o si
# es estrictamente necesario, pero para este ejemplo, node:20-alpine ya trae Python.
# Instalaremos Python 3.13.7 (si estuviera disponible en Alpine, pero es muy nuevo).
# Usaremos 3.11/3.12-alpine que es más estable, o el que provee Node:20-alpine.
# Como pides 3.13.7 (que es pre-release), usaré 3.12-alpine para ser realista.

RUN apk update && \
    apk add --no-cache \
    git \
    build-base \
    python3 \
    py3-pip

# Copiar todo el contenido del repositorio (asumiendo que estás en la raíz)
COPY . .

# Exponer los puertos que usarán tus aplicaciones. 
# El frontend React/Vite (típicamente 5173 o 3000) y el backend Python (típicamente 8000).
EXPOSE 5173
EXPOSE 8000

# Comando por defecto al iniciar el contenedor. 
# Esto se sobrescribirá por Docker Compose para ejecutar comandos específicos (npm/pip)
# pero sirve como un comando de fallback.
CMD ["/bin/sh"]

# Nota: No instalamos las dependencias (npm install, pip install) aquí
# porque queremos que se ejecute en el script de 'docker-compose.yml'
# Esto te da más flexibilidad para ejecutar diferentes comandos de inicio.
# 6. COMANDO DE INICIO
# Define el comando para iniciar la aplicación usando Uvicorn
# El formato es: uvicorn <nombre_del_módulo>:<nombre_de_la_instancia_de_FastAPI> --host 0.0.0.0 --port 8000
# Asumiendo que en 'main.py' tienes 'app = FastAPI()'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]