import API_BASE from "../config/api.config";

const estudianteService = {
     getAllEstudiantes: async () => {
        const res = await fetch(`${API_BASE}/estudiante`);
        if (!res.ok) throw new Error(`Error al obtener estudiantes: ${res.status}`);
        return res.json();
    },
 
    getEstudianteById: async (id) => {
    const res = await fetch(`${API_BASE}/estudiante/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error al obtener estudiante: ${res.status}`);
    return res.json();
  },

  postEstudiante: async (estudiante) => {
    const res = await fetch(`${API_BASE}/estudiante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estudiante),
    });
    if (!res.ok) throw new Error(`Error al guardar estudiante: ${res.status}`);
    return res.json(); // { id: nuevoId }
  },

  putEstudiante: async (id, estudiante) => {
    const res = await fetch(`${API_BASE}/estudiante/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estudiante),
    });
    if (!res.ok) throw new Error(`Error al actualizar estudiante: ${res.status}`);
  },
    deleteEstudiante: async (id) => {
    const res = await fetch(`${API_BASE}/estudiante/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error al eliminar estudiante: ${res.status}`);
  },

  postEncargadoEstudiante: async (relacion) => {
    const res = await fetch(`${API_BASE}/encargadoestudiante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(relacion),
    });
    if (!res.ok) throw new Error(`Error al guardar relación encargado-estudiante: ${res.status}`);
  },

  deleteEncargadoEstudiante: async (estudianteId, encargadoId) => {
    const res = await fetch(
      `${API_BASE}/encargadoestudiante?estudianteId=${estudianteId}&encargadoId=${encargadoId}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error(`Error al eliminar relación encargado-estudiante: ${res.status}`);
  },
};

export default estudianteService;