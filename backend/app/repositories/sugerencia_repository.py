from datetime import UTC, datetime, timedelta
from typing import Any, Optional
from uuid import uuid4

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import settings
from app.constants import EstadoSugerencia


class SugerenciaRepository:
    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.collection = db["sugerencias"]
        self.firmas_collection = db["firmas"]

    @staticmethod
    def _ensure_utc(value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value.astimezone(UTC)

    def _serialize(self, doc: dict[str, Any]) -> dict[str, Any]:
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        doc["metaFirmas"] = doc.get("metaFirmas", settings.meta_firmas)
        doc["fechaPublicacion"] = self._ensure_utc(doc["fechaPublicacion"]).isoformat()
        doc["fechaVencimiento"] = self._ensure_utc(doc["fechaVencimiento"]).isoformat()
        for adjunto in doc.get("adjuntos", []):
            adjunto["id"] = str(adjunto["id"])
        return doc

    async def crear(self, data: dict[str, Any]) -> dict[str, Any]:
        ahora = datetime.now(UTC)
        documento = {
            "_id": ObjectId(),
            "titulo": data["titulo"],
            "descripcion": data["descripcion"],
            "categoria": data.get("categoria"),
            "firmas": 0,
            "metaFirmas": settings.meta_firmas,
            "fechaPublicacion": ahora,
            "fechaVencimiento": ahora + timedelta(days=settings.plazo_dias),
            "estado": EstadoSugerencia.ACTIVA.value,
            "adjuntos": data.get("adjuntos", []),
        }
        await self.collection.insert_one(documento)
        return self._serialize(documento)

    async def buscar_por_id(self, sugerencia_id: str) -> Optional[dict[str, Any]]:
        if not ObjectId.is_valid(sugerencia_id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(sugerencia_id)})
        return self._serialize(doc) if doc else None

    async def listar(
        self,
        busqueda: Optional[str] = None,
        estado: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        filtro: dict[str, Any] = {}

        if estado and estado != "TODAS":
            filtro["estado"] = estado

        if busqueda:
            regex = {"$regex": busqueda, "$options": "i"}
            filtro["$or"] = [
                {"titulo": regex},
                {"descripcion": regex},
                {"categoria": regex},
            ]

        cursor = self.collection.find(filtro).sort("fechaPublicacion", -1)
        return [self._serialize(doc) async for doc in cursor]

    async def actualizar(self, sugerencia_id: str, cambios: dict[str, Any]) -> Optional[dict[str, Any]]:
        if not ObjectId.is_valid(sugerencia_id):
            return None
        await self.collection.update_one(
            {"_id": ObjectId(sugerencia_id)},
            {"$set": cambios},
        )
        return await self.buscar_por_id(sugerencia_id)

    async def marcar_expiradas(self) -> int:
        ahora = datetime.now(UTC)
        resultado = await self.collection.update_many(
            {
                "estado": EstadoSugerencia.ACTIVA.value,
                "fechaVencimiento": {"$lt": ahora},
            },
            {"$set": {"estado": EstadoSugerencia.EXPIRADA.value}},
        )
        return resultado.modified_count

    async def registrar_firma(self, sugerencia_id: str) -> None:
        await self.firmas_collection.insert_one(
            {
                "_id": ObjectId(),
                "sugerenciaId": sugerencia_id,
                "fechaFirma": datetime.now(UTC),
            }
        )

    async def buscar_adjunto(self, adjunto_id: str) -> Optional[tuple[dict[str, Any], dict[str, Any]]]:
        cursor = self.collection.find({"adjuntos.id": adjunto_id})
        async for sugerencia in cursor:
            for adjunto in sugerencia.get("adjuntos", []):
                if str(adjunto["id"]) == adjunto_id:
                    return sugerencia, adjunto
        return None

    @staticmethod
    def nuevo_adjunto_id() -> str:
        return uuid4().hex
