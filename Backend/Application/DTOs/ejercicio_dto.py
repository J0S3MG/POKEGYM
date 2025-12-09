from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import Optional, List
from Domain.ValueObjects.dias import DiaSemana # Se importa el Value Object para validación

# DTOs de Solicitud (Request)
class EjercicioCreate(SQLModel):
    """DTO para crear un Ejercicio"""
    nombre: str = Field(..., max_length=100)
    dia_semana: DiaSemana
    series: int = Field(ge=1)
    repeticiones: int = Field(ge=1)
    peso: Optional[float] = Field(None, ge=0)
    notas: Optional[str] = Field(None, max_length=500)
    orden: int = Field(ge=0)


class EjercicioUpdate(BaseModel):
    """DTO para actualizar el Ejercicio"""
    id: Optional[int] = None
    nombre: Optional[str] = Field(None, max_length=100)
    dia_semana: Optional[DiaSemana] = None
    series: Optional[int] = Field(None, ge=1)
    repeticiones: Optional[int] = Field(ge=1)
    peso: Optional[float] = Field(None, ge=0)
    notas: Optional[str] = Field(None, max_length=500)
    orden: int = Field(ge=0)

    

# DTOs de Respuesta (Response)
class EjercicioResponse(SQLModel):
    """DTO para la respuesta de Ejercicio"""
    id: int
    rutina_id: int
    nombre: str
    dia_semana: DiaSemana
    series: int
    repeticiones: int
    peso: Optional[float] = None
    notas: Optional[str] = None
    orden: int
