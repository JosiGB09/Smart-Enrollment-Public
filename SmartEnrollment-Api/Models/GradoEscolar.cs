using SmartEnrollment_Api.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartEnrollment_Api.Models

{
    [Table("gradoEscolar")]
    public class GradoEscolar
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Nombre { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;

        [JsonIgnore]
        public ICollection<Seccion>? Secciones { get; set; }

        [JsonIgnore]
        public ICollection<Matricula>? Matriculas { get; set; }
    }
}
