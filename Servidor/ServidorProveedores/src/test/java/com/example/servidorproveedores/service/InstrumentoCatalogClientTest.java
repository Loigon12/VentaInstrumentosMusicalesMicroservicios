package com.example.servidorproveedores.service;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class InstrumentoCatalogClientTest {
    private final AtomicReference<String> responseBody = new AtomicReference<>();
    private final AtomicReference<String> requestBody = new AtomicReference<>();
    private HttpServer server;
    private InstrumentoCatalogClient client;

    @BeforeEach
    void setUp() throws IOException {
        server = HttpServer.create(new InetSocketAddress("localhost", 0), 0);
        server.createContext("/graphql", exchange -> {
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] response = responseBody.get().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();
        client = new InstrumentoCatalogClient("http://localhost:" + server.getAddress().getPort() + "/graphql");
    }

    @AfterEach
    void tearDown() {
        server.stop(0);
    }

    @Test
    void devuelveElObjectIdDeUnInstrumentoDeViento() {
        responseBody.set("""
                {"data":{"instrumentoPorCodigo":null,"instrumentoVientoPorCodigo":{"id":"30","objectId":"64b7f0c2e4b0a1b2c3d4e5f6"}}}
                """);

        assertEquals(Optional.of("64b7f0c2e4b0a1b2c3d4e5f6"), client.buscarObjectIdPorId(30));
        assertTrue(requestBody.get().contains("instrumentoPorCodigo"));
        assertTrue(requestBody.get().contains("instrumentoVientoPorCodigo"));
        assertTrue(requestBody.get().contains("objectId"));
    }

    @Test
    void devuelveElObjectIdDeUnInstrumentoDeCuerda() {
        responseBody.set("""
                {"data":{"instrumentoPorCodigo":{"id":"25","objectId":"64b7f0c2e4b0a1b2c3d4e5aa"},"instrumentoVientoPorCodigo":null}}
                """);

        assertEquals(Optional.of("64b7f0c2e4b0a1b2c3d4e5aa"), client.buscarObjectIdPorId(25));
    }

    @Test
    void siElIdExisteEnAmbosTiposPrevaleceElDeCuerda() {
        responseBody.set("""
                {"data":{"instrumentoPorCodigo":{"id":"5","objectId":"64b7f0c2e4b0a1b2c3d4e5aa"},"instrumentoVientoPorCodigo":{"id":"5","objectId":"64b7f0c2e4b0a1b2c3d4e5bb"}}}
                """);

        assertEquals(Optional.of("64b7f0c2e4b0a1b2c3d4e5aa"), client.buscarObjectIdPorId(5));
    }

    @Test
    void devuelveVacioCuandoNoExisteEnNingunTipo() {
        responseBody.set("""
                {"data":{"instrumentoPorCodigo":null,"instrumentoVientoPorCodigo":null}}
                """);

        assertEquals(Optional.empty(), client.buscarObjectIdPorId(99));
    }
}
