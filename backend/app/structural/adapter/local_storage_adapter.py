import uuid
from pathlib import Path

from app.config import settings
from app.structural.adapter.storage_target import StorageTarget


class LocalStorageAdapter(StorageTarget):
    """
    Adapter: adapta el sistema de archivos local a la interfaz StorageTarget.
    Permite cambiar la implementación (S3, Azure) sin modificar el dominio.
    """

    def __init__(self, base_dir: str | None = None) -> None:
        self.base_dir = Path(base_dir or settings.upload_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def guardar(self, nombre_archivo: str, contenido: bytes) -> str:
        extension = Path(nombre_archivo).suffix
        ruta_relativa = f"{uuid.uuid4().hex}{extension}"
        destino = self.base_dir / ruta_relativa
        destino.write_bytes(contenido)
        return ruta_relativa

    async def obtener_ruta(self, ruta_interna: str) -> Path:
        ruta = self.base_dir / ruta_interna
        if not ruta.exists():
            raise FileNotFoundError(f"Archivo no encontrado: {ruta_interna}")
        return ruta

    async def eliminar(self, ruta_interna: str) -> None:
        ruta = self.base_dir / ruta_interna
        if ruta.exists():
            ruta.unlink()
