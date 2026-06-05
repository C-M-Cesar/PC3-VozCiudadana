import { Link } from 'react-router-dom';
import type { SugerenciaResumen } from '../types/sugerencia';
import { diasRestantes, formatearFecha } from '../utils/dates';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

interface SugerenciaCardProps {
  sugerencia: SugerenciaResumen;
}

export function SugerenciaCard({ sugerencia }: SugerenciaCardProps) {
  const dias = diasRestantes(sugerencia.fechaVencimiento);

  return (
    <article className="card">
      <div className="card__header">
        <div className="card__meta">
          {sugerencia.categoria && (
            <span className="card__category">{sugerencia.categoria}</span>
          )}
          <StatusBadge estado={sugerencia.estado} />
        </div>
        <h2 className="card__title">
          <Link to={`/sugerencias/${sugerencia.id}`}>{sugerencia.titulo}</Link>
        </h2>
      </div>

      <p className="card__description">
        {sugerencia.descripcion.length > 180
          ? `${sugerencia.descripcion.slice(0, 180)}...`
          : sugerencia.descripcion}
      </p>

      <ProgressBar
        firmas={sugerencia.firmas}
        metaFirmas={sugerencia.metaFirmas}
        compact
      />

      <div className="card__footer">
        <span>
          Publicada: {formatearFecha(sugerencia.fechaPublicacion)}
        </span>
        <span>
          {sugerencia.estado === 'EXPIRADA'
            ? 'Plazo vencido'
            : `${dias} día${dias !== 1 ? 's' : ''} restante${dias !== 1 ? 's' : ''}`}
        </span>
        {sugerencia.cantidadAdjuntos > 0 && (
          <span>{sugerencia.cantidadAdjuntos} adjunto(s)</span>
        )}
      </div>

      <Link
        to={`/sugerencias/${sugerencia.id}`}
        className="card__link"
      >
        Ver detalle y firmar →
      </Link>
    </article>
  );
}
