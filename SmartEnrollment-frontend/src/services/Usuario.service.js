import API_BASE from "../config/api.config";

const usuarioService = {
  getUsuariosPaginados: async ({ pagina, tamano, rol, estado, busqueda, tipoBusqueda }) => {
    const params = new URLSearchParams();
    params.append("pagina", pagina);
    params.append("tamano", tamano);
    if (rol) params.append("rol", rol);
    if (estado !== null && estado !== undefined) params.append("estado", estado);
    if (busqueda) params.append("busqueda", busqueda);
    if (tipoBusqueda) params.append("tipoBusqueda", tipoBusqueda);
 
    const res = await fetch(`${API_BASE}/usuario?${params.toString()}`);
    if (!res.ok) throw new Error(`Error al obtener usuarios: ${res.status}`);
    return res.json();
  },


  postUsuario: async (usuario) => {
    const res = await fetch(`${API_BASE}/usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    if (!res.ok) throw new Error(`Error al guardar usuario: ${res.status}`);
    return res.json();
  },

  putUsuario: async (id, usuario) => {
    const res = await fetch(`${API_BASE}/usuario/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    if (!res.ok) throw new Error(`Error al actualizar usuario: ${res.status}`);
  },
  verificarCorreo: async (correo) => {
    const res = await fetch(`${API_BASE}/usuario/correo/${encodeURIComponent(correo)}`);
    if (res.status === 404) return true; 
    if (res.ok) return false;             
    throw new Error(`Error al verificar correo: ${res.status}`);
  },

  deleteUsuario: async (id) => {
    const res = await fetch(`${API_BASE}/usuario/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error al eliminar usuario: ${res.status}`);
  },
  verificarUsername: async (username) => {
    const res = await fetch(`${API_BASE}/usuario/username/${encodeURIComponent(username)}`);
    if (res.status === 404) return true;  // no existe 
    if (res.ok) return false;             // existe
    throw new Error(`Error al verificar username: ${res.status}`);
  },
  getUsuarioById: async (id) => {
    const res = await fetch(`${API_BASE}/usuario/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error al obtener usuario: ${res.status}`);
    return res.json();
  },
  cambiarEstado: async (id, estado) => {
    const res = await fetch(`${API_BASE}/usuario/${id}/estado?estado=${estado}`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error(`Error al cambiar estado: ${res.status}`);
  },
 
};

export default usuarioService;