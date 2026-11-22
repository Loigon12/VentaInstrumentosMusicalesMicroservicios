package com.example.servidorproveedores.service;

import com.example.servidorproveedores.model.Proveedor;
import com.example.servidorproveedores.model.ProveedorRequest;
import com.example.servidorproveedores.repository.ProveedorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProveedorServiceTest {
    @Mock
    private ProveedorRepository repository;

    @Mock
    private InstrumentoCatalogClient instrumentoCatalogClient;

    private static final String OBJECT_ID = "64b7f0c2e4b0a1b2c3d4e5f6";

    private ProveedorService service;

    @BeforeEach
    void setUp() {
        service = new ProveedorService(repository, instrumentoCatalogClient);
    }

    @Test
    void actualizarRechazaIdDeInstrumentoInexistenteSinGuardar() {
        Proveedor actual = new Proveedor(request(1, 25));
        when(repository.findByCodigo(1)).thenReturn(Optional.of(actual));
        when(instrumentoCatalogClient.buscarObjectIdPorId(99)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.actualizar(1, request(1, 99)));

        assertEquals(25, actual.getIdInstrumento());
        verify(repository, never()).save(any(Proveedor.class));
    }

    @Test
    void actualizarAceptaIdDeInstrumentoExistente() {
        Proveedor actual = new Proveedor(request(1, 25));
        when(repository.findByCodigo(1)).thenReturn(Optional.of(actual));
        when(instrumentoCatalogClient.buscarObjectIdPorId(30)).thenReturn(Optional.of(OBJECT_ID));
        when(repository.save(any(Proveedor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Proveedor actualizado = service.actualizar(1, request(1, 30));

        assertEquals(30, actualizado.getIdInstrumento());
        assertEquals(OBJECT_ID, actualizado.getObjectIdInstrumento());
    }

    @Test
    void crearGuardaElObjectIdDelInstrumento() {
        when(instrumentoCatalogClient.buscarObjectIdPorId(25)).thenReturn(Optional.of(OBJECT_ID));
        when(repository.insert(any(Proveedor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Proveedor creado = service.crear(request(1, 25));

        assertEquals(25, creado.getIdInstrumento());
        assertEquals(OBJECT_ID, creado.getObjectIdInstrumento());
    }

    @Test
    void crearRechazaIdDeInstrumentoInexistenteSinGuardar() {
        when(instrumentoCatalogClient.buscarObjectIdPorId(99)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.crear(request(1, 99)));

        verify(repository, never()).insert(any(Proveedor.class));
    }

    private ProveedorRequest request(int codigo, int idInstrumento) {
        return new ProveedorRequest(codigo, "Proveedor", "123", "correo@example.com",
                "1234567", "Dirección", idInstrumento);
    }
}
