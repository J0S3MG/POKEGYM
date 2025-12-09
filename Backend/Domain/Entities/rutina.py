from datetime import datetime
from typing import List, Dict, Any, Optional
from Domain.Entities.ejercicio import Ejercicio
from Domain.Exceptions.domain_exception import ValueError

class Rutina: # Elegiremos rutina como el Agregado de nuestro dominio.
    """Entidad Raíz del Agregado Rutina"""
    def __init__( self, id: Optional[int] = None, user_id: Optional[int] = None, nombre: Optional[str] = None, descripcion: Optional[str] = None,
        fecha_creacion: Optional[datetime] = None, ejercicios: List[Ejercicio] = None ):
        self.id = id
        self.user_id: Optional[int] = user_id
        self.nombre = nombre
        self.descripcion = descripcion
        self.fecha_creacion = fecha_creacion or datetime.now()
        self.ejercicios: List[Ejercicio] = ejercicios if ejercicios is not None else []
    

    def actualizar_datos_base(self, nombre: Optional[str], descripcion: Optional[str]):
        """Actualiza el nombre y descripción de la rutina."""
        if nombre is not None:
            self.nombre = nombre
        if descripcion is not None:
            self.descripcion = descripcion


    def agregar_ejercicio(self, ejercicio_data: Dict[str, Any]):
        """Crea y añade un nuevo ejercicio al agregado (id=None)."""
        
        # Creamos la Entidad Ejercicio Pura con los datos del DTO/Diccionario.
        nuevo_ejercicio = Ejercicio(
            # **Importante:** Pasamos los datos sin ID, se generará al guardar
            **ejercicio_data
        )
        self.ejercicios.append(nuevo_ejercicio)


    def modificar_o_crear_ejercicios(self, modificaciones: List[Dict[str, Any]]):
        """
        Maneja la lógica de actualización/creación de ejercicios por ID.
        Los IDs de Ejercicio deben ser tratados dentro del Agregado.
        """
        for item in modificaciones:
            ejercicio_id = item.get('id')
            # Si no hay ID, es una creación (delegate al método de agregar)
            if ejercicio_id is None:
                self.agregar_ejercicio(item)
                continue
            # Si hay ID, es una modificación
            ejercicio_a_actualizar = next(
                (e for e in self.ejercicios if e.id == ejercicio_id), 
                None
            )
            if not ejercicio_a_actualizar:
                # Esto es una excepción de Dominio, el ejercicio que se quiere modificar no existe en el agregado
                raise ValueError(f"Ejercicio con ID {ejercicio_id} no encontrado en la Rutina {self.id}")

            for key, value in item.items():
                # Ignoramos el ID y solo actualizamos si el valor es explícitamente enviado (no None)
                if key != 'id' and value is not None:
                    setattr(ejercicio_a_actualizar, key, value)


    def eliminar_ejercicios(self, ids_a_eliminar: List[int]):
        """Elimina ejercicios de la lista interna del agregado por sus IDs."""
        # Filtramos la lista de ejercicios, manteniendo solo aquellos cuyo ID no está en la lista de eliminación.
        self.ejercicios = [e for e in self.ejercicios if e.id not in ids_a_eliminar]