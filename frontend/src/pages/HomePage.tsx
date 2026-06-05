import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SearchFilter } from '../components/SearchFilter';
import { SugerenciaCard } from '../components/SugerenciaCard';
import { META_FIRMAS, PLAZO_DIAS } from '../constants';
import { listarSugerencias } from '../services/sugerenciasService';
import type { FiltrosSugerencia, SugerenciaResumen } from '../types/sugerencia';
import { formatearNumero } from '../utils/format';

export function HomePage() {
  const [filtros, setFiltros] = useState<FiltrosSugerencia>({ estado: 'TODAS' });
  const [sugerencias, setSugerencias] = useState<SugerenciaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const data = await listarSugerencias(filtros);
        if (!cancelado) setSugerencias(data);
      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar las sugerencias',
          );
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    const timeout = setTimeout(cargar, filtros.busqueda ? 300 : 0);
    return () => {
      cancelado = true;
      clearTimeout(timeout);
    };
  }, [filtros]);

  return (
    <div className="container page">
      <section className="hero">
        <div className="hero__content">
          <h1>Participa con tus ideas ciudadanas</h1>
          <p>
            Publica sugerencias, consulta propuestas de otros ciudadanos y apóyalas
            con tu firma. Cada propuesta tiene {PLAZO_DIAS} días para reunir{' '}
            {formatearNumero(META_FIRMAS)} firmas.
          </p>
          <Link to="/crear" className="btn btn--primary btn--lg">
            Crear una sugerencia
          </Link>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <span className="stat__value">{formatearNumero(META_FIRMAS)}</span>
            <span className="stat__label">Firmas meta</span>
          </div>
          <div className="stat">
            <span className="stat__value">{PLAZO_DIAS}</span>
            <span className="stat__label">Días de vigencia</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Sugerencias ciudadanas</h2>
          <p>Explora, filtra y firma las propuestas activas.</p>
        </div>

        <SearchFilter filtros={filtros} onChange={setFiltros} />

        {error && <AlertMessage type="error" message={error} />}

        {loading ? (
          <LoadingSpinner label="Cargando sugerencias..." />
        ) : sugerencias.length === 0 ? (
          <div className="empty-state">
            <h3>No hay sugerencias que coincidan</h3>
            <p>Prueba con otros filtros o crea la primera propuesta.</p>
            <Link to="/crear" className="btn btn--secondary">
              Crear sugerencia
            </Link>
          </div>
        ) : (
          <div className="grid">
            {sugerencias.map((sugerencia) => (
              <SugerenciaCard key={sugerencia.id} sugerencia={sugerencia} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
