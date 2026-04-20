import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usuarioService from "../../services/Auth.service";
import "./LoginPage.css"; 
import { useAuth } from "../../context/AuthContext";


function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await usuarioService.login(form.correo, form.contrasena);
      login(response);
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "No fue posible iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="login-eyebrow">Acceso al sistema</p>
          <h1>Iniciar sesion</h1>
          <span>
            Ingresa tu correo y contrasena para acceder a la plataforma.
          </span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="contrasena">Contrasena</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Ingresa tu contrasena"
              required
            />
          </div>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/recuperar-contrasena" className="login-link">
            Recuperar contrasena
          </Link>

          <Link to="/" className="login-back">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
