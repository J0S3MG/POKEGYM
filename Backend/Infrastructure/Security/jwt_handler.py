import time
from typing import Optional
from config import Settings
from starlette import status
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from Domain.Entities.user import User
from Domain.Exceptions.domain_exception import ValueError 
from Domain.Interfaces.auth_service_interface import AuthServiceInterface


# El tokenUrl apunta al endpoint que el cliente debe usar para obtener el token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token") # Definimos el esquema de seguridad (OAuth2PasswordBearer).
# Indica a FastAPI que espere el token en el encabezado Authorization: Bearer <token>.


# ----------------------- DECODIFICAR UN TOKEN (DEVOLVEMOS UN USUARIO) ----------------------
def get_current_user(token: str = Depends(oauth2_scheme) ) -> User:
    """Decodifica el token y devuelve el objeto User si es válido."""
    from Infrastructure.deps import get_auth_service 
    
    # Llamada directa para obtener la instancia del servicio:
    auth_service = get_auth_service() 

    user = auth_service.get_user_from_token(token=token)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas o token expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user
# -------------------------------------------------------------------------------------------


class JWTHandler:
    """
    Utilitario de Infraestructura para la codificación y decodificación de JWT.
    """
   
    def __init__(self, settings: Settings): # <-- RECIBE SETTINGS
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.expire_minutes = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES


    # ---------------------------------- CREAR UN JWT FRIMADO -----------------------------------
    def create_access_token(self, user_id: int) -> str:
        """
        Genera un JWT firmado que incluye el ID del usuario (sub) y la expiración (exp).
        """
        # Calcular el tiempo de expiración.
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.expire_minutes)
        
        # Crear el payload (la carga útil del token).
        to_encode = {
            "sub": str(user_id),  # 'sub' (subject) es el ID del usuario.
            "exp": expire,        # 'exp' (expiration) tiempo de expiración.
        }
        
        # Codificar el token con la clave secreta y el algoritmo.
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    # -------------------------------------------------------------------------------------------

    
    # ----------------------- DECODIFICAR UN JWT (DEVOLVEMOS ID DE USUARIO) ---------------------
    def decode_token(self, token: str) -> Optional[int]:
        """
        Decodifica y valida el token JWT. 
        Devuelve el ID del usuario (sub) o None/lanza error si no es válido.
        """
        try:
            # Decodificar (Verifica la firma, la expiración y el algoritmo).
            payload = jwt.decode( token, self.secret_key, algorithms=[self.algorithm])
            # Extraer el ID del usuario.
            user_id = payload.get("sub")
            
            if user_id is None:
                raise ValueError("Token no contiene el ID del sujeto (sub).")
            # user_id se devuelve como string, lo convertimos a int para usarlo en el Servicio.
            return int(user_id) 

        except JWTError:
            # Captura errores como token inválido, firma incorrecta, o token expirado.
            return None # Devolvemos None si el token no es válido o está expirado.
        except Exception:
            # Captura cualquier otro error, como error de casting.
            return None
    # -------------------------------------------------------------------------------------------





