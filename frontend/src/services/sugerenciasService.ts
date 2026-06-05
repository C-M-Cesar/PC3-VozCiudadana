import type {
  CrearSugerenciaPayload,
  EstadoSugerencia,
  FiltrosSugerencia,
  Sugerencia,
  SugerenciaResumen,
} from '../types/sugerencia';
import { sugerenciasMock, toResumen } from '../mocks/sugerencias';
import { META_FIRMAS, PLAZO_DIAS } from '../constants';
import { apiRequest } from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

let mockStore = [...sugerenciasMock];

function filtrarMock(filtros: FiltrosSugerencia): SugerenciaResumen[] {
  let resultado = mockStore.map(toResumen);

  if (filtros.busqueda?.trim()) {
    const termino = filtros.busqueda.toLowerCase();
    resultado = resultado.filter(
      (s) =>
        s.titulo.toLowerCase().includes(termino) ||
        s.descripcion.toLowerCase().includes(termino) ||
        s.categoria?.toLowerCase().includes(termino),
    );
  }

  if (filtros.estado && filtros.estado !== 'TODAS') {
    resultado = resultado.filter((s) => s.estado === filtros.estado);
  }

  return resultado.sort(
    (a, b) =>
      new Date(b.fechaPublicacion).getTime() -
      new Date(a.fechaPublicacion).getTime(),
  );
}

export async function listarSugerencias(
  filtros: FiltrosSugerencia = {},
): Promise<SugerenciaResumen[]> {
  if (USE_MOCK) {
    await delay(300);
    return filtrarMock(filtros);
  }

  const params = new URLSearchParams();
  if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
  if (filtros.estado && filtros.estado !== 'TODAS') {
    params.set('estado', filtros.estado);
  }

  const query = params.toString();
  return apiRequest<SugerenciaResumen[]>(
    `/sugerencias${query ? `?${query}` : ''}`,
  );
}

export async function obtenerSugerencia(id: string): Promise<Sugerencia> {
  if (USE_MOCK) {
    await delay(250);
    const sugerencia = mockStore.find((s) => s.id === id);
    if (!sugerencia) throw new Error('Sugerencia no encontrada');
    return { ...sugerencia };
  }

  return apiRequest<Sugerencia>(`/sugerencias/${id}`);
}

export async function crearSugerencia(
  payload: CrearSugerenciaPayload,
): Promise<Sugerencia> {
  if (USE_MOCK) {
    await delay(500);
    const hoy = new Date();
    const vencimiento = new Date(hoy);
    vencimiento.setDate(vencimiento.getDate() + PLAZO_DIAS);

    const nueva: Sugerencia = {
      id: `sg-${Date.now()}`,
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      categoria: payload.categoria,
      firmas: 0,
      metaFirmas: META_FIRMAS,
      fechaPublicacion: hoy.toISOString(),
      fechaVencimiento: vencimiento.toISOString(),
      estado: 'ACTIVA',
      adjuntos: payload.archivos.map((archivo, index) => ({
        id: `adj-${Date.now()}-${index}`,
        nombre: archivo.name,
        tipo: archivo.type,
        tamano: archivo.size,
        url: '#',
      })),
    };

    mockStore = [nueva, ...mockStore];
    return nueva;
  }

  const formData = new FormData();
  formData.append('titulo', payload.titulo);
  formData.append('descripcion', payload.descripcion);
  if (payload.categoria) formData.append('categoria', payload.categoria);
  payload.archivos.forEach((archivo) => formData.append('archivos', archivo));

  return apiRequest<Sugerencia>('/sugerencias', {
    method: 'POST',
    body: formData,
  });
}

export async function firmarSugerencia(id: string): Promise<Sugerencia> {
  if (USE_MOCK) {
    await delay(400);
    const index = mockStore.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Sugerencia no encontrada');

    const sugerencia = mockStore[index];
    if (sugerencia.estado === 'EXPIRADA') {
      throw new Error('Esta sugerencia ha expirado y ya no acepta firmas');
    }
    if (sugerencia.estado === 'ELEGIBLE') {
      throw new Error('Esta sugerencia ya alcanzó la meta de firmas');
    }

    const firmas = sugerencia.firmas + 1;
    const estado: EstadoSugerencia =
      firmas >= sugerencia.metaFirmas ? 'ELEGIBLE' : 'ACTIVA';
    const actualizada: Sugerencia = { ...sugerencia, firmas, estado };
    mockStore[index] = actualizada;
    return actualizada;
  }

  return apiRequest<Sugerencia>(`/sugerencias/${id}/firmar`, {
    method: 'POST',
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
