using SmartEnrollment_Api.Models.Base;

namespace SmartEnrollment_Api.Models.Encargados
{
    public class Encargado: Persona
    {
        public string? Telefono { get; set; }
        public string? EstadoCivil { get; set; }
        public string? Ocupacion { get; set; }
        public string? Direccion { get; set; }

        public ICollection<EncargadoEstudiante> Estudiantes { get; set; } = new List<EncargadoEstudiante>();
    }
}
