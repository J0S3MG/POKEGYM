from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Variables de Configuración JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Configuración de Pydantic Settings
    # Esto le dice a Pydantic que lea las variables de entorno
    # y que también busque un archivo .env
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

# Instancia global de configuración
settings = Settings()