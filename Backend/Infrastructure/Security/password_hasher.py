from passlib.context import CryptContext

class PasswordHasher:
    """
    Utilidad de Infraestructura para manejar las operaciones criptográficas.
    """

    def __init__(self, context: CryptContext): # <-- RECIBE EL CONTEXTO INYECTADO
        self.context = context
    
    # ---------------------------------- ENCRIPTANDO LA PWD -------------------------------------
    def hash_password(self, password: str) -> str:
        """
        Genera el hash seguro de la contraseña dada.
        """
        return self.context.hash(password)
    # -------------------------------------------------------------------------------------------

   
    # ---------------------------------- VERIFICANDO LA PWD -------------------------------------
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verifica si la contraseña plana (plain_password) coincide con el hash almacenado.
        """
        return self.context.verify(plain_password, hashed_password)
    # -------------------------------------------------------------------------------------------

