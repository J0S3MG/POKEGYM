from sqlmodel import Session, select, Relationship, func
from typing import Optional, List, Any, Dict
from Domain.Entities.rutina import Rutina
from Domain.Entities.ejercicio import Ejercicio
from Domain.Exceptions.domain_exception import ValueError
from Domain.Interfaces.rutina_repository_interface import RutinaRepositoryInterface
from Infrastructure.Repositories.models_db import RutinaDB, EjercicioDB 
from Infrastructure.Repositories.mapper import Mapper

class RutinaRepository(RutinaRepositoryInterface):
    """Implementación concreta del Repositorio de Rutinas usando SQLModel/PostgreSQL."""
    
    def __init__(self, session: Session):
        self.session = session
    

    # --------------------------------- ALTA Y MODIFICACION DE RUTINA ----------------------
    def save(self, rutina: Rutina) -> Rutina:
        """Implementa el guardado/actualizado del Agregado."""
        rutina_db = Mapper.to_db_model(rutina)

        if rutina_db.id is not None:
             # Si ya tiene ID, usamos merge para asegurar que actualiza.
             rutina_db = self.session.merge(rutina_db)
        else:
             # Si el ID es None (nueva creación), usamos add.
             self.session.add(rutina_db)
    
        self.session.commit()
        self.session.refresh(rutina_db)
        return Mapper.to_domain_entity(rutina_db)
    # ---------------------------------------------------------------------------------------


    # -------------------------------------- LISTAR RUTINAS (FILTRADO) ----------------------
    # Implementación del nuevo método get_all_by_user
    def get_all_by_user(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Rutina]:
        """Devuelve una lista paginada de rutinas, solo del usuario especificado."""
        query = select(RutinaDB).where(RutinaDB.user_id == user_id).offset(skip).limit(limit)
        rutinas = self.session.exec(query).all()
        return [Mapper.to_domain_entity(r) for r in rutinas]
    # ---------------------------------------------------------------------------------------


    # ------------------------------------- BUSCAR POR ID (FILTRADO) ------------------------
    # CLAVE: Ahora requiere user_id para verificar la propiedad en la DB
    def get_by_id(self, rutina_id: int, user_id: int) -> Optional[Rutina]:
        rutina_db = self.session.exec( select(RutinaDB).where(RutinaDB.id == rutina_id).where(RutinaDB.user_id == user_id)).first()
    
        if rutina_db is None:
            return None # Si no encuentra la rutina O no pertenece al usuario, devuelve None.
        return Mapper.to_domain_entity(rutina_db)
    # ----------------------------------------------------------------------------------------


    # ------------------------------------- BUSCAR POR NOMBRE (FILTRADO) ---------------------
    # CLAVE: Ahora requiere user_id para buscar unicidad solo dentro de las rutinas del usuario
    def get_by_nombre(self, nombre: str, user_id: int) -> Optional[Rutina]:
        """Implementa la búsqueda por nombre, filtrando por user_id."""
        statement = select(RutinaDB).where( RutinaDB.nombre == nombre, RutinaDB.user_id == user_id)
        rutina_db = self.session.exec(statement).first()
        if rutina_db:
            return Mapper.to_domain_entity(rutina_db)
        return None
    # -----------------------------------------------------------------------------------------


    # -------------------------------- BUSQUEDA PARCIAL POR NOMBRE (FILTRADO) -----------------
    # CLAVE: Ahora requiere user_id para buscar solo dentro de las rutinas del usuario
    def search_by_name(self, termino: str, user_id: int) -> List[Rutina]:
        """Busca rutinas cuyo nombre contenga el término de búsqueda, filtrando por user_id."""
        if not termino:
            # Si el término está vacío, devolvemos todas las rutinas del usuario.
            return self.get_all_by_user(user_id=user_id) 
        
        search_pattern = f"%{termino.lower()}%"

        statement = select(RutinaDB).where(func.lower(RutinaDB.nombre).like(search_pattern), RutinaDB.user_id == user_id)
        rutinas_db = self.session.exec(statement).all()

        return [Mapper.to_domain_entity(r) for r in rutinas_db]
    # -----------------------------------------------------------------------------------------


    # ------------------------------------- DAR DE BAJA UNA RUTINA (FILTRADO) -----------------
    # CLAVE: Ahora requiere user_id para asegurar que solo el dueño puede eliminar
    def delete_by_id(self, rutina_id: int, user_id: int):
        """Busca el modelo DB por ID y user_id y lo elimina. El ORM debe manejar la cascada."""
    
        # Buscar el modelo DB por ID Y user_id
        statement = select(RutinaDB).where(RutinaDB.id == rutina_id, RutinaDB.user_id == user_id)
        rutina_db = self.session.exec(statement).first()
    
        if not rutina_db:
            # Usamos ValueError ya que el servicio debe capturar esto y mapear a 404.
            raise ValueError(f"Rutina con ID {rutina_id} no encontrada.")
    
        self.session.delete(rutina_db)
        self.session.commit()
    # -----------------------------------------------------------------------------------------

    
    # ------------------------------------ ACTUALIZAR EJERCICIO -------------------------------
    def update_by_id(self, ejercicio_id: int, data: dict,  user_id: int) -> Optional[Ejercicio]:
        """Actualiza un Ejercicio por su ID."""
        ejercicio_db = self.session.exec(select(EjercicioDB).where(EjercicioDB.id == ejercicio_id).where(EjercicioDB.user_id == user_id)).first()
        
        if not ejercicio_db:
            return None

        for key, value in data.items():
            if hasattr(ejercicio_db, key) and value is not None:
                setattr(ejercicio_db, key, value)
        
        self.session.add(ejercicio_db)
        self.session.commit()
        self.session.refresh(ejercicio_db)

        return Mapper.to_domain_entity_ejercicio(ejercicio_db)
    # -----------------------------------------------------------------------------------------

    
    # ------------------------------------ ELIMINAR EJERCICIO ---------------------------------
    def delete_by_ejercicio_id(self, ejercicio_id: int, user_id: int) -> bool:
        """Elimina un Ejercicio por su ID."""
        ejercicio_db = self.session.exec(select(EjercicioDB).where(EjercicioDB.id == ejercicio_id).where(EjercicioDB.user_id == user_id)).first()
        
        if not ejercicio_db:
            return False

        self.session.delete(ejercicio_db)
        self.session.commit()
        return True
    # -----------------------------------------------------------------------------------------
        


