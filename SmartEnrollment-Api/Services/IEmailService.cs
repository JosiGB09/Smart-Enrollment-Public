namespace SmartEnrollment_Api.Services
{
    public interface IEmailService
    {
        Task EnviarCredenciales(string destinatario, string nombre, string username, string contrasena);
    }
}