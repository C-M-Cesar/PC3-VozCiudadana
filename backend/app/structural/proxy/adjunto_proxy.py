from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class AdjuntoMetadata:
    id: str
    nombre: str
    tipo: str
    tamano: int
    url: str


class AdjuntoSubject(ABC):
    """Interfaz común para el patrón Proxy (Subject)."""

    @abstractmethod
    def obtener_metadata(self) -> AdjuntoMetadata:
        """Retorna metadatos ligeros del adjunto."""

    @abstractmethod
    async def obtener_contenido(self) -> tuple[bytes, str, str]:
        """Retorna contenido, media type y nombre de descarga."""


class AdjuntoReal(AdjuntoSubject):
    """RealSubject: acceso directo al archivo físico."""

    def __init__(
        self,
        adjunto_id: str,
        nombre: str,
        tipo: str,
        tamano: int,
        ruta_interna: str,
        storage,
        base_url: str,
    ) -> None:
        self.adjunto_id = adjunto_id
        self.nombre = nombre
        self.tipo = tipo
        self.tamano = tamano
        self.ruta_interna = ruta_interna
        self.storage = storage
        self.base_url = base_url

    def obtener_metadata(self) -> AdjuntoMetadata:
        return AdjuntoMetadata(
            id=self.adjunto_id,
            nombre=self.nombre,
            tipo=self.tipo,
            tamano=self.tamano,
            url=f"{self.base_url}/adjuntos/{self.adjunto_id}/descargar",
        )

    async def obtener_contenido(self) -> tuple[bytes, str, str]:
        ruta = await self.storage.obtener_ruta(self.ruta_interna)
        contenido = ruta.read_bytes()
        return contenido, self.tipo, self.nombre


class AdjuntoProxy(AdjuntoSubject):
    """
    Virtual Proxy: expone metadatos sin cargar el archivo en memoria.
    Solo accede al disco cuando se solicita descargar el contenido.
    """

    def __init__(self, real_subject: AdjuntoReal) -> None:
        self._real = real_subject
        self._metadata: AdjuntoMetadata | None = None

    def obtener_metadata(self) -> AdjuntoMetadata:
        if self._metadata is None:
            self._metadata = self._real.obtener_metadata()
        return self._metadata

    async def obtener_contenido(self) -> tuple[bytes, str, str]:
        return await self._real.obtener_contenido()
