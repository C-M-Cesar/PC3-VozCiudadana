import type { EstadoSugerencia } from '../types/sugerencia';

const ESTADO_CONFIG: Record<
  EstadoSugerencia,
  { label: string; className: string }
> = {
  ACTIVA: { label: 'Activa', className: 'badge--activa' },
  ELEGIBLE: { label: 'Meta alcanzada', className: 'badge--elegible' },
  EXPIRADA: { label: 'Expirada', className: 'badge--expirada' },
  ENVIADA: { label: 'Enviada', className: 'badge--enviada' },
};

interface StatusBadgeProps {
  estado: EstadoSugerencia;
}

export function StatusBadge({ estado }: StatusBadgeProps) {
  const config = ESTADO_CONFIG[estado];
  return (
    <span className={`badge ${config.className}`}>{config.label}</span>
  );
}
