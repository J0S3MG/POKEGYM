from typing import List

# Define excepciones de aplicación o dominio
class ValueError(Exception):
	"""Excepción lanzada cuando una rutina con el mismo nombre ya existe."""
	pass

class DomainError(Exception):
	"""Excepción lanzada cuando un usuario con el mismo nombre ya existe."""
	pass


