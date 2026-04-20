import API_BASE from "../config/api.config";

const authService = {
  login: async (correo, contrasena) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });
    if (res.status === 401) {
      const err = await res.json();
      throw new Error(err.message || "Credenciales incorrectas.");
    }
    if (!res.ok) throw new Error(`Error al iniciar sesión: ${res.status}`);
    return res.json(); // { token, usuario } 
    //pd: lo cambio a correo
  },

  recuperarContrasena: async (correo) => {
    const res = await fetch(`${API_BASE}/auth/recuperar-contrasena`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "No se pudo procesar la solicitud");
    }

    return data;
  },
}
export default authService;