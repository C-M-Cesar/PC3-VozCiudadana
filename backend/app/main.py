from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import close_mongo_connection, connect_to_mongo, get_database
from app.repositories.sugerencia_repository import SugerenciaRepository
from app.routes.adjuntos import router as adjuntos_router
from app.routes.sugerencias import router as sugerencias_router
from app.services.estado_service import EstadoSugerenciaService


scheduler = AsyncIOScheduler()


async def actualizar_sugerencias_vencidas() -> None:
    db = get_database()
    repository = SugerenciaRepository(db)
    service = EstadoSugerenciaService(repository)
    await service.sincronizar_estados_vencidos()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    scheduler.add_job(
        actualizar_sugerencias_vencidas,
        trigger="cron",
        hour=0,
        minute=0,
        id="actualizar_vencidas",
        replace_existing=True,
    )
    scheduler.start()
    await actualizar_sugerencias_vencidas()
    yield
    scheduler.shutdown(wait=False)
    await close_mongo_connection()


app = FastAPI(
    title="Voz Ciudadana API",
    description="Backend de sugerencias ciudadanas con patrones estructurales",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sugerencias_router, prefix=settings.api_prefix)
app.include_router(adjuntos_router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    return {
        "nombre": "Voz Ciudadana API",
        "version": "1.0.0",
        "documentacion": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
