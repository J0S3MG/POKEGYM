from pydantic import BaseModel
from sqlmodel import SQLModel, Field # Se usa SQLModel aquí como DTO
from typing import Optional, List
from datetime import datetime
# Importamos los DTOs de Ejercicio aquí (abajo) para la respuesta


class RutinaConEjerciciosCreate(SQLModel):
    """DTO para crear una Rutina"""
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = Field(None, max_length=500)
    ejercicios: Optional[List["EjercicioCreate"]] = None # Referencia a los DTOs.


class RutinaModificarRequest(SQLModel):
    """
    DTO completo para la Modificación de Rutina y sus ejercicios asociados.
    """
    nombre: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=500)
    # 1. Ejercicios a MODIFICAR o CREAR (si id es None)
    ejercicios_a_modificar_o_crear: Optional[List["EjercicioUpdate"]] = None
    
    # IDs de Ejercicios a ELIMINAR
    ids_ejercicios_a_eliminar: Optional[List[int]] = Field(
        default=[],
        description="Lista de IDs de ejercicios existentes que deben ser eliminados."
    )

# DTOs de Respuesta (Response)
class RutinaResponse(SQLModel):
    """DTO para la respuesta de Rutina simple"""
    id: int
    nombre: str
    descripcion: Optional[str] = None
    fecha_creacion: datetime
    ejercicios: List["EjercicioResponse"] = [] # Referencia a DTOs
    

# Importaciones y refs para resolver dependencia circular
from Application.DTOs.ejercicio_dto import EjercicioResponse, EjercicioCreate, EjercicioUpdate
RutinaResponse.update_forward_refs()
RutinaConEjerciciosCreate.update_forward_refs()