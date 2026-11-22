package com.example.servidorproveedores.service;

import com.example.servidorproveedores.exception.DuplicateProveedorException;
import com.example.servidorproveedores.exception.ProveedorNotFoundException;
import com.example.servidorproveedores.model.Proveedor;
import com.example.servidorproveedores.model.ProveedorRequest;
import com.example.servidorproveedores.repository.ProveedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {
    private final ProveedorRepository repository;
    private final InstrumentoCatalogClient instrumentoCatalogClient;

    public ProveedorService(ProveedorRepository repository, InstrumentoCatalogClient instrumentoCatalogClient) {
        this.repository = repository;
        this.instrumentoCatalogClient = instrumentoCatalogClient;
    }

    public Proveedor crear(ProveedorRequest request) {
        String objectIdInstrumento = resolverObjectIdInstrumento(request.idInstrumento());
        if (repository.existsByCodigo(request.codigo())) {
            throw new DuplicateProveedorException("Ya existe un proveedor con el código " + request.codigo());
        }
        if (repository.existsByNit(request.nit().trim())) {
            throw new DuplicateProveedorException("Ya existe un proveedor con el NIT " + request.nit());
        }
        Proveedor proveedor = new Proveedor(request);
        proveedor.setObjectIdInstrumento(objectIdInstrumento);
        return repository.insert(proveedor);
    }

    public List<Proveedor> listar(String nombre) {
        if (nombre == null || nombre.isBlank()) return repository.findAll();
        return repository.findByNombreContainingIgnoreCase(nombre.trim());
    }

    public Proveedor buscarPorCodigo(int codigo) {
        return repository.findByCodigo(codigo)
                .orElseThrow(() -> new ProveedorNotFoundException("No existe un proveedor con el código " + codigo));
    }

    public Proveedor buscarPorNit(String nit) {
        return repository.findByNit(nit.trim())
                .orElseThrow(() -> new ProveedorNotFoundException("No existe un proveedor con el NIT " + nit));
    }

    public Proveedor actualizar(int codigo, ProveedorRequest request) {
        if (request.codigo() != codigo) {
            throw new IllegalArgumentException("El código del cuerpo debe coincidir con el código de la ruta");
        }
        Proveedor actual = buscarPorCodigo(codigo);
        if (!actual.getNit().equals(request.nit().trim()) && repository.existsByNit(request.nit().trim())) {
            throw new DuplicateProveedorException("Ya existe un proveedor con el NIT " + request.nit());
        }
        String objectIdInstrumento = resolverObjectIdInstrumento(request.idInstrumento());
        actual.actualizarDatos(request);
        // Si el proveedor pasó a otro instrumento, la referencia se actualiza a su ObjectId
        actual.setObjectIdInstrumento(objectIdInstrumento);
        return repository.save(actual);
    }

    private String resolverObjectIdInstrumento(int idInstrumento) {
        return instrumentoCatalogClient.buscarObjectIdPorId(idInstrumento)
                .orElseThrow(() -> new IllegalArgumentException("No existe un instrumento con el ID " + idInstrumento));
    }

    public void eliminar(int codigo) {
        repository.delete(buscarPorCodigo(codigo));
    }
}
