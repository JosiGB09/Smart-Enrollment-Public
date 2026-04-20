using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models;

namespace SmartEnrollment_Api.Repositories
{
    public class EstudianteRepository : IEstudianteRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public EstudianteRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection() => new MySqlConnection(_connectionString.ConnectionString);

        public async Task<IEnumerable<Estudiante>> GetAllEstudiantes()
        {
            var db = dbConnection();
            var sql = @"SELECT
                            id,
                            nombre,
                            apellido,
                            cedula,
                            nacionalidad,
                            fechaNacimiento,
                            sexo,
                            padecimientos,
                            hermanosEstudiantes,
                            vacunasCompletas,
                            beca,
                            traslado,
                            repitente,
                            gradoEscolarId
                        FROM estudiante";
            return await db.QueryAsync<Estudiante>(sql);
        }

        public async Task<Estudiante?> GetEstudianteById(int id)
        {
            var db = dbConnection();
            var sql = @"SELECT
                            id,
                            nombre,
                            apellido,
                            cedula,
                            nacionalidad,
                            fechaNacimiento,
                            sexo,
                            padecimientos,
                            hermanosEstudiantes,
                            vacunasCompletas,
                            beca,
                            traslado,
                            repitente,
                            gradoEscolarId
                        FROM estudiante
                        WHERE id = @Id";
            return await db.QueryFirstOrDefaultAsync<Estudiante>(sql, new { Id = id });
        }

        // Devuelve el ID generado por la BD, necesario para luego insertar en encargadoestudiante
        public async Task<int> InsertEstudiante(Estudiante estudiante)
        {
            var db = dbConnection();
            var sql = @"INSERT INTO estudiante
                            (nombre, apellido, cedula, nacionalidad,
                             fechaNacimiento, sexo, padecimientos, hermanosEstudiantes,
                             vacunasCompletas, beca, traslado, repitente, gradoEscolarId)
                        VALUES
                            (@Nombre, @Apellido, @Cedula, @Nacionalidad,
                             @FechaNacimiento, @Sexo, @Padecimientos, @HermanosEstudiantes,
                             @VacunasCompletas, @Beca, @Traslado, @Repitente, @GradoEscolarId);
                        SELECT LAST_INSERT_ID();";
            return await db.ExecuteScalarAsync<int>(sql, estudiante);
        }

        public async Task<bool> UpdateEstudiante(Estudiante estudiante)
        {
            var db = dbConnection();
            var sql = @"UPDATE estudiante
                        SET nombre               = @Nombre,
                            apellido             = @Apellido,
                            cedula               = @Cedula,
                            nacionalidad         = @Nacionalidad,
                            fechaNacimiento      = @FechaNacimiento,
                            sexo                 = @Sexo,
                            padecimientos        = @Padecimientos,
                            hermanosEstudiantes  = @HermanosEstudiantes,
                            vacunasCompletas     = @VacunasCompletas,
                            beca                 = @Beca,
                            traslado             = @Traslado,
                            repitente            = @Repitente,
                            gradoEscolarId       = @GradoEscolarId
                        WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, estudiante);
            return result > 0;
        }

        public async Task<bool> DeleteEstudiante(int id)
        {
            var db = dbConnection();
            var sql = @"DELETE FROM estudiante WHERE id = @Id";
            var result = await db.ExecuteAsync(sql, new { Id = id });
            return result > 0;
        }
    }
}