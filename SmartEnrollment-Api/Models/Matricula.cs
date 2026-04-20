
using SmartEnrollment_Api.Models;
namespace SmartEnrollment_Api.Models


{
    public class Matricula
    {
        public int Id { get; set; }

        public int EstudianteId { get; set; }
        public Estudiante Estudiante { get; set; } = null!;

        public int GradoEscolarId { get; set; }
        public GradoEscolar GradoEscolar { get; set; } = null!;

        public int? SeccionId { get; set; }
        public Seccion? Seccion { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public DateTime Fecha { get; set; }
    }
}
