package com.example.POCEmpleado.repository;

import com.example.POCEmpleado.model.AccesorioCuerda;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccesorioRepository extends MongoRepository<AccesorioCuerda, String> {

    Optional<AccesorioCuerda> findByCodigo(int codigo);

    boolean existsByCodigo(int codigo);

    void deleteByCodigo(int codigo);

    List<AccesorioCuerda> findByIdInstrumento(int idInstrumento);

    void deleteByIdInstrumento(int idInstrumento);
}
