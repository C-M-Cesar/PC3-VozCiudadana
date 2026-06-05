import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand">
            <span className="brand__icon" aria-hidden="true">
              ✦
            </span>
            <div>
              <span className="brand__title">Voz Ciudadana</span>
              <span className="brand__subtitle">
                Plataforma de sugerencias y firmas
              </span>
            </div>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav__link">
              Inicio
            </Link>
            <Link to="/crear" className="btn btn--primary">
              Nueva sugerencia
            </Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>
            Las sugerencias tienen 90 días para alcanzar 25.000 firmas
            ciudadanas.
          </p>
          <p className="footer__note">
            Fase 1 — Sin verificación de identidad
          </p>
        </div>
      </footer>
    </div>
  );
}
