import os
from config import settings
from fastapi import Depends
from sqlmodel import Session
from passlib.context import CryptContext
from Infrastructure.database import get_session
from Infrastructure.Security.jwt_handler import JWTHandler
from Infrastructure.Security.password_hasher import PasswordHasher
from Infrastructure.Repositories.user_repository import UserRepository
from Infrastructure.Repositories.rutina_repository import RutinaRepository
from Domain.Interfaces.auth_service_interface import AuthServiceInterface
from Domain.Interfaces.rutina_service_interface import RutinaServiceInterface
from Domain.Interfaces.user_repository_interface import UserRepositoryInterface
from Domain.Interfaces.rutina_repository_interface import RutinaRepositoryInterface
from Application.Services.auth_service import AuthService
from Application.Services.rutina_service import RutinaService

# --------------------------------------------------- FACTORY --------------------------------------------------------------------------
# Este archivo cumple la funcion de una "Fabrica" (Solo hace Inyeccion de Dependencia).
# Farbica (Factory): Se llama “fábrica” porque el archivo produce (crea) objetos dependiendo del contexto.
# Con esto ayudamos a cumplir los principios SOLID, más concretamente el OCP.
# --------------------------------------------------------------------------------------------------------------------------------------

# --------------------------------------------------- RUTINA FACTORY ---------------------------------------------------------------------
# Con este metodo realizamos la inyeccion de dependencia del Repositorio.
def get_rutina_repository(session: Session = Depends(get_session)) -> RutinaRepositoryInterface:
    return RutinaRepository(session) # De esta manera da igual los cambios que hagamos en la implementacion que el resto seguira funcionando igual.


# En este caso hacemos la inyeccion de dependencia del Servicio.
def get_rutina_service(rutina_repo: RutinaRepositoryInterface = Depends(get_rutina_repository)) -> RutinaServiceInterface:
    return RutinaService(rutina_repo) # Le pasamos el Repositorio para que se inyeccte en la clase concreta.
# ----------------------------------------------------------------------------------------------------------------------------------------


# --------------------------------------------------- AUTH FACTORY -----------------------------------------------------------------------
# Con este metodo realizamos la inyeccion de dependencia del Repositorio.
def get_user_repository(session: Session = Depends(get_session)) -> UserRepositoryInterface:
    return UserRepository(session) 

# Define el contexto de hashing, usando bcrypt, que es el estándar recomendado.
PWD_CONTEXT = CryptContext(schemes=["argon2"], deprecated="auto")

# Inyectamos el encriptador de contraseñas.
def get_pwd_hasher() -> PasswordHasher:
    return PasswordHasher(context = PWD_CONTEXT)

# Inyectamos el Manejador de eventos JWT.
def get_jwt_handler() -> JWTHandler:
    return JWTHandler(settings=settings)

def get_auth_service() -> AuthServiceInterface:
    """
    Resuelve manualmente las dependencias para evitar el error 'Depends' 
    cuando se llama fuera del contexto de FastAPI.
    """

    try:
        session_instance = next(get_session()) 
        user_repo = get_user_repository(session=session_instance)
    except Exception as e:
        print(f"Advertencia: No se pudo obtener la sesión DB para AuthService: {e}")
        user_repo  = get_user_repository(session=next(get_session()))

    pwd_has = get_pwd_hasher()
    jwt_handler = get_jwt_handler()

    return AuthService(
        user_repository=user_repo, 
        password_hasher=pwd_has, 
        jwt_handler=jwt_handler
    )
# ----------------------------------------------------------------------------------------------------------------------------------------
