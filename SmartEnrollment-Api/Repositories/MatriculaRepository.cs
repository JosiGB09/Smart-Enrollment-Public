using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public class MatriculaRepository : IMatriculaRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public MatriculaRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }

        public async Task<IEnumerable<Matricula>> GetAllMatriculas()
        {
            var db = dbConnection();

            var sql = @"SELECT 
                            id,
                            estudianteId,
                            gradoEscolarId,
                            usuarioId,
                            fecha
                        FROM matricula";

            return await db.QueryAsync<Matricula>(sql);
        }

        public async Task<Matricula?> GetMatriculaById(int id)
        {
            var db = dbConnection();

            var sql = @"SELECT 
                            id,
                            estudianteId,
                            gradoEscolarId,
                            usuarioId,
                            fecha
                        FROM matricula
                        WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<Matricula>(sql, new { Id = id });
        }

        public async Task<bool> InsertMatricula(Matricula matricula)
        {
            var db = dbConnection();

            var sql = @"INSERT INTO matricula
                        (estudianteId, gradoEscolarId, usuarioId, fecha)
                        VALUES
                        (@EstudianteId, @GradoEscolarId, @UsuarioId, @Fecha)";

            var result = await db.ExecuteAsync(sql, matricula);
            return result > 0;
        }

        public async Task<bool> UpdateMatricula(Matricula matricula)
        {
            var db = dbConnection();

            var sql = @"UPDATE matricula
                        SET estudianteId = @EstudianteId,
                            gradoEscolarId = @GradoEscolarId,
                            usuarioId = @UsuarioId,
                            fecha = @Fecha
                        WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, matricula);
            return result > 0;
        }

        public async Task<bool> DeleteMatricula(int id)
        {
            var db = dbConnection();

            var sql = @"DELETE FROM matricula WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }
    }
}
