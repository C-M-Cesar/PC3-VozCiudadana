from typing import Optional

from fastapi import UploadFile

from app.repositories.sugerencia_repository import SugerenciaRepository
from app.schemas.sugerencia import SugerenciaResumenResponse, SugerenciaResponse
from app.services.estado_service import EstadoSugerenciaService
from app.services.validacion_service import ValidacionSugerenciaService
from app.structural.adapter.local_storage_adapter import LocalStorageAdapter
from app.structural.proxy.adjunto_proxy import AdjuntoProxy, AdjuntoReal


class SugerenciaFacade:
    """
    Facade: interfaz unificada que coordina validación, almacenamiento,
    repositorio y reglas de negocio para las operaciones de sugerencias.
    """

    def __init__(
        self,
        repository: SugerenciaRepository,
        storage: LocalStorageAdapter,
        estado_service: EstadoSugerenciaService,
        validacion_service: ValidacionSugerenciaService,
        api_base_url: str,
    ) -> None:
        self.repository = repository
        self.storage = storage
        self.estado_service = estado_service
        self.validacion_service = validacion_service
        self.api_base_url = api_base_url

    async def listar_sugerencias(
        self,
        busqueda: Optional[str] = None,
        estado: Optional[str] = None,
    ) -> list[SugerenciaResumenResponse]:
        await self.estado_service.sincronizar_estados_vencidos()
        documentos = await self.repository.listar(busqueda=busqueda, estado=estado)
        return [self._to_resumen(doc) for doc in documentos]

    async def obtener_sugerencia(self, sugerencia_id: str) -> SugerenciaResponse:
        await self.estado_service.sincronizar_estados_vencidos()
        documento = await self.repository.buscar_por_id(sugerencia_id)
        if not documento:
            raise LookupError("Sugerencia no encontrada")
        return self._to_detalle(documento)

    async def crear_sugerencia(
        self,
        titulo: str,
        descripcion: str,
        categoria: Optional[str],
        archivos: list[UploadFile],
    ) -> SugerenciaResponse:
        await self.validacion_service.validar_creacion(
            titulo, descripcion, categoria, archivos
        )

        adjuntos_db = []
        for archivo in archivos:
            if not archivo.filename:
                continue
            contenido = await archivo.read()
            ruta_interna = await self.storage.guardar(archivo.filename, contenido)
            adjunto_id = self.repository.nuevo_adjunto_id()
            adjuntos_db.append(
                {
                    "id": adjunto_id,
                    "nombre": archivo.filename,
                    "tipo": archivo.content_type or "application/octet-stream",
                    "tamano": len(contenido),
                    "rutaInterna": ruta_interna,
                }
            )

        documento = await self.repository.crear(
            {
                "titulo": titulo.strip(),
                "descripcion": descripcion.strip(),
                "categoria": categoria or None,
                "adjuntos": adjuntos_db,
            }
        )
        return self._to_detalle(documento)

    async def firmar_sugerencia(self, sugerencia_id: str) -> SugerenciaResponse:
        await self.estado_service.sincronizar_estados_vencidos()
        documento = await self.repository.buscar_por_id(sugerencia_id)
        if not documento:
            raise LookupError("Sugerencia no encontrada")

        self.estado_service.puede_firmar(documento)
        await self.repository.registrar_firma(sugerencia_id)

        firmas = documento["firmas"] + 1
        estado = self.estado_service.calcular_estado_tras_firma(
            firmas, documento["metaFirmas"]
        )
        actualizado = await self.repository.actualizar(
            sugerencia_id,
            {"firmas": firmas, "estado": estado},
        )
        return self._to_detalle(actualizado)

    async def descargar_adjunto(self, adjunto_id: str) -> tuple[bytes, str, str]:
        resultado = await self.repository.buscar_adjunto(adjunto_id)
        if not resultado:
            raise LookupError("Adjunto no encontrado")

        _, adjunto = resultado
        proxy = self._crear_proxy(adjunto)
        return await proxy.obtener_contenido()

    def _crear_proxy(self, adjunto: dict) -> AdjuntoProxy:
        real = AdjuntoReal(
            adjunto_id=str(adjunto["id"]),
            nombre=adjunto["nombre"],
            tipo=adjunto["tipo"],
            tamano=adjunto["tamano"],
            ruta_interna=adjunto["rutaInterna"],
            storage=self.storage,
            base_url=self.api_base_url,
        )
        return AdjuntoProxy(real)

    def _to_resumen(self, documento: dict) -> SugerenciaResumenResponse:
        return SugerenciaResumenResponse(
            id=documento["id"],
            titulo=documento["titulo"],
            descripcion=documento["descripcion"],
            categoria=documento.get("categoria"),
            firmas=documento["firmas"],
            metaFirmas=documento["metaFirmas"],
            fechaPublicacion=documento["fechaPublicacion"],
            fechaVencimiento=documento["fechaVencimiento"],
            estado=documento["estado"],
            cantidadAdjuntos=len(documento.get("adjuntos", [])),
        )

    def _to_detalle(self, documento: dict) -> SugerenciaResponse:
        adjuntos = [
            self._crear_proxy(adjunto).obtener_metadata().__dict__
            for adjunto in documento.get("adjuntos", [])
        ]
        return SugerenciaResponse(
            id=documento["id"],
            titulo=documento["titulo"],
            descripcion=documento["descripcion"],
            categoria=documento.get("categoria"),
            firmas=documento["firmas"],
            metaFirmas=documento["metaFirmas"],
            fechaPublicacion=documento["fechaPublicacion"],
            fechaVencimiento=documento["fechaVencimiento"],
            estado=documento["estado"],
            adjuntos=adjuntos,
        )
