package com.example.servidorproveedores.repository;

import com.example.servidorproveedores.model.Proveedor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProveedorRepository extends MongoRepository<Proveedor, String> {
    Optional<Proveedor> findByCodigo(int codigo);
    Optional<Proveedor> findByNit(String nit);
    List<Proveedor> findByNombreContainingIgnoreCase(String nombre);
    boolean existsByCodigo(int codigo);
    boolean existsByNit(String nit);
}
