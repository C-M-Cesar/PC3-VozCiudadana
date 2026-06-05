from datetime import UTC, datetime

from app.constants import EstadoSugerencia
from app.repositories.sugerencia_repository import SugerenciaRepository


class EstadoSugerenciaService:
    """Servicio de reglas de negocio del ciclo de vida."""

    def __init__(self, repository: SugerenciaRepository) -> None:
        self.repository = repository

    async def sincronizar_estados_vencidos(self) -> int:
        return await self.repository.marcar_expiradas()

    def puede_firmar(self, sugerencia: dict) -> None:
        estado = sugerencia["estado"]
        vencimiento = datetime.fromisoformat(sugerencia["fechaVencimiento"])
        if vencimiento.tzinfo is None:
            vencimiento = vencimiento.replace(tzinfo=UTC)

        if estado == EstadoSugerencia.EXPIRADA.value:
            raise ValueError("Esta sugerencia ha expirado y ya no acepta firmas")
        if estado == EstadoSugerencia.ELEGIBLE.value:
            raise ValueError("Esta sugerencia ya alcanzó la meta de firmas")
        if estado == EstadoSugerencia.ENVIADA.value:
            raise ValueError("Esta sugerencia ya fue enviada a la entidad reguladora")
        if vencimiento < datetime.now(UTC):
            raise ValueError("Esta sugerencia ha expirado y ya no acepta firmas")

    def calcular_estado_tras_firma(self, firmas: int, meta_firmas: int) -> str:
        if firmas >= meta_firmas:
            return EstadoSugerencia.ELEGIBLE.value
        return EstadoSugerencia.ACTIVA.value
