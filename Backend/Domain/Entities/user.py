from typing import Optional
from datetime import datetime

class User:
    """
    Entidad de Dominio Pura User.
    Representa un usuario del sistema.
    """                             # El hash (bcrypt) de la contraseña.
    def __init__(self, username: str, hashed_password: str, id: Optional[int] = None, full_name: Optional[str] = None, is_active: bool = True, 
                    date_created: Optional[datetime] = None):
        # Validaciones de Dominio.
        if not username or not hashed_password:
            raise ValueError("El nombre de usuario y el hash de contraseña son obligatorios.")

        self.id = id
        self.username = username
        self.hashed_password = hashed_password
        self.full_name = full_name
        self.is_active = is_active
        self.date_created = date_created or datetime.now()

    
    # --------------------------- VALIDAMOS LA CONTRASEÑA PLANA ---------------------------------
    def is_valid_password(self, password_hasher: object, password: str) -> bool:
        """
        Método de dominio para verificar si una contraseña plana es correcta.
        Delega la operación criptográfica a una utilidad (password_hasher) 
        para mantener la pureza del Dominio.
        """
        # Delegamos la lógica de verificación de hash a la clase de Infraestructura.
        return password_hasher.verify_password(password, self.hashed_password)
    # -------------------------------------------------------------------------------------------