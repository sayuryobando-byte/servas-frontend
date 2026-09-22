import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      // Capturamos el resultado del login desde useAuth()
      const user = await login({ email, password });

      // Evaluación condicional:
      // Verificamos si existe la empresa/compañía en el objeto retornado
      const hasCompany = user?.companyId || user?.company_id || user?.hasCompany;

      if (!hasCompany) {
        // Si NO tiene empresa registrada, lo enviamos al registro de empresa
        navigate("/registrar-empresa"); 
      } else {
        // Si YA tiene empresa, lo dejamos ir a la creación de servicios o panel
        navigate("/registrar-servicio"); // o "/negocio" según el nombre de tu ruta
      }
    } catch (err) {
      // HU-004 · Inicio de sesión fallido
      setError(err.friendlyMessage || "Correo o contraseña incorrectos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Portal proveedores</h1>
        <p className="muted">Inicia sesión para administrar tus servicios y reservas.</p>

        {error && <div className="alert alert--error">{error}</div>}

        <label className="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="muted center">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
