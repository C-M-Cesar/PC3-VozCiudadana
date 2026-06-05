from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response

from app.dependencies import get_sugerencia_facade
from app.structural.facade.sugerencia_facade import SugerenciaFacade

router = APIRouter(prefix="/adjuntos", tags=["Adjuntos"])


@router.get("/{adjunto_id}/descargar")
async def descargar_adjunto(
    adjunto_id: str,
    facade: SugerenciaFacade = Depends(get_sugerencia_facade),
):
    try:
        contenido, media_type, nombre = await facade.descargar_adjunto(adjunto_id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return Response(
        content=contenido,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{nombre}"'},
    )
