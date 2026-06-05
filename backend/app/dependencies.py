from functools import lru_cache

from app.config import settings
from app.database import get_database
from app.repositories.sugerencia_repository import SugerenciaRepository
from app.services.estado_service import EstadoSugerenciaService
from app.services.validacion_service import ValidacionSugerenciaService
from app.structural.adapter.local_storage_adapter import LocalStorageAdapter
from app.structural.facade.sugerencia_facade import SugerenciaFacade


@lru_cache
def get_storage_adapter() -> LocalStorageAdapter:
    return LocalStorageAdapter()


def get_sugerencia_facade() -> SugerenciaFacade:
    db = get_database()
    repository = SugerenciaRepository(db)
    storage = get_storage_adapter()
    estado_service = EstadoSugerenciaService(repository)
    validacion_service = ValidacionSugerenciaService()
    api_base_url = settings.api_public_url

    return SugerenciaFacade(
        repository=repository,
        storage=storage,
        estado_service=estado_service,
        validacion_service=validacion_service,
        api_base_url=api_base_url,
    )
