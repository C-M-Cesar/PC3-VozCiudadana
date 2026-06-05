# Voz Ciudadana — Frontend

Interfaz web para la plataforma de sugerencias ciudadanas. Permite publicar propuestas, consultarlas, ver adjuntos y registrar firmas.

## Stack

- React 19 + TypeScript
- Vite
- React Router

## Inicio rápido

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Variables de entorno

Copia `.env.example` a `.env`:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend Python | `http://localhost:8000/api` |
| `VITE_USE_MOCK` | Usar datos simulados sin backend | `true` |

Cuando el backend esté listo, cambia `VITE_USE_MOCK=false`.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Listado de sugerencias con búsqueda y filtros |
| `/crear` | Formulario para publicar una nueva sugerencia |
| `/sugerencias/:id` | Detalle, adjuntos y botón de firma |

## API esperada (backend Python)

El servicio `sugerenciasService.ts` consume estos endpoints:

```
GET    /api/sugerencias?busqueda=&estado=
GET    /api/sugerencias/{id}
POST   /api/sugerencias          (multipart/form-data)
POST   /api/sugerencias/{id}/firmar
```

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa del build
```
