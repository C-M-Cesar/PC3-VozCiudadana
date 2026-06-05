export const META_FIRMAS = 25_000;
export const PLAZO_DIAS = 90;

export const CATEGORIAS = [
  'Infraestructura',
  'Medio ambiente',
  'Salud',
  'Educación',
  'Seguridad',
  'Transporte',
  'Otros',
] as const;

export const ESTADOS_FILTRO = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'ACTIVA', label: 'Activas' },
  { value: 'ELEGIBLE', label: 'Meta alcanzada' },
  { value: 'EXPIRADA', label: 'Expiradas' },
] as const;

export const TIPOS_ARCHIVO_PERMITIDOS = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const EXTENSIONES_PERMITIDAS = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx';
export const MAX_ARCHIVOS = 5;
export const MAX_TAMANO_ARCHIVO_MB = 10;
