using Dapper;
using MySql.Data.MySqlClient;
using SmartEnrollment_Api.Models.Encargados;

namespace SmartEnrollment_Api.Repositories
{
    public class EncargadoEstudianteRepository : IEncargadoEstudianteRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public EncargadoEstudianteRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }

        public async Task<IEnumerable<EncargadoEstudiante>> GetEncargadosByEstudiante(int estudianteId)
        {
            var db = dbConnection();
            var sql = @"
                SELECT
                    ee.estudianteId,
                    ee.encargadoId,
                    ee.parentesco,
                    ee.esEncargadoLegal,
                    e.id,
                    e.nombre,
                    e.apellido,
                    e.cedula,
                    e.telefono,
                    e.nacionalidad,
                    e.estadoCivil,
                    e.ocupacion,
                    e.direccion
                FROM encargadoestudiante ee
                INNER JOIN encargado e ON ee.encargadoId = e.id
                WHERE ee.estudianteId = @EstudianteId";

            // Multi-mapping: mapea la fila a EncargadoEstudiante + Encargado anidado
            var result = await db.QueryAsync<EncargadoEstudiante, Encargado, EncargadoEstudiante>(
                sql,
                (ee, encargado) =>
                {
                    ee.Encargado = encargado;
                    return ee;
                },
                new { EstudianteId = estudianteId },
                splitOn: "id"
            );

            return result;
        }

        public async Task<bool> InsertEncargadoEstudiante(EncargadoEstudiante encargadoEstudiante)
        {

            var db = dbConnection();


            Console.WriteLine($"EsEncargadoLegal: {encargadoEstudiante.EsEncargadoLegal}");
            Console.WriteLine($"EstudianteId: {encargadoEstudiante.EstudianteId}");
            Console.WriteLine($"EncargadoId: {encargadoEstudiante.EncargadoId}");
            

            // Validar que no exista ya un encargado legal para este estudiante
            if (encargadoEstudiante.EsEncargadoLegal)
            {
                var checkSql = @"
                    SELECT COUNT(*) FROM encargadoestudiante
                    WHERE estudianteId = @EstudianteId AND esEncargadoLegal = 1";

                var count = await db.ExecuteScalarAsync<int>(checkSql, new { encargadoEstudiante.EstudianteId });
                Console.WriteLine($"Count encargados legales existentes: {count}");
                if (count > 0) return false; // Ya existe un encargado legal
            }

            var sql = @"
                INSERT INTO encargadoestudiante
                    (estudianteId, encargadoId, parentesco, esEncargadoLegal)
                VALUES
                    (@EstudianteId, @EncargadoId, @Parentesco, @EsEncargadoLegal)";

            var result = await db.ExecuteAsync(sql, encargadoEstudiante);
            return result > 0;
        }

        public async Task<bool> UpdateEncargadoEstudiante(EncargadoEstudiante encargadoEstudiante)
        {
            var db = dbConnection();

            // Si se quiere marcar como legal, verificar que no haya otro
            if (encargadoEstudiante.EsEncargadoLegal)
            {
                var checkSql = @"
                    SELECT COUNT(*) FROM encargadoestudiante
                    WHERE estudianteId = @EstudianteId
                      AND esEncargadoLegal = 1
                      AND encargadoId != @EncargadoId";

                var count = await db.ExecuteScalarAsync<int>(checkSql, new
                {
                    encargadoEstudiante.EstudianteId,
                    encargadoEstudiante.EncargadoId
                });
                if (count > 0) return false; // Ya hay otro encargado legal
            }

            var sql = @"
                UPDATE encargadoestudiante
                SET parentesco      = @Parentesco,
                    esEncargadoLegal = @EsEncargadoLegal
                WHERE estudianteId = @EstudianteId
                  AND encargadoId  = @EncargadoId";

            var result = await db.ExecuteAsync(sql, encargadoEstudiante);
            return result > 0;
        }

        public async Task<bool> DeleteEncargadoEstudiante(int estudianteId, int encargadoId)
        {
            var db = dbConnection();
            var sql = @"
                DELETE FROM encargadoestudiante
                WHERE estudianteId = @EstudianteId
                  AND encargadoId  = @EncargadoId";

            var result = await db.ExecuteAsync(sql, new { EstudianteId = estudianteId, EncargadoId = encargadoId });
            return result > 0;
        }
    }
}