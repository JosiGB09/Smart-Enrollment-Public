using SmartEnrollment_Api.Models.Base;
using SmartEnrollment_Api.Models.Encargados;

namespace SmartEnrollment_Api.Models
{
    public class Estudiante : Persona
    {
        public DateTime? FechaNacimiento { get; set; }
        public string? Sexo { get; set; }
        public string? Padecimientos { get; set; }
        public bool HermanosEstudiantes { get; set; }
        public bool VacunasCompletas { get; set; }
        public string? Beca { get; set; }
        public bool Traslado { get; set; }
        public bool Repitente { get; set; }
        public int? GradoEscolarId { get; set; }

        public GradoEscolar? GradoEscolar { get; set; }
        public ICollection<EncargadoEstudiante> Encargados { get; set; } = new List<EncargadoEstudiante>();
        public ICollection<Matricula> Matriculas { get; set; } = new List<Matricula>();
    }
}