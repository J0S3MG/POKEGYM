from typing import List
from Domain.Entities.rutina import Rutina
from Domain.Entities.ejercicio import Ejercicio
from Domain.Exceptions.domain_exception import ValueError, DomainError
from Domain.Interfaces.rutina_service_interface import RutinaServiceInterface
from Domain.Interfaces.rutina_repository_interface import RutinaRepositoryInterface
from Application.DTOs.ejercicio_dto import EjercicioCreate, EjercicioUpdate
from Application.DTOs.rutina_dto import RutinaConEjerciciosCreate, RutinaModificarRequest
from Application.Exceptions.rutina_exception import RutinaAlreadyExistsError, RutinaNotFoundError


class RutinaService(RutinaServiceInterface):
    """Implementacion de la interfaz"""

    def __init__(self, rutina_repository: RutinaRepositoryInterface): 
        self.repository = rutina_repository

    
    # ------------------------------------- ALTA RUTINA ---------------------------------------------------
    def alta_rutina(self, rutina_completa: RutinaConEjerciciosCreate, user_id: int) -> Rutina:
        """
        Caso de Uso: Dar de alta y persiste una nueva rutina y sus ejercicios.
        """
        # Validación de Regla de Negocio: Nombre Único.
        if self.repository.get_by_nombre(rutina_completa.nombre, user_id):
            raise RutinaAlreadyExistsError(
                f"Ya existe una rutina con el nombre: {rutina_completa.nombre}"
            )
    
        # Mapeamos DTOs (Ejercicios) a Entidades de Dominio Puras.
        ejercicios_domain: List[Ejercicio] = []
        # Solo procesar ejercicios si la lista existe y no está vacía.
        if rutina_completa.ejercicios:  # Esto evalúa a False si es None o lista vacía.
            for e_dto in rutina_completa.ejercicios:
                ejercicios_domain.append(
                    Ejercicio(
                        nombre=e_dto.nombre,
                        dia_semana=e_dto.dia_semana,
                        series=e_dto.series,
                        repeticiones=e_dto.repeticiones,
                        peso=e_dto.peso,
                        notas=e_dto.notas,
                        orden=e_dto.orden,
                        user_id=user_id
                    )
                )
    
        # Crear la Entidad Raíz del Agregado (Rutina).
        rutina_domain = Rutina(
            user_id=user_id,
            nombre=rutina_completa.nombre,
            descripcion=rutina_completa.descripcion,
            ejercicios=ejercicios_domain
        )
        # El Repositorio se encarga de traducir Rutina -> RutinaDB y guardar.
        rutina_guardada = self.repository.save(rutina_domain)
        return rutina_guardada
    # -----------------------------------------------------------------------------------------------------


    # ------------------------------------- LISTAR RUTINA -------------------------------------------------
    def listar_rutinas(self, skip: int, limit: int, user_id: int) -> Rutina:
        """Orquesta la paginación y devuelve el resultado del Dominio."""
        return self.repository.get_all_by_user(skip=skip, limit=limit, user_id=user_id) 
    # -----------------------------------------------------------------------------------------------------


    # ------------------------------------- BUSCAR POR ID -------------------------------------------------
    def obtener_detalle_rutina(self, rutina_id: int, user_id: int) -> Rutina:
        """Obtiene la rutina y realiza la agrupación de ejercicios."""
        rutina = self.repository.get_by_id(rutina_id, user_id)
        if not rutina:
            raise RutinaNotFoundError(f"Rutina con ID {rutina_id} no encontrada.")
        return rutina 
    # -----------------------------------------------------------------------------------------------------


    # ------------------------------------- BUSCAR POR NOMBRE ---------------------------------------------
    def buscar_por_nombre(self, nombre: str, user_id: int) -> Rutina:
        """Obtiene la rutina y realiza la agrupación de ejercicios."""
        rutina = self.repository.get_by_nombre(nombre, user_id)
        if not rutina:
            raise RutinaNotFoundError(f"Rutina con Nombre {nombre} no encontrada.")
        return rutina 
    # -----------------------------------------------------------------------------------------------------


    # ------------------------------------ BUSQUEDA PARCIAL POR NOMBRE ------------------------------------
    def buscar_rutinas_por_nombre(self, termino: str, user_id: int) -> List[Rutina]:
        """
        Caso de Uso: Búsqueda de rutinas.
        Llama al repositorio y devuelve las Entidades de Dominio.
        """
        clean_termino = termino.strip()
        if not clean_termino:
            return []
            
        return self.repository.search_by_name(clean_termino, user_id)
    # -----------------------------------------------------------------------------------------------------

    
    # ------------------------------------ MODIFICAR RUTINA -----------------------------------------------
    def modificar_rutina(self, rutina_id: int, data: RutinaModificarRequest, user_id: int) -> Rutina:
        """
        Caso de Uso: Orquestación de la modificación de la Rutina (Agregado).
        """
        rutina = self.repository.get_by_id(rutina_id, user_id)
        if not rutina:
            raise RutinaNotFoundError(f"Rutina con ID {rutina_id} no encontrada para modificar.")

        if rutina.user_id != user_id:
            # Lanzamos un error de Dominio que el Controlador mapeará a 403 Forbidden o 404 Not Found (por seguridad).
            raise DomainError("No tiene permisos para modificar esta rutina.")

        # LÓGICA DE NEGOCIO: Actualización de la Rutina Base.
        # Si el nombre cambia, validar unicidad (regla de aplicación/persistencia).
        if data.nombre is not None and data.nombre != rutina.nombre:
            if self.repository.get_by_nombre(data.nombre, user_id):
                raise RutinaAlreadyExistsError(f"Ya existe otra rutina con el nombre: {data.nombre}")

        # Llamar al método de Dominio para actualizar los datos base.
        rutina.actualizar_datos_base(data.nombre, data.descripcion)

        # LÓGICA DE NEGOCIO: Modificación de Ejercicios.
        # Convertir los DTOs de modificación/creación a diccionarios (para la entidad pura).
        modificaciones_dict = [e.model_dump(exclude_none=True) for e in data.ejercicios_a_modificar_o_crear]
        rutina.modificar_o_crear_ejercicios(modificaciones_dict)

        # Llamar al método de Dominio para la eliminación.
        rutina.eliminar_ejercicios(data.ids_ejercicios_a_eliminar)
        # PERSISTIR EL AGREGADO.
        rutina_guardada = self.repository.save(rutina)
        return rutina_guardada
    # -----------------------------------------------------------------------------------------------------


    # ------------------------------------ DAR DE BAJA UNA RUTINA -----------------------------------------
    def dar_baja_rutina(self, rutina_id: int, user_id: int):
        """
        Caso de Uso: Orquestación de la eliminación de la Rutina.
        """
        try:
            # Si el usuario no es el dueño, delete_by_id lanzará ValueError (porque no la encontrará con ese user_id)
            self.repository.delete_by_id(rutina_id, user_id) 
        except ValueError:
            # Mapeamos la excepción de la Infraestructura a un error de Aplicación/Dominio
            raise RutinaNotFoundError(f"Rutina con ID {rutina_id} no encontrada para eliminar.")
    # -----------------------------------------------------------------------------------------------------


    # ------------------------------------ AGREGAR EJERCICIO ----------------------------------------------
    def agregar_ejercicio_a_rutina(self, rutina_id: int, data: EjercicioCreate,  user_id: int) -> Rutina:
        """
        Caso de Uso: Agrega un ejercicio individual a una rutina existente.
        """
        rutina = self.repository.get_by_id(rutina_id, user_id)
        if not rutina:
            raise RutinaNotFoundError(f"Rutina con ID {rutina_id} no encontrada.")

        ejercicio_data = data.model_dump()
        rutina.agregar_ejercicio(ejercicio_data)

        return self.repository.save(rutina)
    # -----------------------------------------------------------------------------------------------------

    
    # ------------------------------------ ACTUALIZAR EJERCICIO -------------------------------------------
    def actualizar_ejercicio(self, ejercicio_id: int, data: EjercicioUpdate,  user_id: int) -> Ejercicio:
        """
        Caso de Uso: Actualiza un ejercicio individual usando el nuevo EjercicioRepository.
        """
        ejercicio_data = data.model_dump(exclude_none=True)
        
        # DELEGAMOS al nuevo repositorio de ejercicio
        ejercicio_actualizado = self.repository.update_by_id(ejercicio_id, ejercicio_data, user_id)
        
        if not ejercicio_actualizado:
            raise RutinaNotFoundError(f"Ejercicio con ID {ejercicio_id} no encontrado para actualizar.")
            
        return ejercicio_actualizado
    # -----------------------------------------------------------------------------------------------------
    

    # ------------------------------------ ELIMINAR EJERCICIO ---------------------------------------------
    def eliminar_ejercicio(self, ejercicio_id: int,  user_id: int):
        """
        Caso de Uso: Elimina un ejercicio individual usando el nuevo EjercicioRepository.
        """
        # DELEGAMOS al nuevo repositorio de ejercicio
        eliminado = self.repository.delete_by_ejercicio_id(ejercicio_id, user_id)
        
        if not eliminado:
            raise RutinaNotFoundError(f"Ejercicio con ID {ejercicio_id} no encontrado para eliminar.")
    # -----------------------------------------------------------------------------------------------------