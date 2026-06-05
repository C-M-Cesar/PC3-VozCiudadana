import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';
import {
  CATEGORIAS,
  EXTENSIONES_PERMITIDAS,
  MAX_ARCHIVOS,
  MAX_TAMANO_ARCHIVO_MB,
  TIPOS_ARCHIVO_PERMITIDOS,
} from '../constants';
import { crearSugerencia } from '../services/sugerenciasService';
import { formatearTamano } from '../utils/format';

export function CrearSugerenciaPage() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validarArchivos(files: File[]): string | null {
    if (files.length > MAX_ARCHIVOS) {
      return `Máximo ${MAX_ARCHIVOS} archivos permitidos`;
    }

    const maxBytes = MAX_TAMANO_ARCHIVO_MB * 1024 * 1024;
    for (const file of files) {
      if (!TIPOS_ARCHIVO_PERMITIDOS.includes(file.type)) {
        return `Formato no permitido: ${file.name}`;
      }
      if (file.size > maxBytes) {
        return `${file.name} supera el límite de ${MAX_TAMANO_ARCHIVO_MB} MB`;
      }
    }
    return null;
  }

  function handleArchivosChange(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    const errorArchivos = validarArchivos(files);
    if (errorArchivos) {
      setError(errorArchivos);
      return;
    }
    setError(null);
    setArchivos(files);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (titulo.trim().length < 10) {
      setError('El título debe tener al menos 10 caracteres');
      return;
    }
    if (descripcion.trim().length < 50) {
      setError('La descripción debe tener al menos 50 caracteres');
      return;
    }

    const errorArchivos = validarArchivos(archivos);
    if (errorArchivos) {
      setError(errorArchivos);
      return;
    }

    setEnviando(true);
    try {
      const nueva = await crearSugerencia({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria || undefined,
        archivos,
      });
      navigate(`/sugerencias/${nueva.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo crear la sugerencia',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container page">
      <Link to="/" className="back-link">
        ← Volver al listado
      </Link>

      <section className="form-page">
        <header className="form-page__header">
          <h1>Nueva sugerencia ciudadana</h1>
          <p>
            Describe tu propuesta y adjunta documentos de apoyo. Tendrá 90 días
            para reunir 25.000 firmas.
          </p>
        </header>

        {error && <AlertMessage type="error" message={error} />}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="titulo" className="label">
              Título <span className="required">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              className="input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Ampliar ciclovías en el centro histórico"
              maxLength={150}
              required
            />
            <span className="hint">Mínimo 10 caracteres</span>
          </div>

          <div className="form__group">
            <label htmlFor="categoria" className="label">
              Categoría
            </label>
            <select
              id="categoria"
              className="select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Seleccionar categoría</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form__group">
            <label htmlFor="descripcion" className="label">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              className="textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Explica tu propuesta con el mayor detalle posible..."
              rows={8}
              maxLength={5000}
              required
            />
            <span className="hint">Mínimo 50 caracteres</span>
          </div>

          <div className="form__group">
            <label htmlFor="archivos" className="label">
              Archivos adjuntos
            </label>
            <input
              id="archivos"
              type="file"
              className="file-input"
              accept={EXTENSIONES_PERMITIDAS}
              multiple
              onChange={(e) => handleArchivosChange(e.target.files)}
            />
            <span className="hint">
              PDF, JPG, PNG, WEBP o DOCX. Máx. {MAX_ARCHIVOS} archivos de{' '}
              {MAX_TAMANO_ARCHIVO_MB} MB cada uno.
            </span>

            {archivos.length > 0 && (
              <ul className="file-list">
                {archivos.map((archivo) => (
                  <li key={archivo.name}>
                    {archivo.name} — {formatearTamano(archivo.size)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form__actions">
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={enviando}
            >
              {enviando ? 'Publicando...' : 'Publicar sugerencia'}
            </button>
            <Link to="/" className="btn btn--ghost">
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
