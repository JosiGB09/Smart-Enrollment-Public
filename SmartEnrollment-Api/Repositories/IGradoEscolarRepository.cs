using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public interface IGradoEscolarRepository
    {
        Task<IEnumerable<GradoEscolar>> GetAllGrados();
        Task<GradoEscolar?> GetGradoById(int id);
        Task<bool> InsertGrado(GradoEscolar grado);
        Task<bool> UpdateGrado(GradoEscolar grado);
        Task<bool> DeleteGrado(int id);
    }
}
