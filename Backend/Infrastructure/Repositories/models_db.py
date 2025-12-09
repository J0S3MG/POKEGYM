from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from Domain.ValueObjects.dias import DiaSemana # Se pueden importar Value Objects


# MODELO DE TABLA (DB) - User
class UserDB(SQLModel, table=True):
    """Modelo de base de datos para la Entidad User."""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, max_length=100)
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    date_created: datetime = Field(default_factory=datetime.now)
    rutinas: List["RutinaDB"] = Relationship(back_populates="owner") 
    ejercicios: List["EjercicioDB"] = Relationship(back_populates="owner")


# MODELO DE TABLA (DB) - Ejercicio
class EjercicioDB(SQLModel, table=True):
    __tablename__ = "ejercicio"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutina.id")
    user_id: int = Field(foreign_key="users.id", index=True)
    nombre: str 
    dia_semana: DiaSemana 
    series: int 
    repeticiones: int 
    peso: Optional[float] = None 
    notas: Optional[str] = None 
    orden: int 
    rutina: "RutinaDB" = Relationship(back_populates="ejercicios")
    owner: "UserDB" = Relationship(back_populates="ejercicios")


# MODELO DE TABLA (DB) - Rutina
class RutinaDB(SQLModel, table=True):
    __tablename__ = "rutina"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    nombre: str 
    descripcion: Optional[str] = None 
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    ejercicios: List["EjercicioDB"] = Relationship(
        back_populates="rutina", 
        # Envolvemos el argumento 'cascade' dentro de sa_relationship_kwargs
        sa_relationship_kwargs={"cascade": "all, delete-orphan"} 
    )
    owner: "UserDB" = Relationship(back_populates="rutinas")

    
