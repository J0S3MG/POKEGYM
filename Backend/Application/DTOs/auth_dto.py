from sqlmodel import SQLModel, Field
from typing import Optional

# --- DTOs de Solicitud (Request) ---
class UserCreate(SQLModel):
    """DTO de entrada para registrar un nuevo usuario."""
    username: str = Field(..., max_length=100)
    password: str = Field(..., min_length=8) 
    full_name: Optional[str] = None


class UserLogin(SQLModel):
    """DTO para que el usuario inicie sesión."""
    # Usaremos el esquema de Oauth2, que requiere 'username' y 'password'
    username: str = Field(..., max_length=100)
    password: str = Field(..., max_length=100)


# --- DTOs de Respuesta (Response) ---
class Token(SQLModel):
    """DTO que contiene el token JWT y su tipo."""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    """DTO interno que representa la carga (payload) del JWT."""
    sub: Optional[int] = None # El 'subject' (ID del usuario)
    exp: Optional[int] = None # Expiration time


class UserResponse(SQLModel):
    """DTO de salida para mostrar el usuario (sin mostrar el hash)."""
    id: int
    username: str
    full_name: Optional[str] = None
    is_active: bool