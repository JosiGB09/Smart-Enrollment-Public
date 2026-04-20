using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeccionController : ControllerBase
    {
        private readonly ISeccionRepository _repository;

        public SeccionController(ISeccionRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var secciones = await _repository.GetAllSecciones();
            return Ok(secciones);
        }

        [HttpGet("byGrado")]
        public async Task<IActionResult> GetByGrado([FromQuery] int gradoId)
        {
            var secciones = await _repository.GetSeccionesByGradoId(gradoId);
            return Ok(secciones);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var seccion = await _repository.GetSeccionById(id);
            if (seccion == null)
                return NotFound();
            return Ok(seccion);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Seccion seccion)
        {
            var result = await _repository.InsertSeccion(seccion);
            if (!result)
                return BadRequest();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Seccion seccion)
        {
            if (id != seccion.Id)
                return BadRequest("El ID no coincide");

            var result = await _repository.UpdateSeccion(seccion);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repository.DeleteSeccion(id);
            if (!result)
                return BadRequest();

            return Ok();
        }
    }
}
