# Frontend con  React + Vite (TypeScripts para el tipado consistente con el back)

La interfaz de usuario (Frontend) para la aplicación esta construida con React y Material UI (MUI) con un diseño responsive.
Utiliza una precentacion carismatica y entretenida para el usuario.


## Tecnologias Utilizadas

| Tecnología                    | Descripción                                                                                                                                                            |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**                | Utilizado para añadir tipado estático al código JavaScript, lo que mejora la detección de errores en tiempo de desarrollo y la mantenibilidad del proyecto.            |
| **react-router-dom**          | Gestiona la navegación declarativa y la carga de diferentes vistas (páginas) dentro de la aplicación de una sola página (SPA).                                         |
| **Vite**                      | Herramienta de construcción y servidor de desarrollo de alto rendimiento, optimizado para el ecosistema moderno de JavaScript y React.                                 |
| **@mui/material**             | Implementación de Material Design que proporciona un conjunto de componentes de interfaz de usuario listos para usar, garantizando un diseño profesional y coherente.  |
| **axios**                     | Biblioteca basada en Promesas utilizada para realizar todas las peticiones HTTP (API calls) al backend (FastAPI).                                                      |


## Estructura del Proyecto

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


## Imagenes Ilustrativas del Sistema

### Página Lista de Rutinas

Sin Rutinas cargadas:
![ImgListaVacia](https://github.com/user-attachments/assets/976c2249-aef0-478f-839f-c5182fd8664e)

Con Rutinas cargadas:
![ImgLista](https://github.com/user-attachments/assets/9b479f38-2d07-4f57-9e4b-92ef0095d010)

Formulario para crear una Rutina:
![ImgCrear](https://github.com/user-attachments/assets/8d5f1fb1-22a8-4fe9-b63d-79060d563c62)

Formulario para editar una Rutina:
![ImgEditar](https://github.com/user-attachments/assets/677f5947-7252-4577-b292-cce39507ef4e)

Mensaje ELiminar Rutina:
![ImgEliminar](https://github.com/user-attachments/assets/e6557c1f-084a-4be5-bbd9-0f307689da9c)

#### Busqueda por Id y Nombre (Con busqueda parcial de terminos):

Busqueda por ID:
![ImgBuscar](https://github.com/user-attachments/assets/ec719e3b-efdd-4e54-b1f8-883a85b3b720)

Busqueda Parcial:
![ImgBuscar](https://github.com/user-attachments/assets/7a9bb78f-a6dd-41a6-818a-da0707ca00aa)

## Página Detalle Rutina:

![ImgDetalle](https://github.com/user-attachments/assets/9f4dc3eb-c819-4150-b273-e6e8b1c6b31e)
![ImgEliminar](https://github.com/user-attachments/assets/a9bfc3d5-3907-4a4b-b3dc-d1fad66da3a0)

Formulario Agregar Ejercicio:
![ImgAgregar](https://github.com/user-attachments/assets/d48257bf-b938-44a7-a7c2-f55a8c46d243)

Formulario Editar Ejercicio:
![ImgEditar](https://github.com/user-attachments/assets/b2e4415d-80e2-41d5-a518-d17c49f1459c)

Mensaje Eliminar Ejercicio:
![ImgEliminar](https://github.com/user-attachments/assets/d92a0f9d-92dd-4c64-833b-78a41e043d84)

## Página Perfil de Usuario

![ImgPerfil](https://github.com/user-attachments/assets/bc7aa4d0-1287-4c0d-9b38-b4dbf5160187)

Perfil de Usuario:
![ImgPerfil](https://github.com/user-attachments/assets/2366aaa9-35c7-4ddd-b3d3-83f4e14a5bd4)

Selector de Avatar:
![ImgSelector](https://github.com/user-attachments/assets/866b73ce-12b2-44e5-897f-99255e623ca5)

Historial de Notificaciones:
![ImgHistorial](https://github.com/user-attachments/assets/a7bf84c0-bb7d-41aa-ac7c-44bf1fbc61d5)




