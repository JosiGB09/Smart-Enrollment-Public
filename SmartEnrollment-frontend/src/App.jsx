import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./views/landing/LandingPage";
import LoginPage from "./views/auth/LoginPage";
import { appRoutes } from "./routes/appRoutes.jsx";
import ForgotPasswordPage from "./views/auth/ForgotPasswordPage";
import PrivateRoute from "./routes/PrivateRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />

      {/*rutas privadas*/}
      <Route element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute roles={route.roles}>
                {route.element}
              </PrivateRoute>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
