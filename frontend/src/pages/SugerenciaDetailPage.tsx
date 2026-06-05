import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';
import { AttachmentList } from '../components/AttachmentList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import {
  firmarSugerencia,
  obtenerSugerencia,
} from '../services/sugerenciasService';
import type { Sugerencia } from '../types/sugerencia';
import { diasRestantes, formatearFecha } from '../utils/dates';

export function SugerenciaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sugerencia, setSugerencia] = useState<Sugerencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [firmando, setFirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const sugerenciaId = id;

    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerSugerencia(sugerenciaId);
        setSugerencia(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la sugerencia',
        );
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [id]);

  async function handleFirmar() {
    if (!id || !sugerencia) return;

    setFirmando(true);
    setMensaje(null);
    setError(null);

    try {
      const actualizada = await firmarSugerencia(id);
      setSugerencia(actualizada);
      setMensaje(
        actualizada.estado === 'ELEGIBLE'
          ? '¡Gracias! Tu firma ayudó a alcanzar la meta de 25.000 firmas.'
          : '¡Gracias! Tu firma fue registrada correctamente.',
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo registrar la firma',
      );
    } finally {
      setFirmando(false);
    }
  }

  const puedeFirmar =
    sugerencia?.estado === 'ACTIVA' && diasRestantes(sugerencia.fechaVencimiento) > 0;

  if (loading) {
    return (
      <div className="container page">
        <LoadingSpinner label="Cargando sugerencia..." />
      </div>
    );
  }

  if (error && !sugerencia) {
    return (
      <div className="container page">
        <AlertMessage type="error" message={error} />
        <Link to="/" className="btn btn--secondary">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!sugerencia) return null;

  const dias = diasRestantes(sugerencia.fechaVencimiento);

  return (
    <div className="container page">
      <Link to="/" className="back-link">
        ← Volver al listado
      </Link>

      <article className="detail">
        <header className="detail__header">
          <div className="detail__meta">
            {sugerencia.categoria && (
              <span className="card__category">{sugerencia.categoria}</span>
            )}
            <StatusBadge estado={sugerencia.estado} />
            <span className="detail__id">ID: {sugerencia.id}</span>
          </div>
          <h1>{sugerencia.titulo}</h1>
          <div className="detail__dates">
            <span>Publicada: {formatearFecha(sugerencia.fechaPublicacion)}</span>
            <span>Vence: {formatearFecha(sugerencia.fechaVencimiento)}</span>
            <span>
              {sugerencia.estado === 'EXPIRADA'
                ? 'Plazo vencido'
                : `${dias} día${dias !== 1 ? 's' : ''} restante${dias !== 1 ? 's' : ''}`}
            </span>
          </div>
        </header>

        <section className="detail__section">
          <h2>Descripción</h2>
          <p className="detail__description">{sugerencia.descripcion}</p>
        </section>

        <section className="detail__section">
          <h2>Progreso de firmas</h2>
          <ProgressBar
            firmas={sugerencia.firmas}
            metaFirmas={sugerencia.metaFirmas}
          />
        </section>

        <section className="detail__section">
          <h2>Archivos adjuntos</h2>
          <AttachmentList adjuntos={sugerencia.adjuntos} />
        </section>

        {mensaje && <AlertMessage type="success" message={mensaje} />}
        {error && <AlertMessage type="error" message={error} />}

        <section className="detail__actions">
          {puedeFirmar ? (
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={handleFirmar}
              disabled={firmando}
            >
              {firmando ? 'Registrando firma...' : 'Firmar esta sugerencia'}
            </button>
          ) : (
            <AlertMessage
              type="info"
              message={
                sugerencia.estado === 'ELEGIBLE'
                  ? 'Esta sugerencia ya alcanzó las 25.000 firmas requeridas.'
                  : 'Esta sugerencia ya no acepta firmas porque expiró.'
              }
            />
          )}
        </section>
      </article>
    </div>
  );
}
