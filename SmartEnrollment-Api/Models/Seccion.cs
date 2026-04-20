using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace SmartEnrollment_Api.Models
{
    [Table("seccion")]
    public class Seccion
    {
        public int Id { get; set; }

        [Required]
        public int GradoId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Nombre { get; set; } = string.Empty;

        public int Capacidad { get; set; }

        [JsonIgnore]
        public GradoEscolar? Grado { get; set; }
    }

}
