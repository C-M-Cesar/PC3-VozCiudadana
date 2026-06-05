"""Inserta una sugerencia de prueba vencida (EXPIRADA)."""

import asyncio
from datetime import UTC, datetime, timedelta

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.constants import EstadoSugerencia


async def main() -> None:
    client = AsyncIOMotorClient(settings.mongo_uri)
    db = client[settings.mongo_db_name]
    ahora = datetime.now(UTC)

    fecha_publicacion = ahora - timedelta(days=100)
    fecha_vencimiento = ahora - timedelta(days=10)

    documento = {
        "_id": ObjectId(),
        "titulo": "Mejora de alumbrado público en avenida principal",
        "descripcion": (
            "Propuesta para renovar el sistema de alumbrado LED en la avenida principal "
            "del distrito, incluyendo postes dañados y zonas sin iluminación. Esta "
            "sugerencia de prueba fue insertada con plazo vencido para validar el estado "
            "EXPIRADA y el bloqueo de nuevas firmas en la plataforma Voz Ciudadana."
        ),
        "categoria": "Infraestructura",
        "firmas": 3_450,
        "metaFirmas": settings.meta_firmas,
        "fechaPublicacion": fecha_publicacion,
        "fechaVencimiento": fecha_vencimiento,
        "estado": EstadoSugerencia.EXPIRADA.value,
        "adjuntos": [],
    }

    resultado = await db["sugerencias"].insert_one(documento)
    sugerencia_id = str(resultado.inserted_id)

    print("Sugerencia vencida creada")
    print(f"ID: {sugerencia_id}")
    print(f"Firmas: {documento['firmas']} / {documento['metaFirmas']}")
    print(f"Estado: {documento['estado']}")
    print(f"Publicada: {fecha_publicacion.date()}")
    print(f"Venció: {fecha_vencimiento.date()}")
    print(f"Detalle: http://localhost:5173/sugerencias/{sugerencia_id}")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
