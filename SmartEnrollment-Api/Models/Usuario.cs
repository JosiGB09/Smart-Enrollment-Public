using SmartEnrollment_Api.Models.Base;

namespace SmartEnrollment_Api.Models

{
    public class Usuario : Persona
    {
        public string Username { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public string Contrasena { get; set; } = string.Empty;
        public bool Estado { get; set; } = true;

        public ICollection<Matricula> Matriculas { get; set; } = new List<Matricula>();

    }
}
