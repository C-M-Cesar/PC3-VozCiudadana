from enum import StrEnum


class EstadoSugerencia(StrEnum):
    ACTIVA = "ACTIVA"
    ELEGIBLE = "ELEGIBLE"
    EXPIRADA = "EXPIRADA"
    ENVIADA = "ENVIADA"


CATEGORIAS_PERMITIDAS = {
    "Infraestructura",
    "Medio ambiente",
    "Salud",
    "Educación",
    "Seguridad",
    "Transporte",
    "Otros",
}

TIPOS_ARCHIVO_PERMITIDOS = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
