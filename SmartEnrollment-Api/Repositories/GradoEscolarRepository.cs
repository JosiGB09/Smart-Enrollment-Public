using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public class GradoEscolarRepository : IGradoEscolarRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public GradoEscolarRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }

        public async Task<IEnumerable<GradoEscolar>> GetAllGrados()
        {
            var db = dbConnection();
            var sql = @"SELECT id, nombre, activo FROM GradoEscolar"; // <-- agregado activo
            return await db.QueryAsync<GradoEscolar>(sql);
        }

        public async Task<GradoEscolar?> GetGradoById(int id)
        {
            var db = dbConnection();
            var sql = @"SELECT id, nombre, activo FROM GradoEscolar WHERE id = @Id"; // <-- agregado activo
            return await db.QueryFirstOrDefaultAsync<GradoEscolar>(sql, new { Id = id });
        }



        public async Task<bool> InsertGrado(GradoEscolar grado)
        {
            var db = dbConnection();
            var sql = @"INSERT INTO GradoEscolar (nombre, activo)
                VALUES (@Nombre, @Activo)";
            var result = await db.ExecuteAsync(sql, grado);
            return result > 0;
        }

        public async Task<bool> UpdateGrado(GradoEscolar grado)
        {
            var db = dbConnection();
            var sql = @"UPDATE GradoEscolar
                SET nombre = @Nombre,
                    activo = @Activo
                WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, grado);
            return result > 0;
        }

        public async Task<bool> DeleteGrado(int id)
        {
            var db = dbConnection();

            var sql = @"DELETE FROM GradoEscolar WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }


    }
}
