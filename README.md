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
├── frontend/     # React + TypeScript + Vite (implementado)
└── backend/      # Python + MongoDB (pendiente)
```

## Frontend

Ver [frontend/README.md](frontend/README.md).

```bash
cd frontend && npm install && npm run dev
```

## Backend (próximo paso)

- Lenguaje: Python (FastAPI recomendado)
- Base de datos: MongoDB
- Endpoints REST compatibles con el frontend
