# POKEGYM: Sistema de Gestión de Rutinas de Gimnasio

Esta aplicación es un sistema completo (Full-Stack) diseñado para la gestión y planificación de rutinas de entrenamiento físico. Permite a los usuarios autenticarse, crear planes detallados por día de la semana y administrar ejercicios con métricas específicas (series, repeticiones, peso).

El proyecto está dividido en dos servicios principales:

1. Backend (FastAPI): Gestiona la lógica de negocio, la API RESTful, la autenticación JWT y la persistencia de datos en PostgreSQL.
2. Frontend (React/MUI): Proporciona una interfaz de usuario moderna y responsive para interactuar con la API.

## Principales Caracteristicas
 - Registrar Usuarios (Seguridad con JWT).
 - Crear, Editar y Eliminar Ejercicios.
 - Crear, Editar, Listar, Buscar y Eliminar Rutinas.
 - Sistema basico de Notificaciones.

## Ejecutar la Aplicación

**Requisitos Previos** Para ejecutar la aplicación completa en un entorno reproducible y aislado, solo necesitas:
- Docker: Versión 20.x o superior.
- Docker Compose: Versión 1.29.x o Docker Engine con soporte Compose V2 (generalmente viene incluido con Docker Desktop).

1. **Clonar o descargar el proyecto**
   ```bash
   git clone https://github.com/J0S3MG/POKEGYM.git
   cd POKEGYM
   ```
   
2. **Ejecutar docker compose**
   
Dentro de la misma carpeta que clono haga:
   ```bash
   docker compose up --build -d 
   ```
Luego espere hasta que docker instale todo.

3. **La aplicación estará disponible en:**
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:8000
Puede acceder al swagger de FasApi a traves de: http://localhost:8000/docs

4. **Para detener la app:**
Detener los contenedores:
 ```bash
   docker compose down
   ```
Detener y eliminar volúmenes (⚠️ borra la base de datos):
 ```bash
   docker compose down -v
   ```

## Para leer mas sobre el proyecto consultar la siguiente documentación 

- [Backend](https://github.com/J0S3MG/POKEGYM/blob/main/Backend/Backend.md)
- [Frontend](https://github.com/J0S3MG/POKEGYM/blob/main/Frontend/Frontend.md)













