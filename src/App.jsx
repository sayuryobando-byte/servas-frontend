import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import CatalogPage from "./pages/CatalogPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import CompanyPage from "./pages/CompanyPage";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <Routes>
          {/* HU-008 / HU-009 · Catálogo y detalle de servicio */}
          <Route path="/" element={<CatalogPage />} />

          {/* HU-001 · Registro de proveedor */}
          <Route path="/registro" element={<RegisterPage />} />

          {/* HU-002 · Verificación del correo electrónico */}
          <Route path="/verificar-correo" element={<VerifyEmailPage />} />

          {/* HU-004 · Inicio de sesión */}
          <Route path="/login" element={<LoginPage />} />

          {/* HU-003 · Datos de compañía (requiere sesión) */}
          <Route
            path="/negocio"
            element={
              <ProtectedRoute>
                <CompanyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
