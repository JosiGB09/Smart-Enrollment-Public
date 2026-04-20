import API_BASE from "../config/api.config";

const encargadoService = {
   getAllEncargados: async () => {
    const res = await fetch(`${API_BASE}/encargado`);
    if (!res.ok) throw new Error(`Error al obtener encargados: ${res.status}`);
    return res.json();
  },
  buscarPorCedula: async (cedula) => {
    const res = await fetch(`${API_BASE}/encargado/cedula/${encodeURIComponent(cedula)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error al buscar encargado: ${res.status}`);
    return res.json();
  },
  

  getEncargadosByEstudiante: async (estudianteId) => {
    const res = await fetch(`${API_BASE}/encargadoestudiante/byEstudiante?estudianteId=${estudianteId}`);
    if (!res.ok) throw new Error(`Error al obtener encargados: ${res.status}`);
    return res.json(); // [{ estudianteId, encargadoId, parentesco, esEncargadoLegal, encargado: {...} }]
  },
   postEncargado: async (encargado) => {
    const res = await fetch(`${API_BASE}/encargado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encargado),
    });
    if (!res.ok) throw new Error(`Error al guardar encargado: ${res.status}`);
  },
  deleteEncargado: async (id) => {
    const res = await fetch(`${API_BASE}/encargado/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error al eliminar encargado: ${res.status}`);
  },
  putEncargado: async (id, encargado) => {
    const res = await fetch(`${API_BASE}/encargado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encargado),
    });
    if (!res.ok) throw new Error(`Error al actualizar encargado: ${res.status}`);
  },
  getEncargadoById: async (id) => {
    const res = await fetch(`${API_BASE}/encargado/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error al obtener encargado: ${res.status}`);
    return res.json();
  },
  
};

export default encargadoService;