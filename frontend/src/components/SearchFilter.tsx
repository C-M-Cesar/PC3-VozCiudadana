import { ESTADOS_FILTRO } from '../constants';
import type { FiltrosSugerencia } from '../types/sugerencia';

interface SearchFilterProps {
  filtros: FiltrosSugerencia;
  onChange: (filtros: FiltrosSugerencia) => void;
}

export function SearchFilter({ filtros, onChange }: SearchFilterProps) {
  return (
    <div className="filters">
      <div className="filters__search">
        <label htmlFor="busqueda" className="sr-only">
          Buscar sugerencias
        </label>
        <input
          id="busqueda"
          type="search"
          className="input"
          placeholder="Buscar por título, descripción o categoría..."
          value={filtros.busqueda ?? ''}
          onChange={(e) =>
            onChange({ ...filtros, busqueda: e.target.value })
          }
        />
      </div>
      <div className="filters__estado">
        <label htmlFor="estado" className="label">
          Estado
        </label>
        <select
          id="estado"
          className="select"
          value={filtros.estado ?? 'TODAS'}
          onChange={(e) =>
            onChange({
              ...filtros,
              estado: e.target.value as FiltrosSugerencia['estado'],
            })
          }
        >
          {ESTADOS_FILTRO.map((estado) => (
            <option key={estado.value} value={estado.value}>
              {estado.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
