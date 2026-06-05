"""Inserta una sugerencia de prueba con 24.999 firmas."""

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

    documento = {
        "_id": ObjectId(),
        "titulo": "Prueba de bloqueo al alcanzar 25.000 firmas",
        "descripcion": (
            "Sugerencia de prueba insertada con 24.999 firmas para verificar que "
            "la firma número 25.000 cambia el estado a ELEGIBLE y bloquea firmas "
            "posteriores según las reglas de negocio de la plataforma Voz Ciudadana."
        ),
        "categoria": "Otros",
        "firmas": 24_999,
        "metaFirmas": settings.meta_firmas,
        "fechaPublicacion": ahora,
        "fechaVencimiento": ahora + timedelta(days=settings.plazo_dias),
        "estado": EstadoSugerencia.ACTIVA.value,
        "adjuntos": [],
    }

    resultado = await db["sugerencias"].insert_one(documento)
    sugerencia_id = str(resultado.inserted_id)

    print("Sugerencia de prueba creada")
    print(f"ID: {sugerencia_id}")
    print(f"Firmas: {documento['firmas']} / {documento['metaFirmas']}")
    print(f"Estado: {documento['estado']}")
    print(f"Detalle: http://localhost:5173/sugerencias/{sugerencia_id}")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
