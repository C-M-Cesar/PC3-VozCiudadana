# Voz Ciudadana — Backend

API REST en Python (FastAPI) con MongoDB Atlas para la plataforma de sugerencias ciudadanas.

## Patrones estructurales implementados

| Patrón | Ubicación | Propósito |
|---|---|---|
| **Facade** | `app/structural/facade/sugerencia_facade.py` | Orquesta crear, listar, firmar y descargar adjuntos |
| **Proxy** | `app/structural/proxy/adjunto_proxy.py` | Carga perezosa de archivos adjuntos |
| **Adapter** | `app/structural/adapter/local_storage_adapter.py` | Abstrae el almacenamiento de archivos |

## Requisitos funcionales cubiertos

- RF-01: Creación de sugerencias con adjuntos, fechas y contador inicial
- RF-02: Listado, detalle, búsqueda, filtros y adjuntos bajo demanda
- RF-03: Registro de firmas sin verificación de identidad
- RF-04: Estados `ACTIVA`, `ELEGIBLE`, `EXPIRADA`, `ENVIADA`
- RF-05: Meta de 25.000 firmas y plazo de 90 días
- RF-04.4: Tarea programada diaria para marcar sugerencias vencidas

## Inicio rápido

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # configurar MONGO_URI
python run.py
```

API: [http://localhost:8000/docs](http://localhost:8000/docs)

## Endpoints

```
GET    /api/sugerencias?busqueda=&estado=
GET    /api/sugerencias/{id}
POST   /api/sugerencias
POST   /api/sugerencias/{id}/firmar
GET    /api/adjuntos/{id}/descargar
GET    /health
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `MONGO_URI` | Cadena de conexión MongoDB Atlas |
| `MONGO_DB_NAME` | Nombre de la base de datos |
| `API_PUBLIC_URL` | URL pública para enlaces de descarga |
| `CORS_ORIGINS` | Orígenes permitidos del frontend |
| `UPLOAD_DIR` | Carpeta local de adjuntos |

## Conectar con el frontend

En `frontend/.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8000/api
```
