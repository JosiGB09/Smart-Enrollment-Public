using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public interface ISeccionRepository
    {
        Task<IEnumerable<Seccion>> GetAllSecciones();
        Task<IEnumerable<Seccion>> GetSeccionesByGradoId(int gradoId);
        Task<Seccion?> GetSeccionById(int id);
        Task<bool> InsertSeccion(Seccion seccion);
        Task<bool> UpdateSeccion(Seccion seccion);
        Task<bool> DeleteSeccion(int id);
    }
}
