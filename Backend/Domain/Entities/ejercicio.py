from typing import Optional
from Domain.ValueObjects.dias import DiaSemana

class Ejercicio: # Creamos la entidad Ejercicio pura.
    """Entidad de Dominio Ejercicio"""
    def __init__(self, nombre: str, dia_semana: DiaSemana, series: int, repeticiones: int, orden: int,
        peso: Optional[float] = None, notas: Optional[str] = None, id: Optional[int] = None, rutina_id: Optional[int] = None, user_id: Optional[int] = None):

        # Validaciones de Ejercicio
        if series < 1 or repeticiones < 1 or orden < 0:
            raise ValueError("Series, repeticiones y orden deben ser valores positivos.")
            
        self.id = id
        self.rutina_id = rutina_id
        self.user_id = user_id
        self.nombre = nombre
        self.dia_semana = dia_semana
        self.series = series
        self.repeticiones = repeticiones
        self.peso = peso
        self.notas = notas
        self.orden = orden

