using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstudianteController : ControllerBase
    {
        private readonly IEstudianteRepository _estudianteRepository;

        public EstudianteController(IEstudianteRepository estudianteRepository)
        {
            _estudianteRepository = estudianteRepository;
        }

        // GET api/estudiante
        [HttpGet]
        public async Task<IActionResult> GetAllEstudiantes()
        {
            var estudiantes = await _estudianteRepository.GetAllEstudiantes();
            return Ok(estudiantes);
        }

        // GET api/estudiante/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEstudianteById(int id)
        {
            var estudiante = await _estudianteRepository.GetEstudianteById(id);
            if (estudiante == null) return NotFound();
            return Ok(estudiante);
        }

        // POST api/estudiante
        // Devuelve el ID generado, el frontend lo necesita para insertar en encargadoestudiante
        [HttpPost]
        public async Task<IActionResult> CreateEstudiante([FromBody] Estudiante estudiante)
        {
            if (estudiante == null || !ModelState.IsValid)
                return BadRequest();

            var nuevoId = await _estudianteRepository.InsertEstudiante(estudiante);
            if (nuevoId == 0) return BadRequest("No se pudo crear el estudiante.");

            return Ok(new { id = nuevoId });
        }

        // PUT api/estudiante/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEstudiante(int id, [FromBody] Estudiante estudiante)
        {
            if (estudiante == null || id != estudiante.Id)
                return BadRequest("El ID no coincide.");

            var result = await _estudianteRepository.UpdateEstudiante(estudiante);
            if (!result) return NotFound();

            return NoContent();
        }

        // DELETE api/estudiante/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEstudiante(int id)
        {
            var result = await _estudianteRepository.DeleteEstudiante(id);
            if (!result) return NotFound();

            return NoContent();
        }
    }
}