import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/Auth.service";
import "./LoginPage.css";

function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.recuperarContrasena(correo);
      setSuccess(
        response?.message || "Si el correo existe, se enviaran instrucciones de recuperacion."
      );
      setCorreo("");
    } catch (err) {
      setError(err.message || "No se pudo procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="login-eyebrow">Recuperacion</p>
          <h1>Recuperar contrasena</h1>
          <span>
            Ingresa tu correo para recibir instrucciones de recuperacion.
          </span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          {error ? <p className="login-error">{error}</p> : null}
          {success ? <p className="login-success">{success}</p> : null}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/login" className="login-link">
            Volver a iniciar sesion
          </Link>

          <Link to="/" className="login-back">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
