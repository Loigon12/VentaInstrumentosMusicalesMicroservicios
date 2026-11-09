package com.example.POCEmpleado.repository;

import com.example.POCEmpleado.model.InstrumentoViento;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstrumentoVientoRepository extends MongoRepository<InstrumentoViento, String> {

    // "codigo" es el id de negocio; el ObjectId (_id) lo maneja MongoDB
    Optional<InstrumentoViento> findByCodigo(int codigo);

    boolean existsByCodigo(int codigo);

    void deleteByCodigo(int codigo);
}
