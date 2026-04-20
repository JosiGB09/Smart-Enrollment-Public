using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models.Encargados;

namespace SmartEnrollment_Api.Repositories
{
    public class EncargadoRepository : IEncargadoRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public EncargadoRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection() => new MySqlConnection(_connectionString.ConnectionString);

        // Los encargados por estudiante ahora los maneja EncargadoEstudianteRepository
        public async Task<List<Encargado>> GetAllEncargados()
        {
            var db = dbConnection();
            var sql = @"SELECT
                            id,
                            nombre,
                            apellido,
                            cedula,
                            nacionalidad,
                            telefono,
                            estadoCivil,
                            ocupacion,
                            direccion
                        FROM encargado";
            var result = await db.QueryAsync<Encargado>(sql);
            return result.ToList();
        }

        public async Task<Encargado?> GetEncargadoById(int id)
        {
            var db = dbConnection();
            var sql = @"SELECT
                            id,
                            nombre,
                            apellido,
                            cedula,
                            nacionalidad,
                            telefono,
                            estadoCivil,
                            ocupacion,
                            direccion
                        FROM encargado
                        WHERE id = @Id";
            return await db.QueryFirstOrDefaultAsync<Encargado>(sql, new { Id = id });
        }

        // Cédula es string, no int
        public async Task<Encargado?> GetEncargadoByCedula(string cedula)
        {
            var db = dbConnection();
            var sql = @"SELECT
                            id,
                            nombre,
                            apellido,
                            cedula,
                            nacionalidad,
                            telefono,
                            estadoCivil,
                            ocupacion,
                            direccion
                        FROM encargado
                        WHERE cedula = @Cedula";
            return await db.QueryFirstOrDefaultAsync<Encargado>(sql, new { Cedula = cedula });
        }

        public async Task<bool> InsertEncargado(Encargado encargado)
        {
            var db = dbConnection();
            var sql = @"INSERT INTO encargado
                            (nombre, apellido, cedula, nacionalidad, telefono, estadoCivil, ocupacion, direccion)
                        VALUES
                            (@Nombre, @Apellido, @Cedula, @Nacionalidad, @Telefono, @EstadoCivil, @Ocupacion, @Direccion)";
            var result = await db.ExecuteAsync(sql, encargado);
            return result > 0;
        }

        public async Task<bool> UpdateEncargado(Encargado encargado)
        {
            var db = dbConnection();
            var sql = @"UPDATE encargado
                        SET nombre       = @Nombre,
                            apellido     = @Apellido,
                            cedula       = @Cedula,
                            nacionalidad = @Nacionalidad,
                            telefono     = @Telefono,
                            estadoCivil  = @EstadoCivil,
                            ocupacion    = @Ocupacion,
                            direccion    = @Direccion
                        WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, encargado);
            return result > 0;
        }

        public async Task<bool> DeleteEncargado(int id)
        {
            var db = dbConnection();
            var sql = @"DELETE FROM encargado WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }
    }
}