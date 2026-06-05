from abc import ABC, abstractmethod
from pathlib import Path


class StorageTarget(ABC):
    """Interfaz objetivo para el patrón Adapter."""

    @abstractmethod
    async def guardar(self, nombre_archivo: str, contenido: bytes) -> str:
        """Guarda un archivo y retorna la ruta interna de almacenamiento."""

    @abstractmethod
    async def obtener_ruta(self, ruta_interna: str) -> Path:
        """Obtiene la ruta física del archivo almacenado."""

    @abstractmethod
    async def eliminar(self, ruta_interna: str) -> None:
        """Elimina un archivo almacenado."""
