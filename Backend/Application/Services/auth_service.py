from typing import Optional
from Domain.Entities.user import User
from Domain.Exceptions.domain_exception import DomainError
from Domain.Interfaces.auth_service_interface import AuthServiceInterface
from Domain.Interfaces.user_repository_interface import UserRepositoryInterface
from Application.DTOs.auth_dto import Token, UserLogin, TokenPayload, UserCreate
from Infrastructure.Security.jwt_handler import JWTHandler         # Utilitario para el token
from Infrastructure.Security.password_hasher import PasswordHasher # Utilitario para el hash



class AuthService(AuthServiceInterface):
    """
    Implementación del Caso de Uso para la autenticación y gestión de tokens.
    """
    def __init__(self, user_repository: UserRepositoryInterface, password_hasher: PasswordHasher, jwt_handler: JWTHandler):
        self.user_repository = user_repository
        self.password_hasher = password_hasher
        self.jwt_handler = jwt_handler

    
    # --------------------------- AUTENTICACION DE USUARIO (LOGIN) ------------------------------
    def authenticate_user(self, user_login: UserLogin) -> Optional[User]:
        """
        Verifica las credenciales del usuario.
        """
        # Buscar al usuario por nombre en el repositorio.
        user = self.user_repository.get_by_username(user_login.username)
        
        if not user:
            return None # Usuario no encontrado.
        # Verificar la contraseña, delegando a la Entidad y la Utilidad.
        if not user.is_valid_password(self.password_hasher, user_login.password):
            return None # Contraseña incorrecta
        
        # Si es válido y activo, devolver la Entidad User.
        if not user.is_active:
             return None # Usuario inactivo, no se puede autenticar.
        return user
    # -------------------------------------------------------------------------------------------


    # ---------------------------------- REGISTRAMOS UN NUEVO USER ------------------------------
    def register_user(self, user_data: UserCreate) -> User:
        """
        Caso de Uso: Registra un nuevo usuario en el sistema, asegurando unicidad.
        """
        # Verificar la Regla de Negocio: Unicidad de Username.
        if self.user_repository.get_by_username(user_data.username):
            # Usamos un error de Dominio que se mapeará a un 400 en el Controller.
            raise DomainError(f"El nombre de usuario '{user_data.username}' ya está en uso.")

        # Hashing: Delegar el trabajo a la Infraestructura.
        hashed_password = self.password_hasher.hash_password(user_data.password)
        
        # Crear la Entidad de Dominio.
        new_user_entity = User(
            username=user_data.username,
            hashed_password=hashed_password,
            full_name=user_data.full_name
            # is_active y date_created toman valores por defecto.
        )
        
        # Persistir la Entidad y devolver.
        return self.user_repository.create_user(new_user_entity)
    # -------------------------------------------------------------------------------------------

    
    # --------------------------- CREAR TOKEN DE ACCESO -----------------------------------------
    def create_access_token(self, user_id: int) -> Token:
        """
        Crea un Token JWT (Token DTO) para el usuario autenticado.
        """
        # Delegamos la creación del token a la utilidad de Infraestructura.
        jwt_token = self.jwt_handler.create_access_token(user_id=user_id)
        # Devolvemos el DTO de respuesta.
        return Token(access_token=jwt_token)
    # -------------------------------------------------------------------------------------------


    # ------------------- DEVOLVEMOS AL USUARIO SEGUN SU TOKEN (PROTECCIÓN) ---------------------
    def get_user_from_token(self, token: str) -> Optional[User]:
        """
        Decodifica el token, verifica su validez y busca al usuario en la DB.
        """
        # Decodificar el token para obtener el user_id.
        user_id = self.jwt_handler.decode_token(token)
        
        if user_id is None:
            return None # Token inválido, expirado o mal formado.
        # Buscar al usuario en el repositorio por ID.
        user = self.user_repository.get_by_id(user_id)
        
        if user is None or not user.is_active:
            return None # Usuario no existe o no está activo.
        # Devolver la Entidad User.
        return user
    # -------------------------------------------------------------------------------------------