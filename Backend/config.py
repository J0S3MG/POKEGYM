from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Database (opcional)
    DATABASE_URL: Optional[str] = None

    # Configuración de Pydantic Settings.
    # Esto le dice a Pydantic que lea las variables de entorno.
    # y que también busque un archivo .env
    model_config = SettingsConfigDict( env_file='.env', env_file_encoding='utf-8', extra='ignore')
    
# Instancia global de configuración.
settings = Settings()