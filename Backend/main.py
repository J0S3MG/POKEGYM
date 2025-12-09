from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from Infrastructure.database import create_db_and_tables, engine
from Application.Controllers.auth_controller import router as auth_router
from Application.Controllers.rutina_controller import router as rutina_router # Importamos el enrutador y le ponemos un nuevo nombre.

# --------------------------------------------- Configuracion para el inicio de la API ----------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("="*80)
    print("INICIANDO APLICACIÓN")
    print("="*80)
    create_db_and_tables()
    yield
    print("App terminando...")
    
app = FastAPI(
    title="FastAPI Rutinas", 
    description="Trabajo Final Prog IV 2025", 
    version="1.0.0",
    lifespan=lifespan
)
# -----------------------------------------------------------------------------------------------------------------------------------


# -------------------------------------------------- Configurar CORS ----------------------------------------------------------------
origins = [ # Es una lista de URLs que tienen permiso para acceder a la API.
    "http://localhost:5173",  # Vite dev server (puerto típico)
    "http://localhost:5174",  # Alternativo (otro puerto posible)
    "http://127.0.0.1:5173",  # Localhost con IP 127.0.0.1 (equivalente a localhost)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Permite solicitudes solo desde las URLs en la lista origins.
    allow_credentials=True, # Permite el envío de cookies y headers de autenticación (Necesario para Sesiones, JWT tokens, autenticación).
    allow_methods=["*"], # Permite todos los métodos HTTP (GET, POST, PUT, DELETE, etc.).
    allow_headers=["*"], # Permite todos los headers HTTP en las solicitudes (Ejemplos: Content-Type, Authorization, X-Requested-With).
)
# -----------------------------------------------------------------------------------------------------------------------------------


# ------------------------------------------ Incluimos los Controladores ------------------------------------------------------------
app.include_router(rutina_router)
app.include_router(auth_router)
# -----------------------------------------------------------------------------------------------------------------------------------



