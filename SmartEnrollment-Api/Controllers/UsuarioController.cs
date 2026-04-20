using Microsoft.AspNetCore.Mvc;
using SmartEnrollment_Api.Models;
using SmartEnrollment_Api.Repositories;

namespace SmartEnrollment_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }
        //get con filtros y paginacion
        [HttpGet]
        public async Task<IActionResult> GetUsuarios(
            [FromQuery] int pagina = 1,
            [FromQuery] int tamano = 10,
            [FromQuery] string? rol = null,
            [FromQuery] bool? estado = null,
            [FromQuery] string? busqueda = null,
            [FromQuery] string? tipoBusqueda = null)
        {
            var result = await _usuarioRepository.GetUsuariosPaginados(pagina, tamano, rol, estado, busqueda, tipoBusqueda);
            return Ok(result);
        }
        // GET by correo
        [HttpGet("correo/{correo}")]
        public async Task<IActionResult> GetByCorreo(string correo)
        {
            var usuario = await _usuarioRepository.GetByCorreo(correo);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }
        //Get by username
        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {
            var usuario = await _usuarioRepository.GetByUsername(username);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }
        //Get by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuariById(int id)
        {
            var usuario = await _usuarioRepository.GetUsuarioById(id);
            if (usuario == null) return NotFound();
            return Ok(usuario);

        }

        // POST
        [HttpPost]
        public async Task<IActionResult> CreateUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null || !ModelState.IsValid)
                return BadRequest();

            var created = await _usuarioRepository.InsertUsuario(usuario);
            return Created("Usuario creado exitosamente", created);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, [FromBody] Usuario usuario)
        {
            if (usuario == null || id != usuario.Id)
                return BadRequest();

            await _usuarioRepository.UpdateUsuario(usuario);
            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            await _usuarioRepository.DeleteUsuario(new Usuario { Id = id });
            return NoContent();
        }

        //borradologico
        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromQuery] bool estado)
        {
            var result = await _usuarioRepository.CambiarEstado(id, estado);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}