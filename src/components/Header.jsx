import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, provider, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        <span className="header__logo">⚡</span>
        agenda.co
      </Link>

      <nav className="header__actions">
        {isAuthenticated ? (
          <>
            <Link to="/negocio" className="header__link">
              Mi negocio
            </Link>
            <span className="header__provider">{provider?.email}</span>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn--ghost">
            Portal proveedores
          </Link>
        )}
      </nav>
    </header>
  );
}
