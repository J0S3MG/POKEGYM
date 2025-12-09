from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from Domain.Entities.user import User
from Domain.Entities.ejercicio import Ejercicio
from Domain.ValueObjects.dias import DiaSemana
from Domain.Exceptions.domain_exception import ValueError
from Domain.Interfaces.rutina_service_interface import RutinaServiceInterface
from Application.DTOs.ejercicio_dto import EjercicioCreate, EjercicioUpdate, EjercicioResponse
from Application.DTOs.rutina_dto import RutinaConEjerciciosCreate, RutinaResponse, RutinaModificarRequest
from Application.Exceptions.rutina_exception import RutinaAlreadyExistsError, RutinaNotFoundError
from Infrastructure.deps import get_rutina_service
from Infrastructure.Security.jwt_handler import get_current_user

router = APIRouter(prefix="/api", tags=["Rutinas"])

# ------------------------------------ ALTA RUTINAS ------------------------------------------------------------
@router.post("/rutinas", response_model=RutinaResponse, status_code=status.HTTP_201_CREATED, summary="Dar de Alta una Rutina", operation_id="Alta_Rutina")
def alta_rutina( data: RutinaConEjerciciosCreate,
    servicio: RutinaServiceInterface = Depends(get_rutina_service), 
    # Si la validación de get_current_user falla (token ausente o inválido),
    # FastAPI detiene la ejecución y devuelve 401 Unauthorized.
    current_user: User = Depends(get_current_user)) -> RutinaResponse:
    try:
        # Llamada al Caso de Uso/Servicio de Aplicación.
        rutina = servicio.alta_rutina(data, user_id=current_user.id)

        # Mapeo de Entidad de Dominio a DTO de Respuesta (para el cliente).
        return RutinaResponse.model_validate(rutina) 
    except RutinaAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail=str(e)
        )
    except Exception as e:
        # Manejo de errores generales (e.g., errores de DB, validación de Pydantic).
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Error al crear la rutina: {str(e)}"
        )
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ LISTAR RUTINAS ----------------------------------------------------------
@router.get( "/rutinas", response_model=List[RutinaResponse], summary="Lista todas las rutinas con paginación", operation_id="Listar_Rutina" )
def listar_rutinas( skip: int = Query(0, ge=0, description="Número de autos a saltar"),
    limit: int = Query(100, ge=1, le=1000, description="Número de autos a devolver"),
    servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)) -> List[RutinaResponse]:
    try:
        rutinas = servicio.listar_rutinas(skip, limit, user_id=current_user.id)
        return [RutinaResponse.model_validate(r) for r in rutinas]
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ BUSQUEDA PARCIAL POR NOMBRE ---------------------------------------------
@router.get("/rutinas/buscar", response_model=List[RutinaResponse],summary="Busca rutinas por coincidencia parcial en el nombre", operation_id="Busqueda_Parcial")
def search_rutinas(nombre: str = Query(..., min_length=1, description="Término de búsqueda parcial (ej: 'cardio')"),
    servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)):
    """
    Endpoint que responde a: GET /api/rutinas/buscar?nombre={texto}
    """
    # Llamada al Caso de Uso/Servicio de Aplicación.
    # Usamos el servicio existente, el cual recibe el término y devuelve las Entidades.
    rutinas_domain = servicio.buscar_rutinas_por_nombre(nombre, user_id=current_user.id)
    rutinas_resumen_dto = [RutinaResponse.model_validate(r) for r in rutinas_domain]
    return rutinas_resumen_dto
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ BUSCAR RUTINA POR ID ----------------------------------------------------
@router.get("/rutinas/{rutina_id}", response_model=RutinaResponse, summary="Obtiene el detalle completo de una rutina agrupado por día", operation_id="Rutina_por_dia")
def obtener_detalle_rutina( rutina_id: int, servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)):
    try:
        rutina_domain = servicio.obtener_detalle_rutina(rutina_id, user_id=current_user.id)
        response_data = RutinaResponse.model_validate(rutina_domain)
        return response_data
    except RutinaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ BUSCAR RUTINA POR NOMBRE ------------------------------------------------
@router.get("/rutinas/nombre/{nombre}", response_model=RutinaResponse, summary="Buscar una Rutina por su nombre", operation_id="Buscar_Rutina_por_Nombre")
def buscar_por_nombre( nombre: str, servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)) -> RutinaResponse:
    try:
        rutina = servicio.buscar_por_nombre(nombre, user_id=current_user.id)
        return RutinaResponse.model_validate(rutina)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ MODIFICAR RUTINA --------------------------------------------------------
@router.put("/rutinas/{rutina_id}", response_model=RutinaResponse, summary="Modifica una rutina existente y sus ejercicios asociados", operation_id="Modificar_Rutina")
def modificar_rutina( rutina_id: int, data: RutinaModificarRequest, servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)):
    try:
        # Llamada al Caso de Uso/Servicio de Aplicación.
        rutina_domain = servicio.modificar_rutina(rutina_id, data, user_id=current_user.id)
        response_data = RutinaResponse.model_validate(rutina_domain)
        return response_data
    except RutinaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RutinaAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValueError as e:
        # Errores de Dominio (e.g., Ejercicio no encontrado en el agregado).
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ DAR DE BAJA UNA RUTINA --------------------------------------------------
@router.delete("/rutinas/{rutina_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Elimina una rutina y todos sus ejercicios asociados", operation_id="Dar_Baja_Rutina")
def dar_baja_rutina( rutina_id: int, rutina_service: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)):
    try:
        # Llamada al Caso de Uso/Servicio de Aplicación.
        rutina_service.dar_baja_rutina(rutina_id, user_id=current_user.id)
        return 
    except RutinaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
# --------------------------------------------------------------------------------------------------------------


# ------------------------------------ POST /rutinas/{id}/ejercicios ---------------------------------------------
@router.post("/rutinas/{rutina_id}/ejercicios", response_model=RutinaResponse,status_code=status.HTTP_201_CREATED, summary="Agrega un ejercicio a una rutina existente", operation_id="Agregar_Ejercicio")
def agregar_ejercicio(rutina_id: int, data: EjercicioCreate, servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)) -> RutinaResponse:
    try:
        rutina_domain = servicio.agregar_ejercicio_a_rutina(rutina_id, data, user_id=current_user.id)
        return RutinaResponse.model_validate(rutina_domain)
    except RutinaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error interno: {str(e)}")
# ----------------------------------------------------------------------------------------------------------------


# ------------------------------------ PUT /ejercicios/{id} ------------------------------------------------------
@router.put( "/ejercicios/{ejercicio_id}", response_model=EjercicioResponse, summary="Actualiza un ejercicio existente por ID", operation_id="Actualizar_Ejercicio")
def actualizar_ejercicio( ejercicio_id: int, data: EjercicioUpdate, servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)) -> EjercicioResponse:
    try:
        ejercicio_domain = servicio.actualizar_ejercicio(ejercicio_id, data, user_id=current_user.id)
        return EjercicioResponse.model_validate(ejercicio_domain)
    except RutinaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
# ----------------------------------------------------------------------------------------------------------------


# ------------------------------------ DELETE /ejercicios/{id} ---------------------------------------------------
@router.delete("/ejercicios/{ejercicio_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Elimina un ejercicio por ID", operation_id="Eliminar_Ejercicio")
def eliminar_ejercicio( ejercicio_id: int, servicio: RutinaServiceInterface = Depends(get_rutina_service), current_user: User = Depends(get_current_user)):
    try:
        servicio.eliminar_ejercicio(ejercicio_id, user_id=current_user.id)
        return 
    except RutinaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
# ----------------------------------------------------------------------------------------------------------------


