using SmartEnrollment_Api.Models.Encargados;

namespace SmartEnrollment_Api.Repositories
{
    public interface IEncargadoRepository
    {
        Task<List<Encargado>> GetAllEncargados();
        Task<Encargado?> GetEncargadoById(int id);
        Task<bool> InsertEncargado(Encargado encargado);
        Task<bool> UpdateEncargado(Encargado encargado);
        Task<bool> DeleteEncargado(int id);
        Task<Encargado?> GetEncargadoByCedula(string cedula);
    }
}
