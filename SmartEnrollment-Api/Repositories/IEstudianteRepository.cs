using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public interface IEstudianteRepository
    {
        Task<IEnumerable<Estudiante>> GetAllEstudiantes();
        Task<int> InsertEstudiante(Estudiante estudiante);
        Task<bool> UpdateEstudiante(Estudiante estudiante);
        Task<bool> DeleteEstudiante(int id);
        Task<Estudiante?> GetEstudianteById(int id);
    }
}
