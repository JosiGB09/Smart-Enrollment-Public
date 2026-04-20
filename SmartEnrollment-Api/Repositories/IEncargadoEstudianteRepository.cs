using SmartEnrollment_Api.Models.Encargados;

namespace SmartEnrollment_Api.Repositories
{
    public interface IEncargadoEstudianteRepository
    {
        Task<IEnumerable<EncargadoEstudiante>> GetEncargadosByEstudiante(int estudianteId);
        Task<bool> InsertEncargadoEstudiante(EncargadoEstudiante encargadoEstudiante);
        Task<bool> UpdateEncargadoEstudiante(EncargadoEstudiante encargadoEstudiante);
        Task<bool> DeleteEncargadoEstudiante(int estudianteId, int encargadoId);
    }
}