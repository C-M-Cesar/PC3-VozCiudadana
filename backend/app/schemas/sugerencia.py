from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.constants import EstadoSugerencia


class AdjuntoResponse(BaseModel):
    id: str
    nombre: str
    tipo: str
    tamano: int
    url: str


class SugerenciaResponse(BaseModel):
    id: str
    titulo: str
    descripcion: str
    categoria: Optional[str] = None
    firmas: int
    metaFirmas: int
    fechaPublicacion: str
    fechaVencimiento: str
    estado: EstadoSugerencia
    adjuntos: list[AdjuntoResponse] = Field(default_factory=list)


class SugerenciaResumenResponse(BaseModel):
    id: str
    titulo: str
    descripcion: str
    categoria: Optional[str] = None
    firmas: int
    metaFirmas: int
    fechaPublicacion: str
    fechaVencimiento: str
    estado: EstadoSugerencia
    cantidadAdjuntos: int


class MensajeResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str
