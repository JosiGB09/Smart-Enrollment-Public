using SmartEnrollment_Api.Models;

using SmartEnrollment_Api.Models;
namespace SmartEnrollment_Api.Repositories
{
    public interface IUsuarioRepository
    {
        Task<PagedResult<Usuario>> GetUsuariosPaginados(int pagina, int tamano, string? rol, bool? estado, string? busqueda, string? tipoBusqueda);
        Task<Usuario?> GetUsuarioById(int id);
        Task<Usuario?> GetByCorreo(string correo);
        Task<Usuario?> GetByUsername(string username);
        Task<bool> InsertUsuario(Usuario usuario);
        Task<bool> UpdateUsuario(Usuario usuario);
        Task<bool> CambiarEstado(int id, bool estado);
        Task<bool> DeleteUsuario(Usuario usuario);
        Task<bool> ActualizarContrasena(int id, string contrasenaHash);

    }
}