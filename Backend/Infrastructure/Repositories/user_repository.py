from sqlmodel import Session, select
from typing import Optional, List
from Domain.Entities.user import User
from Domain.Interfaces.user_repository_interface import UserRepositoryInterface
from Infrastructure.Repositories.models_db import UserDB 
from Infrastructure.Repositories.mapper import Mapper

class UserRepository(UserRepositoryInterface):
    """Implementación concreta del Repositorio de Usuarios."""
    
    def __init__(self, session: Session):
        self.session = session

    
    # ---------------------------------- CREAR USUARIO -------------------------------------
    def create_user(self, user_entity: User) -> User:
        """Persiste una Entidad User en la base de datos."""
        # Mapear de Entidad de Dominio a Modelo DB.
        user_db = Mapper.to_db_model_user(user_entity)
        # Persistir.
        self.session.add(user_db)
        self.session.commit()
        self.session.refresh(user_db)
        # Devolver la Entidad actualizada (ahora con ID).
        return Mapper.to_domain_entity_user(user_db)
    # --------------------------------------------------------------------------------------


    # ---------------------------------- BUSCAR USUARIO POR NOMBRE -------------------------
    def get_by_username(self, username: str) -> Optional[User]:
        """Busca una Entidad User por nombre de usuario."""
        statement = select(UserDB).where(UserDB.username == username)
        user_db = self.session.exec(statement).first()
        
        if user_db:
            return Mapper.to_domain_entity_user(user_db)
        return None
    # --------------------------------------------------------------------------------------


    # ---------------------------------- BUSCAR USUARIO POR ID -----------------------------
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Busca una Entidad User por ID (necesario para la verificación de JWT)."""
        user_db = self.session.get(UserDB, user_id)
        
        if user_db:
            return Mapper.to_domain_entity_user(user_db)
        return None
    # --------------------------------------------------------------------------------------