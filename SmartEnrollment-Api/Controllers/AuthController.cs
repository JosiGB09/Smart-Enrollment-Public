using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartEnrollment_Api.DTOs;
using SmartEnrollment_Api.Repositories;
using SmartEnrollment_Api.Services;

namespace SmartEnrollment_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;


        public AuthController(IUsuarioRepository usuarioRepository, IConfiguration config,IEmailService emailService)
        {
            _usuarioRepository = usuarioRepository;
            _config = config;
            _emailService = emailService;
        }
        private static string GenerarContrasenaTemporal(int longitud = 10)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
            var random = new Random();

            return new string(Enumerable.Range(0, longitud)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
        }
        [HttpPost("recuperar-contrasena")]
        public async Task<IActionResult> RecuperarContrasena([FromBody] RecuperarContrasenaDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Correo))
                return BadRequest(new { message = "El correo es obligatorio." });

            var usuario = await _usuarioRepository.GetByCorreo(dto.Correo);

            if (usuario == null)
            {
                return Ok(new
                {
                    message = "Si el correo existe, se enviaran instrucciones de recuperacion."
                });
            }

            var contrasenaTemporal = GenerarContrasenaTemporal();
            var contrasenaHash = BCrypt.Net.BCrypt.HashPassword(contrasenaTemporal);

            var actualizada = await _usuarioRepository.ActualizarContrasena(usuario.Id, contrasenaHash);

            if (!actualizada)
                return StatusCode(500, new { message = "No se pudo actualizar la contrasena." });

            await _emailService.EnviarCredenciales(
                destinatario: usuario.Correo,
                nombre: $"{usuario.Nombre} {usuario.Apellido}",
                username: usuario.Username,
                contrasena: contrasenaTemporal
            );

            return Ok(new
            {
                message = "Si el correo existe, se enviaran instrucciones de recuperacion."
            });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // 1. Buscar usuario por correo
            var usuario = await _usuarioRepository.GetByCorreo(dto.Correo);
            if (usuario == null) return Unauthorized(new { message = "Credenciales incorrectas." });

            // 2. Verificar que la cuenta esté activa
            if (!usuario.Estado) return Unauthorized(new { message = "La cuenta está deshabilitada." });

            // 3. Verificar contraseña
            if (!BCrypt.Net.BCrypt.Verify(dto.Contrasena, usuario.Contrasena))
                return Unauthorized(new { message = "Credenciales incorrectas." });

            // 4. Generar token
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Username),
                new Claim(ClaimTypes.Role, usuario.Rol),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                usuario = new
                {
                    id = usuario.Id,
                    nombre = usuario.Nombre,
                    apellido = usuario.Apellido,
                    username = usuario.Username,
                    rol = usuario.Rol,
                    correo = usuario.Correo,
                }
            });
        }
    }
}