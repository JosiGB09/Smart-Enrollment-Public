using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models.Encargados;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EncargadoEstudianteController : ControllerBase
    {
        private readonly IEncargadoEstudianteRepository _repository;

        public EncargadoEstudianteController(IEncargadoEstudianteRepository repository)
        {
            _repository = repository;
        }

        // GET api/encargadoestudiante/byEstudiante?estudianteId=1
        [HttpGet("byEstudiante")]
        public async Task<IActionResult> GetByEstudiante([FromQuery] int estudianteId)
        {
            var encargados = await _repository.GetEncargadosByEstudiante(estudianteId);
            return Ok(encargados);
        }

        // POST api/encargadoestudiante
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EncargadoEstudiante encargadoEstudiante)
        {
            var result = await _repository.InsertEncargadoEstudiante(encargadoEstudiante);
            if (!result) return BadRequest("No se pudo insertar. Verifique que no exista ya un encargado legal para este estudiante.");
            return Ok();
        }

        // PUT api/encargadoestudiante
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] EncargadoEstudiante encargadoEstudiante)
        {
            var result = await _repository.UpdateEncargadoEstudiante(encargadoEstudiante);
            if (!result) return BadRequest("No se pudo actualizar. Verifique que no exista ya otro encargado legal para este estudiante.");
            return NoContent();
        }

        // DELETE api/encargadoestudiante?estudianteId=1&encargadoId=2
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int estudianteId, [FromQuery] int encargadoId)
        {
            var result = await _repository.DeleteEncargadoEstudiante(estudianteId, encargadoId);
            if (!result) return NotFound();
            return Ok();
        }
    }
}