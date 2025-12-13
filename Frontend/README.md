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











