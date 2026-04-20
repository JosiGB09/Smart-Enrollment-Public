using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradoEscolarController : ControllerBase
    {
        private readonly IGradoEscolarRepository _repository;

        public GradoEscolarController(IGradoEscolarRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var grados = await _repository.GetAllGrados();
            return Ok(grados);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var grado = await _repository.GetGradoById(id);
            if (grado == null)
                return NotFound();

            return Ok(grado);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradoEscolar grado)
        {
            var result = await _repository.InsertGrado(grado);
            if (!result)
                return BadRequest();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradoEscolar grado)
        {
            if (id != grado.Id)
                return BadRequest("El ID no coincide");

            var result = await _repository.UpdateGrado(grado);

            if (!result)
                return NotFound();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repository.DeleteGrado(id);
            if (!result)
                return BadRequest();

            return Ok();
        }
    }
}
