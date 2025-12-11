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

## Configuracion del .env

ACLARACION: Si no se crea o configura el .env y lo corre con Docker Compose este ultimo utilizara las variables de entorno definidas en el archivo docker-compose.yml

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










