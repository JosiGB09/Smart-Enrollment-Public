using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models.Encargados;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EncargadoController : ControllerBase
    {
        private readonly IEncargadoRepository _repository;

        public EncargadoController(IEncargadoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var encargados = await _repository.GetAllEncargados();
            return Ok(encargados);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var encargado = await _repository.GetEncargadoById(id);
            if (encargado == null) return NotFound();
            return Ok(encargado);
        }
        [HttpGet("cedula/{cedula}")]
        public async Task<IActionResult> GetByCedula(string cedula)
        {
            var encargado = await _repository.GetEncargadoByCedula(cedula);
            if (encargado == null) return NotFound();
            return Ok(encargado);
        }
            [HttpPost]
        public async Task<IActionResult> Create([FromBody] Encargado encargado)
        {
            var result = await _repository.InsertEncargado(encargado);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Encargado encargado)
        {
            if (id != encargado.Id) return BadRequest("El ID no coincide");
            var result = await _repository.UpdateEncargado(encargado);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repository.DeleteEncargado(id);
            if (!result) return BadRequest();
            return Ok();
        }
    }
}
