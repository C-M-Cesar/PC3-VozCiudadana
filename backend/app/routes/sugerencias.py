from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from app.dependencies import get_sugerencia_facade
from app.schemas.sugerencia import SugerenciaResumenResponse, SugerenciaResponse
from app.structural.facade.sugerencia_facade import SugerenciaFacade

router = APIRouter(prefix="/sugerencias", tags=["Sugerencias"])


@router.get("", response_model=list[SugerenciaResumenResponse])
async def listar_sugerencias(
    busqueda: Optional[str] = None,
    estado: Optional[str] = None,
    facade: SugerenciaFacade = Depends(get_sugerencia_facade),
):
    return await facade.listar_sugerencias(busqueda=busqueda, estado=estado)


@router.get("/{sugerencia_id}", response_model=SugerenciaResponse)
async def obtener_sugerencia(
    sugerencia_id: str,
    facade: SugerenciaFacade = Depends(get_sugerencia_facade),
):
    try:
        return await facade.obtener_sugerencia(sugerencia_id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("", response_model=SugerenciaResponse, status_code=201)
async def crear_sugerencia(
    titulo: str = Form(...),
    descripcion: str = Form(...),
    categoria: Optional[str] = Form(None),
    archivos: list[UploadFile] = File(default=[]),
    facade: SugerenciaFacade = Depends(get_sugerencia_facade),
):
    try:
        return await facade.crear_sugerencia(titulo, descripcion, categoria, archivos)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{sugerencia_id}/firmar", response_model=SugerenciaResponse)
async def firmar_sugerencia(
    sugerencia_id: str,
    facade: SugerenciaFacade = Depends(get_sugerencia_facade),
):
    try:
        return await facade.firmar_sugerencia(sugerencia_id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
