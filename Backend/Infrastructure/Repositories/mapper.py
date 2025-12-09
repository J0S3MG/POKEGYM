from Domain.Entities.user import User
from Domain.Entities.rutina import Rutina
from Domain.Entities.ejercicio import Ejercicio
from Infrastructure.Repositories.models_db import RutinaDB, EjercicioDB, UserDB # Modelos DB definidos en el paso anterior

class Mapper():
    
    # ------------------------------------ Mapeo de RutinaDB a Rutina -----------------------------------
    @staticmethod
    def to_domain_entity(rutina_db: RutinaDB) -> Rutina:
        """Convierte el Modelo DB a la Entidad de Dominio Pura."""
        ejercicios_domain = [
            Ejercicio(
                # ... mapeo de todos los campos de EjercicioDB a Ejercicio.
                id=e.id, 
                nombre=e.nombre, 
                dia_semana=e.dia_semana,
                series=e.series,
                repeticiones=e.repeticiones,
                peso=e.peso,
                notas=e.notas,
                orden=e.orden,
                rutina_id=e.rutina_id,
                user_id=e.user_id
            ) for e in rutina_db.ejercicios
        ]
        return Rutina(
            id=rutina_db.id,
            user_id=rutina_db.user_id,
            nombre=rutina_db.nombre,
            descripcion=rutina_db.descripcion,
            fecha_creacion=rutina_db.fecha_creacion,
            ejercicios=ejercicios_domain
        )
    # ---------------------------------------------------------------------------------------------------


    # ------------------------------------ Mapeo de Rutina a RutinaDB -----------------------------------
    @staticmethod
    def to_db_model(rutina_domain: Rutina) -> RutinaDB:
        """Convierte la Entidad de Dominio Pura al Modelo DB (para guardar)."""
        rutina_db = RutinaDB(
            id=rutina_domain.id,
            user_id=rutina_domain.user_id,
            nombre=rutina_domain.nombre,
            descripcion=rutina_domain.descripcion,
            fecha_creacion=rutina_domain.fecha_creacion,
        ) 
        # Mapeo de Ejercicios. Necesario para manejar la relación en el ORM.
        rutina_db.ejercicios = [
             EjercicioDB(
                id=e.id,
                nombre=e.nombre,
                dia_semana=e.dia_semana,
                series=e.series,
                repeticiones=e.repeticiones,
                peso=e.peso,
                notas=e.notas,
                orden=e.orden,
                rutina_id=e.rutina_id, 
                user_id=rutina_domain.user_id
            ) for e in rutina_domain.ejercicios
        ]
        return rutina_db
    # ---------------------------------------------------------------------------------------------------


    # ------------------------------------ Mapeo de EjercicioDB a Ejercicio -----------------------------
    @staticmethod
    def to_domain_entity_ejercicio(ejercicio_db: EjercicioDB) -> Ejercicio:
        """Convierte el Modelo DB a la Entidad de Dominio Pura."""
        return Ejercicio(
            id=ejercicio_db.id, 
            nombre=ejercicio_db.nombre, 
            dia_semana=ejercicio_db.dia_semana,
            series=ejercicio_db.series,
            repeticiones=ejercicio_db.repeticiones,
            peso=ejercicio_db.peso,
            notas=ejercicio_db.notas,
            orden=ejercicio_db.orden,
            rutina_id=ejercicio_db.rutina_id,
            user_id=ejercicio_db.user_id
        )
    # ---------------------------------------------------------------------------------------------------


    # ------------------------------------ Mapeo de UserDB a User ---------------------------------------
    @staticmethod
    def to_domain_entity_user(user_db: UserDB) -> User:
        """Convierte el Modelo DB a la Entidad de Dominio Pura."""
        if not user_db:
            return None
            
        return User(
            id=user_db.id,
            username=user_db.username,
            hashed_password=user_db.hashed_password,
            full_name=user_db.full_name,
            is_active=user_db.is_active,
            date_created=user_db.date_created,
        )
    # ---------------------------------------------------------------------------------------------------

    
    # ------------------------------------ Mapeo de User a UserDB ---------------------------------------
    @staticmethod
    def to_db_model_user(user_domain: User) -> UserDB:
        """Convierte la Entidad de Dominio Pura al Modelo DB (para guardar)."""
        return UserDB(
            id=user_domain.id,
            username=user_domain.username,
            hashed_password=user_domain.hashed_password,
            full_name=user_domain.full_name,
            is_active=user_domain.is_active,
            date_created=user_domain.date_created,
        )
    # ---------------------------------------------------------------------------------------------------