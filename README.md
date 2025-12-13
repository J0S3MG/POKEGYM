# POKEGYM: Sistema de Gestión de Rutinas de Gimnasio

Esta aplicación es un sistema completo (Full-Stack) diseñado para la gestión y planificación de rutinas de entrenamiento físico. Permite a los usuarios autenticarse, crear planes detallados por día de la semana y administrar ejercicios con métricas específicas (series, repeticiones, peso).

El proyecto está dividido en dos servicios principales:

1. [Backend (FastAPI)](https://github.com/J0S3MG/POKEGYM/tree/main/Backend#readme): Gestiona la lógica de negocio, la API RESTful, la autenticación JWT y la persistencia de datos en PostgreSQL.
2. [Frontend (React/MUI)](https://github.com/J0S3MG/POKEGYM/tree/main/Frontend#readme): Proporciona una interfaz de usuario moderna y responsive para interactuar con la API.

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

# Imagenes ilustrativas del sistema
Aca hay algunas imagenes del sistema, para ver mas dirijase a [Frontend](https://github.com/J0S3MG/POKEGYM/tree/main/Frontend#readme).

### Pagina de Incio:

Titulo de la pagina:
![ImgTitulo](https://github.com/user-attachments/assets/c9316468-d338-4308-a467-26048cd97450)

Carrusel con comentarios de usuarios (ficticios):
![ImgCarusel](https://github.com/user-attachments/assets/745caea9-e85f-4fe4-b483-1dbbe39834c8)

Características:
![ImgCaracterística](https://github.com/user-attachments/assets/7f0f9fbf-bc44-4d4f-a6f6-b53199a8ad5a)

¿Lsito para comenzar?:
![ImgListo](https://github.com/user-attachments/assets/e9db23e2-d077-4fea-a4f0-9be391c0ff02)

### Incio de Sesíon y Registro de Usuario (seguridad con JWT):

Pagina para Iniciar Sesíon:
![ImgInciarSesion](https://github.com/user-attachments/assets/128c0294-9bd0-4f0e-884c-fed9e3351b0f)

Pagina para Registrar Usuario:
![ImgRegistro](https://github.com/user-attachments/assets/0ec74a3d-dff2-4c9b-97c7-dfd1e4994199)

## Desarrollado por: 

Dev Principal: José Manuel González

#### Contacto:
EMAIL: josemanuelgonzalez.dev@gmail.com
LinkedIn: [José Manuel González](www.linkedin.com/in/jose-manuel-gonzalez-98b986214)












