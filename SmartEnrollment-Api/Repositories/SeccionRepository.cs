using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public class SeccionRepository : ISeccionRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public SeccionRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection() => new MySqlConnection(_connectionString.ConnectionString);

        public async Task<IEnumerable<Seccion>> GetAllSecciones()
        {
            var db = dbConnection();
            var sql = @"SELECT id, gradoId, nombre, capacidad FROM seccion";
            return await db.QueryAsync<Seccion>(sql);
        }

        public async Task<IEnumerable<Seccion>> GetSeccionesByGradoId(int gradoId)
        {
            var db = dbConnection();
            var sql = @"SELECT id, gradoId, nombre, capacidad 
                        FROM seccion
                        WHERE gradoId = @GradoId";
            return await db.QueryAsync<Seccion>(sql, new { GradoId = gradoId });
        }

        public async Task<Seccion?> GetSeccionById(int id)
        {
            var db = dbConnection();
            var sql = @"SELECT id, gradoId, nombre, capacidad 
                        FROM seccion
                        WHERE id = @Id";
            return await db.QueryFirstOrDefaultAsync<Seccion>(sql, new { Id = id });
        }

        public async Task<bool> InsertSeccion(Seccion seccion)
        {
            var db = dbConnection();
            var sql = @"INSERT INTO seccion (gradoId, nombre, capacidad)
                        VALUES (@GradoId, @Nombre, @Capacidad)";
            var result = await db.ExecuteAsync(sql, seccion);
            return result > 0;
        }

        public async Task<bool> UpdateSeccion(Seccion seccion)
        {
            var db = dbConnection();
            var sql = @"UPDATE seccion
                        SET nombre = @Nombre, capacidad = @Capacidad, gradoId = @GradoId
                        WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, seccion);
            return result > 0;
        }

        public async Task<bool> DeleteSeccion(int id)
        {
            var db = dbConnection();
            var sql = @"DELETE FROM seccion WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }
    }
}

