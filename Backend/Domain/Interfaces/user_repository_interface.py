from abc import ABC, abstractmethod
from typing import Optional
from Domain.Entities.user import User 

class UserRepositoryInterface(ABC):
    """
    Interfaz del Repositorio que maneja la persistencia de la Entidad User.
    """
    @abstractmethod
    def create_user(self, user_entity: User) -> User:
        """Persiste una Entidad User en la base de datos."""
        pass

    @abstractmethod
    def get_by_username(self, username: str) -> Optional[User]:
        """Busca una Entidad User por nombre de usuario."""
        pass
    
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Busca una Entidad User por id de usuario."""
        pass
