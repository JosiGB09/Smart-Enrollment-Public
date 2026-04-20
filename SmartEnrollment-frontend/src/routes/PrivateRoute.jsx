import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children, roles }) {
  const { usuario, token } = useAuth();

  if (!token || !usuario) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(usuario.rol))
    return <Navigate to="/dashboard" replace />;

  return children;
}

export default PrivateRoute;