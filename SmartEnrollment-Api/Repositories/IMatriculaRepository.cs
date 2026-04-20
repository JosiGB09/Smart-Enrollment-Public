using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public interface IMatriculaRepository
    {
        Task<IEnumerable<Matricula>> GetAllMatriculas();
        Task<Matricula?> GetMatriculaById(int id);
        Task<bool> InsertMatricula(Matricula matricula);
        Task<bool> UpdateMatricula(Matricula matricula);
        Task<bool> DeleteMatricula(int id);
    }
}
