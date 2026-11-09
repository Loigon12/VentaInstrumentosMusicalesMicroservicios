package com.example.POCEmpleado.repository;

import com.example.POCEmpleado.model.Instrumento;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstrumentoRepository extends MongoRepository<Instrumento, String> {

    // "codigo" es el id de negocio; el ObjectId (_id) lo maneja MongoDB
    Optional<Instrumento> findByCodigo(int codigo);

    boolean existsByCodigo(int codigo);

    void deleteByCodigo(int codigo);
}
