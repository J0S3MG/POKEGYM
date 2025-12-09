import os
from typing import Generator
from sqlalchemy.pool import QueuePool
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.sql.expression import Select, SelectOfScalar

# Deshabilita una advertencia común de SQLModel/SQLAlchemy
SelectOfScalar.inherit_cache = True
Select.inherit_cache = True

# ------------------------------- Configuración del Motor ------------------------------------
# Leer variables de entorno.
POSTGRES_USER = os.environ.get("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "1234")
POSTGRES_SERVER = os.environ.get("POSTGRES_SERVER", "localhost")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")
POSTGRES_DB = os.environ.get("POSTGRES_DB", "BaseRutina")

# Construcción de la URL de conexión.
DATABASE_URL = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

# El motor debe ser global y creado solo una vez.
engine = create_engine(DATABASE_URL, echo=True,  
    poolclass=QueuePool,
    pool_size=20,           # Aumenta de 5 a 20
    max_overflow=40,        # Aumenta de 10 a 40
    pool_pre_ping=True,     # Verifica conexiones antes de usarlas
    pool_recycle=3600       # Recicla conexiones cada hora
)
# --------------------------------------------------------------------------------------------

# DATABASE_URL = "postgresql://postgres:1234@localhost:5432/BaseRutina" # Le paso la url de la BD.

# Agregamos parámetros importantes para PostgreSQL.
#engine = create_engine(
#    DATABASE_URL, 
#    echo=True,
#    pool_pre_ping=True,  # Verifica las conexiones antes de usarlas.
#    pool_recycle=3600    # Recicla conexiones cada hora.
#)

# ------------------------------- Creamos la BD y sus tablas ------------------------------------
def create_db_and_tables():
    """
    Crea el motor y luego las tablas.
    Esta función se llama durante el 'lifespan' de FastAPI.
    """
    global engine
    if not DATABASE_URL:
        print("ADVERTENCIA: DATABASE_URL no encontrada.")

    print("Intentando crear tablas en la base de datos...")
    # Esta línea ahora usa el motor creado. Si la URL era inválida, el fallo ocurrirá aquí.
    SQLModel.metadata.create_all(engine)
    print("Tablas verificadas/creadas exitosamente.")
# --------------------------------------------------------------------------------------------


# ------------------------------- Devolvemos una Sesion --------------------------------------
def get_session() -> Generator[Session, None, None]:
    """
    Patrón de generador (Dependencia de FastAPI) para obtener una sesión.
    Abre una sesión y asegura que se cierre automáticamente.
    """
    session = Session(engine) # Crea la sesión.
    try:
        yield session # La devuelve para que FastAPI la use.
    finally:
        session.close()
# --------------------------------------------------------------------------------------------
