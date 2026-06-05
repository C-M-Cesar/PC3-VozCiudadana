import type { Adjunto } from '../types/sugerencia';
import { formatearTamano } from '../utils/format';

interface AttachmentListProps {
  adjuntos: Adjunto[];
}

function iconoTipo(tipo: string): string {
  if (tipo.startsWith('image/')) return '🖼️';
  if (tipo === 'application/pdf') return '📄';
  return '📎';
}

export function AttachmentList({ adjuntos }: AttachmentListProps) {
  if (adjuntos.length === 0) {
    return (
      <p className="attachments__empty">Esta sugerencia no tiene archivos adjuntos.</p>
    );
  }

  return (
    <ul className="attachments">
      {adjuntos.map((adjunto) => (
        <li key={adjunto.id} className="attachment">
          <span className="attachment__icon" aria-hidden="true">
            {iconoTipo(adjunto.tipo)}
          </span>
          <div className="attachment__info">
            <span className="attachment__name">{adjunto.nombre}</span>
            <span className="attachment__size">
              {formatearTamano(adjunto.tamano)}
            </span>
          </div>
          <a
            href={adjunto.url}
            className="btn btn--ghost btn--sm"
            download
            onClick={(e) => {
              if (adjunto.url === '#') e.preventDefault();
            }}
          >
            Descargar
          </a>
        </li>
      ))}
    </ul>
  );
}
