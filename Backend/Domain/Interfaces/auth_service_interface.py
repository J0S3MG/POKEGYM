from abc import ABC, abstractmethod
from typing import Optional
from Domain.Entities.user import User
from Application.DTOs.auth_dto import Token, UserLogin, TokenPayload, UserCreate

class AuthServiceInterface(ABC):
    """
    Interfaz del Servicio de Aplicación para gestionar la autenticación y tokens.
    """
    @abstractmethod
    def authenticate_user(self, user_login: UserLogin) -> Optional[User]:
        """Verifica las credenciales y devuelve la Entidad User si son válidas."""
        pass

    @abstractmethod
    def register_user(self, user_data: UserCreate) -> User:
        """Caso de Uso: Registra un nuevo usuario en el sistema, asegurando unicidad."""
        pass

    @abstractmethod
    def create_access_token(self, user_id: int) -> Token:
        """Crea un Token JWT para un ID de usuario dado."""
        pass

    @abstractmethod
    def get_user_from_token(self, token: str) -> Optional[User]:
        """Decodifica el token y devuelve la Entidad User correspondiente."""
        pass