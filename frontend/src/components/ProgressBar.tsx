import { formatearNumero, calcularPorcentaje } from '../utils/format';

interface ProgressBarProps {
  firmas: number;
  metaFirmas: number;
  compact?: boolean;
}

export function ProgressBar({ firmas, metaFirmas, compact = false }: ProgressBarProps) {
  const porcentaje = calcularPorcentaje(firmas, metaFirmas);

  return (
    <div className={`progress ${compact ? 'progress--compact' : ''}`}>
      <div className="progress__header">
        <span className="progress__label">
          {formatearNumero(firmas)} / {formatearNumero(metaFirmas)} firmas
        </span>
        <span className="progress__percent">{porcentaje.toFixed(1)}%</span>
      </div>
      <div className="progress__track" role="progressbar" aria-valuenow={firmas} aria-valuemin={0} aria-valuemax={metaFirmas}>
        <div
          className="progress__fill"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}
