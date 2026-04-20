using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models;
using SmartEnrollment_Api.Services;

namespace SmartEnrollment_Api.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly MySQLConfiguration _connectionString;
        private readonly IEmailService _emailService;

        public UsuarioRepository(MySQLConfiguration connectionString, IEmailService emailService)
        {
            _connectionString = connectionString;
            _emailService = emailService;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }

        public async Task<PagedResult<Usuario>> GetUsuariosPaginados(
            int pagina, int tamano, string? rol, bool? estado, string? busqueda, string? tipoBusqueda)
        {
            var db = dbConnection();

            // Construir WHERE dinámico
            var condiciones = new List<string>();
            var parametros = new DynamicParameters();

            if (!string.IsNullOrEmpty(rol))
            {
                condiciones.Add("rol = @Rol");
                parametros.Add("Rol", rol);
            }

            if (estado.HasValue)
            {
                condiciones.Add("estado = @Estado");
                parametros.Add("Estado", estado.Value);
            }

            if (!string.IsNullOrEmpty(busqueda) && !string.IsNullOrEmpty(tipoBusqueda))
            {
                if (tipoBusqueda == "correo")
                    condiciones.Add("correo LIKE @Busqueda");
                else
                    condiciones.Add("username LIKE @Busqueda");

                parametros.Add("Busqueda", $"%{busqueda}%");
            }

            var where = condiciones.Count > 0
                ? "WHERE " + string.Join(" AND ", condiciones)
                : "";

            // Total de registros
            var sqlCount = $"SELECT COUNT(*) FROM usuario {where}";
            var total = await db.ExecuteScalarAsync<int>(sqlCount, parametros);

            // Paginación
            var offset = (pagina - 1) * tamano;
            parametros.Add("Tamano", tamano);
            parametros.Add("Offset", offset);

            var sqlData = $@"SELECT id, nombre, apellido, username, rol, correo, estado
                             FROM usuario {where}
                             ORDER BY nombre ASC
                             LIMIT @Tamano OFFSET @Offset";

            var data = await db.QueryAsync<Usuario>(sqlData, parametros);

            return new PagedResult<Usuario>
            {
                Data = data,
                TotalRegistros = total,
                PaginaActual = pagina,
                TotalPaginas = (int)Math.Ceiling((double)total / tamano)
            };
        }

        public async Task<Usuario?> GetUsuarioById(int id)
        {
            var db = dbConnection();
            var sql = @"SELECT id, nombre, apellido, username, rol, correo, estado
                        FROM usuario WHERE id = @Id LIMIT 1";
            return await db.QueryFirstOrDefaultAsync<Usuario>(sql, new { Id = id });
        }

        public async Task<Usuario?> GetByCorreo(string correo)
        {
            var db = dbConnection();
            var sql = @"SELECT id, nombre, apellido, username, rol, correo, estado, contrasena
            FROM usuario
            WHERE correo = @Correo
            LIMIT 1";
            return await db.QueryFirstOrDefaultAsync<Usuario>(sql, new { Correo = correo });
        }

        public async Task<Usuario?> GetByUsername(string username)
        {
            var db = dbConnection();
            var sqlr = @"SELECT id, username FROM usuario WHERE username = @Username LIMIT 1";
            return await db.QueryFirstOrDefaultAsync<Usuario>(sqlr, new { Username = username });
        }

        public async Task<bool> InsertUsuario(Usuario usuario)
        {
            string contrasenaPlana = GenerarContrasena();
            string contrasenaHash = BCrypt.Net.BCrypt.HashPassword(contrasenaPlana);
            usuario.Contrasena = contrasenaHash;

            var db = dbConnection();
            var sql = @"INSERT INTO usuario
                            (nombre, apellido, username, rol, correo, contrasena, estado)
                        VALUES
                            (@Nombre, @Apellido, @Username, @Rol, @Correo, @Contrasena, @Estado)";

            var result = await db.ExecuteAsync(sql, usuario);

            if (result > 0)
            {
                await _emailService.EnviarCredenciales(
                    destinatario: usuario.Correo,
                    nombre: $"{usuario.Nombre} {usuario.Apellido}",
                    username: usuario.Username,
                    contrasena: contrasenaPlana
                );
            }

            return result > 0;
        }

        public async Task<bool> UpdateUsuario(Usuario usuario)
        {
            var db = dbConnection();
            var sql = @"UPDATE usuario
                        SET nombre    = @Nombre,
                            apellido  = @Apellido,
                            username  = @Username,
                            rol       = @Rol,
                            correo    = @Correo,
                            estado    = @Estado
                        WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, usuario);
            return result > 0;
        }

        public async Task<bool> CambiarEstado(int id, bool estado)
        {
            var db = dbConnection();
            var sql = @"UPDATE usuario SET estado = @Estado WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, new { Estado = estado, Id = id });
            return result > 0;
        }

        public async Task<bool> DeleteUsuario(Usuario usuario)
        {
            var db = dbConnection();
            var sql = @"DELETE FROM usuario WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, new { usuario.Id });
            return result > 0;
        }

        private static string GenerarContrasena(int longitud = 10)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
            var random = new Random();
            return new string(Enumerable.Range(0, longitud)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
        }
        public async Task<bool> ActualizarContrasena(int id, string contrasenaHash)
        {
            var db = dbConnection();
            var sql = @"UPDATE usuario
                SET contrasena = @Contrasena
                WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new
            {
                Id = id,
                Contrasena = contrasenaHash
            });

            return result > 0;
        }

    }
}