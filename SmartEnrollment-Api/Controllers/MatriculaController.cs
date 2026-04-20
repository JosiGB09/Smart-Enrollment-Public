using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatriculaController : ControllerBase
    {
        private readonly IMatriculaRepository _matriculaRepository;

        public MatriculaController(IMatriculaRepository matriculaRepository)
        {
            _matriculaRepository = matriculaRepository;
        }

        // GET: api/matricula
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var matriculas = await _matriculaRepository.GetAllMatriculas();
            return Ok(matriculas);
        }

        // GET: api/matricula/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var matricula = await _matriculaRepository.GetMatriculaById(id);

            if (matricula == null)
                return NotFound("Matrícula no encontrada");

            return Ok(matricula);
        }

        // POST: api/matricula
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Matricula matricula)
        {
            if (matricula == null)
                return BadRequest("Datos inválidos");

            var result = await _matriculaRepository.InsertMatricula(matricula);

            if (!result)
                return StatusCode(500, "Error al crear la matrícula");

            return Ok("Matrícula creada correctamente");
        }

        // PUT: api/matricula/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Matricula matricula)
        {
            if (matricula == null || id != matricula.Id)
                return BadRequest("Datos inconsistentes");

            var result = await _matriculaRepository.UpdateMatricula(matricula);

            if (!result)
                return NotFound("No se pudo actualizar la matrícula");

            return Ok("Matrícula actualizada correctamente");
        }

        // DELETE: api/matricula/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _matriculaRepository.DeleteMatricula(id);

            if (!result)
                return NotFound("No se pudo eliminar la matrícula");

            return Ok("Matrícula eliminada correctamente");
        }
    }
}
