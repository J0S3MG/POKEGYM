from typing import List

# Define excepciones de aplicación o dominio
class RutinaAlreadyExistsError(Exception):
	"""Excepción lanzada cuando una rutina con el mismo nombre ya existe."""
	pass

class RutinaNotFoundError(Exception):
	"""Excepción lanzada cuando una rutina con el mismo nombre ya existe."""
	pass
