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
En la terminal haga:
 ```bash
   docker compose stop 
   ```
Y lo frena todo.

# Backend con FASTAPI (PostgresSQL para la persistencia)

Para la arquitectura del proyecto se opto por un patrón de diseño muy popular en el desarrollo de software, conocido como Arquitectura Limpia (Clean Architecture) / Diseño Orientado al Dominio (Domain-Driven Design - DDD), donde separamos nuestra API en 3 capas claras:

- Domain: Esta es la capa más interna y pura, conteniendo las reglas de negocio fundamentales que definen el sistema, sn tener conocimiento de bases de datos, frameworks web, etc.
- Application: Esta capa define y coordina los Casos de Uso de la aplicación. Describe qué puede hacer el sistema en términos de negocio, pero delega la ejecución de la regla a la capa Domain.
- Infrastructure: Esta es la capa exterior, la cual contiene todas las implementaciones concretas de los detalles técnicos y herramientas externas que requiera la API.

### Estructura del Proyecto

```
Backend/
├── main.py               # Punto de entrada de la aplicación FastAPI (Entrypoint).
├── config.py             # Maneja la configuración global, la lectura de variables de entorno.
├── Application
|      |              
|      ├── Controllers    # Manejan las peticiones HTTP (rutas de FastAPI). Reciben datos, invocan a los Services y devuelven respuestas HTTP.
|      |    |
|      |    ├── auth_controller.py    # Controlador que maneja las peticiones de autenticacion (register, token, me).
|      |    └── rutina_controller.py  # Controlador que maneja las peticiones de rutina y ejercicio (CRUD).
|      |    
|      ├── DTOs           # Modelos de datos para entrada/salida de la API, desacoplando la capa de Domain de los payloads de la API.
|      |    |
|      |    ├── auth_dto.py           # Modelo de datos para la autenticacion (User: Update, Create, Response, etc).
|      |    ├── ejercicio_dto.py      # Modelo de datos para los ejercicios (Update, Create, etc).
|      |    └── rutina_dto.py         # Modelo de datos para las rutinas (Update, Create, etc).
|      |    
|      ├── Exceptions     # Excepciones específicas que ocurren durante la ejecución de los casos de uso.
|      |    └── rutina_exception.py
|      |    
|      └── Services       # Orquestan el flujo de trabajo, casos de uso de la API (validaciónes, uso de Repositories).
|            |
|            ├── auth_service.py      # Orquesta los casos de uso para la autenticacion.
|            └── rutina_service.py    # Orquesta los casos de uso para la rutina y ejercicios.
├── Domain
|      |    
|      ├── Entities       # Modelos de la lógica de negocio. Representan la información y el comportamiento esencial.
|      |    |
|      |    ├── user.py               # Modelo usuario para la logica de autenticacion.
|      |    ├── ejercicio.py          # Modelo ejercicio para la logica de creacion, edicion y eliminacion del ejercicio.
|      |    └── rutina.py             # Modelo rutina (Agregado) para la logica de administracion de una rutina y sus ejercicios.
|      |    
|      ├── Exceptions     # Define excepciones personalizadas (domain_exception.py) para errores específicos del dominio.
|      |    └── domain_exception.py
|      |    
|      ├── Interfaces     # Define los contratos que deben implementar los servicios y repositorios de las capas exteriores.
|      |    |
|      |    ├── auth_service_interface.py        # Define el contrato para la orquestacion de la autenticacion.
|      |    ├── rutina_service_interface.py      # Define el contrato para la orquestacion de la administracion de la rutina y ejercicio.
|      |    ├── rutina_repository_interface.py   # Define el contrato para la persistencia de los datos de rutina y ejercicio.
|      |    └── user_repository_interface.py     # Define el contrato para la persistencia de los datos del usuario.
|      |    
|      └── ValueObjects   # Contiene objetos pequeños e inmutables que representan conceptos descriptivos.
|           └── dias.py
|      
├── Infrastructure
|      |    
|      ├── Repositories   # Adaptadores que implementan las Interfaces del Domain, traduciendo las peticiones de las Entidades a consultas de base de datos.
|      |    |
|      |    ├── mapper.py               # Lógica para convertir Entidades del Dominio a Modelos de la Base de Datos y viceversa.
|      |    ├── models_db.py            # Define los modelos de datos tal como están almacenados en la base de datos.
|      |    ├── rutina_repository.py    # La implementacion concreta del contrato rutina_repository_interface.
|      |    └── user_repository.py      # La implementacion concreta del contrato user_repository_interface.
|      |    
|      ├── Security       # Lógica para el manejo de tokens (JWT) y el hashing de contraseñas.
|      |    ├── jwt_handler.py          # Implementación para la creación, firma y verificación de tokens JWT.
|      |    └── password_hasher.py      # Implementación para manejar las operaciones criptográficas.
|      |    
|      ├── database.py                  # Lógica para establecer y gestionar la conexión a la base de datos.
|      └── deps.py                      # Es la "Factory" o el módulo de Inyección de Dependencias donde se definen las dependencias que FastAPI inyectará a los Controllers y Services.
|
└── requirements.txt                    # Dependencias del proyecto.
```

## Tecnologias Utilizadas

| Tecnología                    | Descripción                                                                                                                                            |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Python**                    | Lenguaje principal del proyecto, usado para construir la lógica backend y manejar datos de forma eficiente.                                            |
| **FastAPI**                   | Framework moderno y rápido para crear APIs con Python, basado en tipado y compatible con OpenAPI/Swagger.                                              |
| **Uvicorn [standard]**        | Servidor ASGI de alto rendimiento utilizado para ejecutar aplicaciones FastAPI de forma asíncrona.                                                     |
| **SQLModel**                  | ORM (Object Relational Mapper) que combina la simplicidad de SQLAlchemy y Pydantic para trabajar con bases de datos.                                   |
| **psycopg2-binary**           | Adaptador que permite la conexión y ejecución de consultas en bases de datos PostgreSQL.                                                               |
| **Pydantic**                  | Biblioteca para validación y manejo de datos usando modelos basados en anotaciones de tipo.                                                            |
| **pydantic-settings**         | Extensión de Pydantic para gestionar configuraciones del entorno (variables `.env`, configuraciones del servidor, etc.).                               |
| **python-dotenv**             | Permite cargar variables de entorno desde un archivo `.env`, facilitando la configuración y seguridad de credenciales.                                 |
| **python-jose[cryptography]** | Biblioteca utilizada para la creación, firma y verificación de Tokens Web JSON (JWT), esencial para la autenticación y seguridad.                      |
| **passlib[bcrypt]**           | Biblioteca que proporciona funciones de hashing de contraseñas de forma segura, usando el algoritmo Bcrypt para el módulo de seguridad.                |
| **python-multipart**          | Requerido por FastAPI para manejar la subida de archivos (datos multipart/form-data), como imágenes o documentos.                                      |
| **argon2-cffi**               | Proporciona una implementación robusta del algoritmo de hashing Argon2, otra alternativa criptográfica para el almacenamiento seguro de contraseñas.   |


## Endpoints de Rutina 

- `GET /api/rutinas` - Devuelve una lista de rutinas.
- `GET /api/rutinas/buscar?nombre={texto}` - Permite la busqueda parcial, devolviendo una lista de rutinas.
- `GET /api/rutinas/{id}` - Devueve una rutina especifica con sus ejercicios.
- `POST /api/rutinas` - Da de alta una rutina nueva con almenos 1 ejercicio.
- `PUT /api/rutinas/{id}` - Permite actualizar una rutina.
- `DELETE /api/rutinas/{id}` - Borra una rutina con todos sus ejercicios.

## Endpoints de Ejercicio 

- `POST /api/rutinas/{id}/ejercicios` - Crea un ejercicio, agregandolo a la rutina especificada.
- `PUT /api/ejercicios/{id}` - Permite modificar un ejercicio.
- `DELETE /api/ejercicios/{id}` - Elimina un ejercicio de la rutina.

## Endpoints de Auth

- `POST /api/auth/token` - Crea un token JWT cuando el usuario se loguea.
- `POST /api/auth/register` - Permite registrar un nuevo usuario.
- `GET /api/auth/me` - Devuelve un usuario que ya haya iniciado sesion.

# Frontend con  React + Vite (TypeScripts para el tipado consistente con el back)

La interfaz de usuario (Frontend) para la aplicación esta construida con React y Material UI (MUI).
Pensado en el diseño responsive y adaptandoce a mobiles.

## Tecnologias Utilizadas

| Tecnología                    | Descripción                                                                                                                                                            |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**                | Utilizado para añadir tipado estático al código JavaScript, lo que mejora la detección de errores en tiempo de desarrollo y la mantenibilidad del proyecto.            |
| **react-router-dom**          | Gestiona la navegación declarativa y la carga de diferentes vistas (páginas) dentro de la aplicación de una sola página (SPA).                                         |
| **Vite**                      | Herramienta de construcción y servidor de desarrollo de alto rendimiento, optimizado para el ecosistema moderno de JavaScript y React.                                 |
| **@mui/material**             | Implementación de Material Design que proporciona un conjunto de componentes de interfaz de usuario listos para usar, garantizando un diseño profesional y coherente.  |
| **axios**                     | Biblioteca basada en Promesas utilizada para realizar todas las peticiones HTTP (API calls) al backend (FastAPI).                                                      |


### Estructura del Proyecto

```
Frontend/
    ├── public/images                    # Almacena las images de la pagina.
    └── src/                             
        ├── api/                         # Contiene la logica para la comunicación con la API. 
        │    └── Api.ts                  # Archivo que hace el llamado a la API.
        │
        ├── components/
        │    ├── auth/                   # Contiene el componente ProtectedRoute.
        │    ├── common/                 # Contiene los componentes comunes a toda la App.
        │    ├── ejercicios/             # Contiene los compoentes de ejercicio.
        │    ├── layout/                 # Contiene el componente MainLayout.
        │    ├── perfil/                 # Contiene los componentes del perfil.
        │    ├── rutinas/                # Contiene los componentes de la rutina.
        │    └── testimonios/            # Contiene los componentes del testimonio.
        │
        ├── context/
        │    ├── AuthContext.tsx           # Provee el contexto para la autenticacion.
        │    ├── NotificationContext.tsx   # Provee el contexto para las notificaciones.
        │    ├── TestimonioContext.tsx     # Provee el contexto para los testimonios.
        │    └── useAuthNotifications.ts   # Hook personalizado para las notificaciones.
        │
        ├── pages/                   # Componentes que representan las vistas de la App.
        │    ├── HomePage.tsx           # Página de inicio.
        │    ├── LoginPage.tsx          # Página para logearse.
        │    ├── PerfilPage.tsx         # Página de perfil.
        │    ├── RegisterPage.tsx       # Página para registrarse.
        │    ├── RutinaDetallePage.tsx  # Página con el detalle de una rutina.     
        │    └── RutinaListPage.tsx     # Página con la lista de rutina.
        │
        ├── theme/                  
        │    └── index.tsx              # Tema de la App.
        ├── types/                      # Modelos que reprecentan los DTOs de la API.
        │    ├── Auth_Models.ts         # Modelo para las Request/Response de los endpoints de autenticacion.
        │    ├── Rutina_Models.ts       # Modelos para las Request/Response de los endpoints de rutinas.     
        │    └── Value_objects.ts       # Modelo para representar los dias de la semana.
        └── App.tsx                     # Define las rutas principales y la estructura del MainLayout.
```












