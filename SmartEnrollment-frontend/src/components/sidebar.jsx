import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaBars, FaChevronLeft, FaMoon, FaSun } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { appRoutes } from "../routes/appRoutes";
import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { usuario } = useAuth();

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile, setIsOpen]);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? "expanded" : "collapsed"} ${isMobile ? "mobile" : ""}`}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">SE</div>

            {isOpen && (
              <div className="sidebar-brand-copy">
                <strong>Smart Enrollment</strong>
                <span>Panel administrativo</span>
              </div>
            )}
          </div>

          <div className="sidebar-actions">
            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Expandir o contraer menu"
            >
              {isOpen ? <FaChevronLeft /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className="sidebar-divider" />

        <Nav className="sidebar-nav">
          {appRoutes
            .filter((route) => route.showInMenu && route.roles.includes(usuario?.rol))
            .map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                <span className="sidebar-link-icon">
                  <route.icon size={18} />
                </span>

                {isOpen && (
                  <span className="sidebar-link-label">
                    {route.label}
                  </span>
                )}
              </NavLink>
            ))}
        </Nav>
      </aside>
    </>
  );
}

export default Sidebar;
