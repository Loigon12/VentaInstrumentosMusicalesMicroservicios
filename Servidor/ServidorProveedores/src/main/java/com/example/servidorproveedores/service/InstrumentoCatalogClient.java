package com.example.servidorproveedores.service;

import com.example.servidorproveedores.exception.InstrumentosServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;

import java.util.Map;

@Component
public class InstrumentoCatalogClient {
    private static final String QUERY = """
            query ($codigo: Int!) {
              instrumentoPorCodigo(codigo: $codigo) { id }
              instrumentoVientoPorCodigo(codigo: $codigo) { id }
            }
            """;

    private final RestClient restClient;

    public InstrumentoCatalogClient(@Value("${app.instrumentos.url:http://localhost:8081/graphql}") String endpoint) {
        this.restClient = RestClient.builder().baseUrl(endpoint).build();
    }

    public boolean existePorId(int idInstrumento) {
        JsonNode response;
        try {
            response = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("query", QUERY, "variables", Map.of("codigo", idInstrumento)))
                    .retrieve()
                    .body(JsonNode.class);
        } catch (RestClientException exception) {
            throw new InstrumentosServiceUnavailableException(
                    "No fue posible validar el instrumento. Intente de nuevo más tarde.", exception);
        }

        JsonNode data = response == null ? null : response.get("data");
        JsonNode errors = response == null ? null : response.get("errors");
        if (data == null || data.isNull()
                || errors != null && !errors.isEmpty()
                || !data.has("instrumentoPorCodigo")
                || !data.has("instrumentoVientoPorCodigo")) {
            throw new InstrumentosServiceUnavailableException(
                    "El servicio de instrumentos devolvió una respuesta inválida.");
        }

        return data.hasNonNull("instrumentoPorCodigo") || data.hasNonNull("instrumentoVientoPorCodigo");
    }
}
