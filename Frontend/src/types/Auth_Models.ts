// Basado en los DTOs auth_dto.py
export interface UserResponse {
  id: number;
  username: string;
  full_name: string | null;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string; // Siempre "bearer"
}

export interface UserCreate {
  username: string;
  password: string;
  full_name?: string;
}

export interface LoginRequest {
  username: string; // FastAPI OAuth2 usa "username"
  password: string;
}

// Para el contexto de auth
export interface UsuarioContext {
  id: number;
  username: string;
  full_name?: string;
  is_active: boolean;
}

export interface ErrorResponse {
  detail: string;
}