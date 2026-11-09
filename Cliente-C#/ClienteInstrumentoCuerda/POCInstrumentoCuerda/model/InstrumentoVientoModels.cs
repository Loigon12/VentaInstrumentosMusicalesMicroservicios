using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace POCInstrumentoCuerda.model
{
    public class InstrumentoViento
    {
        [JsonPropertyName("id"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)] public int id { get; set; }
        [JsonPropertyName("nombre")] public string nombre { get; set; }
        [JsonPropertyName("precio")] public double precio { get; set; }
        [JsonPropertyName("fechaVenta")] public string fechaVenta { get; set; }
        [JsonPropertyName("fechaRegistro")] public string fechaRegistro { get; set; }
        [JsonPropertyName("numeroLlaves")] public int numeroLlaves { get; set; }
        [JsonPropertyName("tipoBoquilla")] public string tipoBoquilla { get; set; }
    }

    public class InstrumentoVientoInput
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public double precio { get; set; }
        public string fechaVenta { get; set; }
        public int numeroLlaves { get; set; }
        public string tipoBoquilla { get; set; }
    }

    public class InstrumentoVientoQueryResponse
    {
        [JsonPropertyName("instrumentoViento")] public List<InstrumentoViento> instrumentoViento { get; set; }
        [JsonPropertyName("instrumentoVientoPorCodigo")] public InstrumentoViento instrumentoVientoPorCodigo { get; set; }
    }

    public class InstrumentoVientoMutationResponse
    {
        [JsonPropertyName("addInstrumentoViento")] public InstrumentoViento addInstrumentoViento { get; set; }
        [JsonPropertyName("delInstrumentoViento")] public InstrumentoViento delInstrumentoViento { get; set; }
        [JsonPropertyName("editInstrumentoViento")] public InstrumentoViento editInstrumentoViento { get; set; }
    }
}
