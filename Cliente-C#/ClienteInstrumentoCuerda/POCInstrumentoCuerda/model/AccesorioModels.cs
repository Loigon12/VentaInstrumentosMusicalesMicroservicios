using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace POCInstrumentoCuerda.model
{
    public class Accesorio
    {
        [JsonPropertyName("id"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)] public int id { get; set; }
        [JsonPropertyName("nombre")] public string nombre { get; set; }
        [JsonPropertyName("tipo")] public string tipo { get; set; }
        [JsonPropertyName("precio")] public double precio { get; set; }
        [JsonPropertyName("marca")] public string marca { get; set; }
        [JsonPropertyName("idInstrumento"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)] public int idInstrumento { get; set; }
    }
    public class AccesorioInput
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string tipo { get; set; }
        public double precio { get; set; }
        public string marca { get; set; }
        public int idInstrumento { get; set; }
    }
    public class AccesorioQueryResponse
    {
        [JsonPropertyName("accesorio")] public List<Accesorio> accesorio { get; set; }
        [JsonPropertyName("accesorioPorCodigo")] public Accesorio accesorioPorCodigo { get; set; }
    }
    public class AccesorioMutationResponse
    {
        [JsonPropertyName("addAccesorio")] public Accesorio addAccesorio { get; set; }
        [JsonPropertyName("delAccesorio")] public Accesorio delAccesorio { get; set; }
        [JsonPropertyName("editAccesorio")] public Accesorio editAccesorio { get; set; }
    }
}
