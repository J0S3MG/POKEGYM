from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm # DTO estándar de FastAPI para login
from Domain.Exceptions.domain_exception import DomainError
from Domain.Interfaces.auth_service_interface import AuthServiceInterface
from Application.DTOs.auth_dto import Token, UserLogin, UserResponse, UserCreate
from Infrastructure.deps import get_auth_service
from Domain.Entities.user import User
from Infrastructure.Security.jwt_handler import get_current_user



router = APIRouter(prefix="/api", tags=["Autenticacion"])

# ------------------------------------ CREAR JWT (LOGIN) -------------------------------------------------------
@router.post("/auth/token", response_model=Token, summary="Obtener token JWT (Login)", operation_id="Login_Usuario")
def login_for_access_token( form_data: OAuth2PasswordRequestForm = Depends(), # Acepta el formato de formulario estándar
    auth_service: AuthServiceInterface = Depends(get_auth_service)) -> Token:
    """
    Endpoint para iniciar sesión.
    """
    # Creamos un DTO UserLogin a partir de form_data para pasarlo al servicio.
    user_login_dto = UserLogin(username=form_data.username, password=form_data.password)
    # Autenticamos (pasamos el DTO de Aplicación al Servicio).
    user = auth_service.authenticate_user(user_login=user_login_dto)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Si el usuario es válido, crear el token.
    access_token = auth_service.create_access_token(user_id=user.id) # user.id es la Entidad de Dominio.
    return access_token
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ CREAR USUARIO -----------------------------------------------------------
@router.post("/auth/register", response_model=UserResponse,status_code=status.HTTP_201_CREATED,summary="Registrar un nuevo usuario en el sistema", operation_id="Register_User")
def register_new_user( user_data: UserCreate, auth_service: AuthServiceInterface = Depends(get_auth_service)):
    """
    Endpoint para registrar un nuevo usuario.
    """
    try:
        # Llamamos al caso de uso de Aplicación.
        user_entity = auth_service.register_user(user_data)
        # Mapeamos la Entidad de Dominio a un DTO de Respuesta (UserResponse).
        return UserResponse(
            id=user_entity.id,
            username=user_entity.username,
            full_name=user_entity.full_name,
            is_active=user_entity.is_active
        )
    except DomainError as e:
        # Mapeamos el error de Dominio a un error HTTP 400.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
# --------------------------------------------------------------------------------------------------------------



@router.get("/auth/me", response_model=UserResponse, summary="Obtener usuario actual")
def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    """
    Endpoint para obtener los datos del usuario autenticado.
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        full_name=current_user.full_name,
        is_active=current_user.is_active
    )