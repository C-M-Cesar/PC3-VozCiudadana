import { META_FIRMAS } from '../constants';
import type { Sugerencia, SugerenciaResumen } from '../types/sugerencia';

const hoy = new Date();

function fechaRelativa(dias: number): string {
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString();
}

export const sugerenciasMock: Sugerencia[] = [
  {
    id: 'sg-001',
    titulo: 'Ampliar ciclovías en el centro histórico',
    descripcion:
      'Propuesta para conectar las ciclovías existentes y crear un corredor seguro de 8 km que permita desplazarse en bicicleta desde los barrios periféricos hasta el centro. Incluye señalización, iluminación LED y estaciones de mantenimiento.',
    categoria: 'Transporte',
    firmas: 18_420,
    metaFirmas: META_FIRMAS,
    fechaPublicacion: fechaRelativa(-45),
    fechaVencimiento: fechaRelativa(45),
    estado: 'ACTIVA',
    adjuntos: [
      {
        id: 'adj-1',
        nombre: 'mapa-ciclovias.pdf',
        tipo: 'application/pdf',
        tamano: 2_450_000,
        url: '#',
      },
      {
        id: 'adj-2',
        nombre: 'render-propuesta.jpg',
        tipo: 'image/jpeg',
        tamano: 890_000,
        url: '#',
      },
    ],
  },
  {
    id: 'sg-002',
    titulo: 'Programa de reforestación urbana',
    descripcion:
      'Iniciativa para plantar 50.000 árboles nativos en parques, plazas y avenidas principales durante los próximos tres años, con participación comunitaria y monitoreo de supervivencia.',
    categoria: 'Medio ambiente',
    firmas: 25_000,
    metaFirmas: META_FIRMAS,
    fechaPublicacion: fechaRelativa(-70),
    fechaVencimiento: fechaRelativa(20),
    estado: 'ELEGIBLE',
    adjuntos: [
      {
        id: 'adj-3',
        nombre: 'plan-reforestacion.pdf',
        tipo: 'application/pdf',
        tamano: 1_200_000,
        url: '#',
      },
    ],
  },
  {
    id: 'sg-003',
    titulo: 'Centros de salud móviles en zonas rurales',
    descripcion:
      'Despliegue de unidades médicas móviles con atención primaria, vacunación y telemedicina para comunidades con acceso limitado a centros de salud fijos.',
    categoria: 'Salud',
    firmas: 9_870,
    metaFirmas: META_FIRMAS,
    fechaPublicacion: fechaRelativa(-82),
    fechaVencimiento: fechaRelativa(8),
    estado: 'ACTIVA',
    adjuntos: [],
  },
  {
    id: 'sg-004',
    titulo: 'Bibliotecas digitales en escuelas públicas',
    descripcion:
      'Equipar cada escuela pública con acceso a biblioteca digital, tablets educativas y conectividad para reducir la brecha digital en estudiantes de bajos recursos.',
    categoria: 'Educación',
    firmas: 4_200,
    metaFirmas: META_FIRMAS,
    fechaPublicacion: fechaRelativa(-95),
    fechaVencimiento: fechaRelativa(-5),
    estado: 'EXPIRADA',
    adjuntos: [
      {
        id: 'adj-4',
        nombre: 'presupuesto-estimado.docx',
        tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        tamano: 340_000,
        url: '#',
      },
    ],
  },
];

export function toResumen(sugerencia: Sugerencia): SugerenciaResumen {
  return {
    id: sugerencia.id,
    titulo: sugerencia.titulo,
    descripcion: sugerencia.descripcion,
    categoria: sugerencia.categoria,
    firmas: sugerencia.firmas,
    metaFirmas: sugerencia.metaFirmas,
    fechaPublicacion: sugerencia.fechaPublicacion,
    fechaVencimiento: sugerencia.fechaVencimiento,
    estado: sugerencia.estado,
    cantidadAdjuntos: sugerencia.adjuntos.length,
  };
}
