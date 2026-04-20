import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const scrollToInfo = () => {
    const section = document.getElementById("landing-info");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-brand-mark">SE</span>
          <div>
            <strong>Smart Enrollment</strong>
            <p>Plataforma institucional</p>
          </div>
        </div>

      </header>

      <section className="landing-hero">
        <div className="landing-overlay" />

        <div className="landing-content">
          <span className="landing-badge">Sistema de matricula escolar</span>

          <h1 className="landing-title">
            Gestion escolar clara, moderna y centralizada
          </h1>

          <p className="landing-subtitle">
            Administra estudiantes, encargados, grados, secciones y procesos de
            matricula desde una sola plataforma.
          </p>

          <div className="landing-actions">
            <button
              type="button"
              className="landing-btn landing-btn-primary"
              onClick={() => navigate("/login")}
            >
              Iniciar sesion
            </button>

            <button
              type="button"
              className="landing-btn landing-btn-secondary"
              onClick={scrollToInfo}
            >
              Ver mas
            </button>
          </div>
        </div>
      </section>

      <section id="landing-info" className="landing-info">
        <div className="landing-info-header">
            <span className="landing-section-label">Que puedes hacer aqui</span>
            <h2>Funciones pensadas para cada tipo de usuario</h2>
            <p>
            La plataforma organiza la experiencia segun el rol para facilitar el
            trabajo administrativo y el seguimiento de cada estudiante.
            </p>
        </div>

        <div className="landing-role-sections">
            <article className="landing-role-panel">
            <div className="landing-role-heading">
                <h3>Encargados</h3>
                <p>
                Un espacio para consultar informacion, dar seguimiento y gestionar
                solicitudes relacionadas con los estudiantes a su cargo.
                </p>
            </div>

            <div className="landing-feature-grid">
                <article className="landing-feature-card">
                <h4>Solicitudes de matricula</h4>
                <p>
                    Permite iniciar solicitudes de matricula y dar seguimiento a su
                    estado.
                </p>
                </article>

                <article className="landing-feature-card">
                <h4>Informacion estudiantil</h4>
                <p>
                    Consulta datos relevantes de los estudiantes registrados bajo su
                    responsabilidad.
                </p>
                </article>

                <article className="landing-feature-card">
                <h4>Notificaciones y avisos</h4>
                <p>
                    Recibe avisos sobre solicitudes, documentos pendientes y mensajes
                    institucionales.
                </p>
                </article>
            </div>
            </article>

            <article className="landing-role-panel">
            <div className="landing-role-heading">
                <h3>Administradores</h3>
                <p>
                Herramientas orientadas al control institucional y a la gestion
                integral del proceso de matricula.
                </p>
            </div>

            <div className="landing-feature-grid">
                <article className="landing-feature-card">
                <h4>Gestion de usuarios</h4>
                <p>
                    Administra cuentas de acceso y roles dentro de la plataforma.
                </p>
                </article>

                <article className="landing-feature-card">
                <h4>Estudiantes y encargados</h4>
                <p>
                    Mantiene actualizada la informacion personal y las relaciones entre
                    responsables y estudiantes.
                </p>
                </article>

                <article className="landing-feature-card">
                <h4>Grados y matriculas</h4>
                <p>
                    Gestiona grados, secciones, matriculas manuales y solicitudes
                    pendientes.
                </p>
                </article>
            </div>
            </article>
        </div>
        </section>


    </div>
  );
}

export default LandingPage;
