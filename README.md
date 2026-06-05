# DesarrolloPC2 — Voz Ciudadana

Plataforma web de participación ciudadana donde los usuarios publican sugerencias, consultan propuestas y las apoyan con firmas.

## Alcance fase 1

- Publicar sugerencias con descripción y adjuntos
- Consultar listado y detalle de propuestas
- Firmar sugerencias activas (sin verificación de identidad)
- Vigencia de 90 días y meta de 25.000 firmas

## Estructura del proyecto

```
DesarrolloPC2/
├── frontend/     # React + TypeScript + Vite
└── backend/      # Python + FastAPI + MongoDB
```

## Inicio rápido

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # configurar MONGO_URI
python run.py
```

Documentación API: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_USE_MOCK=false
npm run dev
```

App: http://localhost:5173

## Patrones estructurales (backend)

- **Facade** — `SugerenciaFacade` coordina validación, persistencia y reglas de negocio
- **Proxy** — `AdjuntoProxy` carga archivos bajo demanda
- **Adapter** — `LocalStorageAdapter` desacopla el almacenamiento de adjuntos

Ver detalles en [backend/README.md](backend/README.md).
