from fastapi import UploadFile

from app.config import settings
from app.constants import CATEGORIAS_PERMITIDAS, TIPOS_ARCHIVO_PERMITIDOS


class ValidacionSugerenciaService:
    async def validar_creacion(
        self,
        titulo: str,
        descripcion: str,
        categoria: str | None,
        archivos: list[UploadFile],
    ) -> None:
        titulo_limpio = titulo.strip()
        descripcion_limpia = descripcion.strip()

        if len(titulo_limpio) < 10:
            raise ValueError("El título debe tener al menos 10 caracteres")
        if len(descripcion_limpia) < 50:
            raise ValueError("La descripción debe tener al menos 50 caracteres")
        if len(titulo_limpio) > 150:
            raise ValueError("El título no puede superar 150 caracteres")
        if len(descripcion_limpia) > 5000:
            raise ValueError("La descripción no puede superar 5000 caracteres")

        if categoria and categoria not in CATEGORIAS_PERMITIDAS:
            raise ValueError("La categoría seleccionada no es válida")

        if len(archivos) > settings.max_archivos:
            raise ValueError(f"Máximo {settings.max_archivos} archivos permitidos")

        max_bytes = settings.max_tamano_archivo_mb * 1024 * 1024
        for archivo in archivos:
            if not archivo.filename:
                raise ValueError("Uno de los archivos no tiene nombre válido")
            contenido = await archivo.read()
            await archivo.seek(0)
            if archivo.content_type not in TIPOS_ARCHIVO_PERMITIDOS:
                raise ValueError(f"Formato no permitido: {archivo.filename}")
            if len(contenido) > max_bytes:
                raise ValueError(
                    f"{archivo.filename} supera el límite de "
                    f"{settings.max_tamano_archivo_mb} MB"
                )
