namespace SmartEnrollment_Api.Models.Base
{
    public class Persona
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Cedula { get; set; } = string.Empty;
        public string? Nacionalidad { get; set; }
    }
}
