package com.example.servidorproveedores.service;

import com.example.servidorproveedores.exception.InstrumentosServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;

@Component
public class InstrumentoCatalogClient {
    private static final String QUERY = """
            query ($codigo: Int!) {
              instrumentoPorCodigo(codigo: $codigo) { id objectId }
              instrumentoVientoPorCodigo(codigo: $codigo) { id objectId }
            }
            """;

    private final RestClient restClient;

    public InstrumentoCatalogClient(@Value("${app.instrumentos.url:http://localhost:8081/graphql}") String endpoint) {
        this.restClient = RestClient.builder().baseUrl(endpoint).build();
    }

    /**
     * Devuelve el ObjectId (_id de MongoDB) del instrumento con ese ID de negocio.
     * Busca primero entre los instrumentos de cuerda y, si no está, entre los de viento.
     * Devuelve vacío si no existe en ninguno de los dos.
     */
    @SuppressWarnings("unchecked")
    public Optional<String> buscarObjectIdPorId(int idInstrumento) {
        Map<String, Object> response;
        try {
            response = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("query", QUERY, "variables", Map.of("codigo", idInstrumento)))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException exception) {
            throw new InstrumentosServiceUnavailableException(
                    "No fue posible validar el instrumento. Intente de nuevo más tarde.", exception);
        }

        Map<String, Object> data = response == null ? null : (Map<String, Object>) response.get("data");
        Object errors = response == null ? null : response.get("errors");
        boolean hayErrores = errors instanceof Collection<?> lista && !lista.isEmpty();
        if (data == null
                || hayErrores
                || !data.containsKey("instrumentoPorCodigo")
                || !data.containsKey("instrumentoVientoPorCodigo")) {
            throw respuestaInvalida();
        }

        Object instrumento = data.get("instrumentoPorCodigo") != null
                ? data.get("instrumentoPorCodigo")
                : data.get("instrumentoVientoPorCodigo");
        if (instrumento == null) {
            return Optional.empty();
        }

        Object objectId = instrumento instanceof Map<?, ?> campos ? campos.get("objectId") : null;
        if (objectId == null || objectId.toString().isBlank()) {
            throw respuestaInvalida();
        }
        return Optional.of(objectId.toString());
    }

    private InstrumentosServiceUnavailableException respuestaInvalida() {
        return new InstrumentosServiceUnavailableException(
                "El servicio de instrumentos devolvió una respuesta inválida.");
    }
}
