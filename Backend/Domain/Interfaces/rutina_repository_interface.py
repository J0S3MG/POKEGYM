from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from Domain.Entities.rutina import Rutina # Importa la Entidad Pura
from Domain.Entities.ejercicio import Ejercicio

class RutinaRepositoryInterface(ABC):
    """Interfaz (Puerto) que define las operaciones de persistencia del Agregado Rutina."""

    @abstractmethod
    def save(self, rutina: Rutina) -> Rutina:
        """Guarda o actualiza la Rutina completa (incluyendo sus Ejercicios)."""
        pass

    @abstractmethod
    def get_all_by_user(self, user_id: int, skip: int, limit: int) -> List[Rutina]:
        """Lista las rutinas con paginación, devolviendo solo las del user_id."""
        pass

    @abstractmethod
    def get_by_id(self, rutina_id: int, user_id: int) -> Optional[Rutina]:
        """Obtiene el detalle completo de una rutina por ID, verificando propiedad."""
        pass

    @abstractmethod
    def get_by_nombre(self, nombre: str, user_id: int) -> Optional[Rutina]:
        """Busca una rutina por su nombre para la validación de unicidad, filtrando por user_id."""
        pass

    @abstractmethod
    def search_by_name(self, termino: str, user_id: int) -> List[Rutina]:
        """Busca rutinas por coincidencia parcial, filtrando por user_id."""
        pass

    @abstractmethod
    def delete_by_id(self, rutina_id: int, user_id: int):
        """Elimina el Agregado Rutina completo por ID, verificando propiedad."""
        pass

    @abstractmethod
    def update_by_id(self, ejercicio_id: int, data: Dict[str, Any], user_id: int) -> Optional[Ejercicio]:
        """Actualiza los campos de un Ejercicio por su ID de manera individual."""
        pass
    
    @abstractmethod
    def delete_by_ejercicio_id(self, ejercicio_id: int, user_id: int) -> bool:
        """Elimina un Ejercicio por su ID. Devuelve True si fue eliminado."""
        pass