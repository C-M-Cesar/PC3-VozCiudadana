import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CrearSugerenciaPage } from './pages/CrearSugerenciaPage';
import { HomePage } from './pages/HomePage';
import { SugerenciaDetailPage } from './pages/SugerenciaDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="crear" element={<CrearSugerenciaPage />} />
          <Route path="sugerencias/:id" element={<SugerenciaDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
