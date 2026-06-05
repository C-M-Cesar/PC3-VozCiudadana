export type EstadoSugerencia = 'ACTIVA' | 'ELEGIBLE' | 'EXPIRADA' | 'ENVIADA';

export interface Adjunto {
  id: string;
  nombre: string;
  tipo: string;
  tamano: number;
  url: string;
}

export interface Sugerencia {
  id: string;
  titulo: string;
  descripcion: string;
  categoria?: string;
  firmas: number;
  metaFirmas: number;
  fechaPublicacion: string;
  fechaVencimiento: string;
  estado: EstadoSugerencia;
  adjuntos: Adjunto[];
}

export interface SugerenciaResumen {
  id: string;
  titulo: string;
  descripcion: string;
  categoria?: string;
  firmas: number;
  metaFirmas: number;
  fechaPublicacion: string;
  fechaVencimiento: string;
  estado: EstadoSugerencia;
  cantidadAdjuntos: number;
}

export interface CrearSugerenciaPayload {
  titulo: string;
  descripcion: string;
  categoria?: string;
  archivos: File[];
}

export interface FiltrosSugerencia {
  busqueda?: string;
  estado?: EstadoSugerencia | 'TODAS';
}
