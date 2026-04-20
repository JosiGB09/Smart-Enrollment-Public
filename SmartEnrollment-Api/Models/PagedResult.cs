namespace SmartEnrollment_Api.Models
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int TotalRegistros { get; set; }
        public int PaginaActual { get; set; }
        public int TotalPaginas { get; set; }
    }
}
