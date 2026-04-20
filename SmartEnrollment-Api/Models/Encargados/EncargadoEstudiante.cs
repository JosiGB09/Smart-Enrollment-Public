namespace SmartEnrollment_Api.Models.Encargados;

public class EncargadoEstudiante
{
    public int EstudianteId { get; set; }
    public Estudiante? Estudiante { get; set; } 

    public int EncargadoId { get; set; }
    public Encargado? Encargado { get; set; } 
    public string? Parentesco { get; set; }
    public bool EsEncargadoLegal { get; set; } = false;
}

