from abc import ABC, abstractmethod
from typing import Optional, List, Any, Dict
from Domain.Entities.rutina import Rutina
from Domain.Entities.ejercicio import Ejercicio
from Application.DTOs.ejercicio_dto import EjercicioCreate, EjercicioUpdate
from Application.DTOs.rutina_dto import RutinaConEjerciciosCreate, RutinaModificarRequest

class RutinaServiceInterface(ABC):
    """
    Interfaz (Puerto) que define el Caso de Uso para la creación de Rutinas.
    El Controlador dependerá de esta interfaz.
    """
    @abstractmethod
    def alta_rutina(self, data: RutinaConEjerciciosCreate, user_id: int) -> Rutina:
        """Contrato para dar de alta una rutina completa."""
        pass
    
    @abstractmethod
    def listar_rutinas(self, skip: int, limit: int, user_id: int) -> List[Rutina]:
        """Lista las rutinas con paginación, devolviendo Entidades de Dominio."""
        pass

    @abstractmethod
    def obtener_detalle_rutina(self, rutina_id: int, user_id: int) -> Optional[Rutina]:
        """Obtiene el detalle completo de una rutina por ID."""
        pass
    
    @abstractmethod
    def buscar_por_nombre(self, nombre: str, user_id: int) -> Optional[Rutina]:
        """Busca una rutina por su nombre para la validación de unicidad."""
        pass
    
    @abstractmethod
    def buscar_rutinas_por_nombre(self, termino: str, user_id: int) -> List[Rutina]:
        """Busca rutinas por coincidencia parcial en el nombre, sin distinguir mayúsculas/minúsculas."""
        pass

    @abstractmethod
    def modificar_rutina(self, rutina_id: int, data: RutinaModificarRequest, user_id: int) -> Rutina:
        """Modifica la rutina base y sus ejercicios asociados (agregar/editar/eliminar)."""
        pass

    @abstractmethod
    def dar_baja_rutina(self, rutina_id: int, user_id: int):
        """Elimina el Agregado Rutina completo por ID."""
        pass

    @abstractmethod
    def agregar_ejercicio_a_rutina(self, rutina_id: int, data: EjercicioCreate, user_id: int) -> Rutina:
        """Agrega un nuevo ejercicio a una rutina existente por ID."""
        pass

    @abstractmethod
    def actualizar_ejercicio(self, ejercicio_id: int, data: EjercicioUpdate, user_id: int) -> Ejercicio:
        """Actualiza un ejercicio existente por ID de Ejercicio."""
        pass

    @abstractmethod
    def eliminar_ejercicio(self, ejercicio_id: int, user_id: int):
        """Elimina un ejercicio existente por ID de Ejercicio."""
        pass
    
