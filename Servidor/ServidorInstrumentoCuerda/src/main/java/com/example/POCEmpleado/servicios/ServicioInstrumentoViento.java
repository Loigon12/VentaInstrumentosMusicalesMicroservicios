package com.example.POCEmpleado.servicios;

import com.example.POCEmpleado.model.InstrumentoViento;
import com.example.POCEmpleado.model.InstrumentoVientoInput;
import com.example.POCEmpleado.repository.InstrumentoVientoRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ServicioInstrumentoViento {

    private final InstrumentoVientoRepository repository;
    private final MongoTemplate mongoTemplate;

    public ServicioInstrumentoViento(InstrumentoVientoRepository repository, MongoTemplate mongoTemplate) {
        this.repository = repository;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Filtra directamente en MongoDB: nombre que contenga el texto (sin distinguir mayúsculas)
     * y precio menor o igual al máximo. Los filtros null o vacíos se ignoran.
     */
    public List<InstrumentoViento> listarInstrumentos(String nombre, Double precioMaximo) {
        Query query = new Query();
        if (nombre != null && !nombre.isBlank()) {
            query.addCriteria(Criteria.where("nombre")
                    .regex(Pattern.compile(Pattern.quote(nombre), Pattern.CASE_INSENSITIVE)));
        }
        if (precioMaximo != null) {
            query.addCriteria(Criteria.where("precio").lte(precioMaximo));
        }
        return mongoTemplate.find(query, InstrumentoViento.class);
    }

    public Optional<InstrumentoViento> buscarPorCodigo(int codigo) {
        return repository.findByCodigo(codigo);
    }

    public Optional<InstrumentoViento> addInstrumento(InstrumentoVientoInput input) throws Exception {
        InstrumentoViento nuevo = construir(input);
        if (repository.existsByCodigo(input.id())) {
            throw new Exception("Ya existe un instrumento de viento registrado con el ID " + input.id() + ".");
        }
        return Optional.of(repository.insert(nuevo));
    }

    public Optional<InstrumentoViento> delInstrumento(int codigo) throws Exception {
        Optional<InstrumentoViento> instrumento = buscarPorCodigo(codigo);
        if (instrumento.isEmpty()) {
            throw new Exception("No se encontró ningún instrumento de viento con el ID " + codigo + " para eliminar.");
        }
        repository.deleteByCodigo(codigo);
        return instrumento;
    }

    public Optional<InstrumentoViento> editInstrumento(InstrumentoVientoInput input) throws Exception {
        InstrumentoViento nuevo = construir(input);
        Optional<InstrumentoViento> actual = repository.findByCodigo(input.id());
        if (actual.isEmpty()) {
            throw new Exception("No se encontró ningún instrumento de viento con el ID " + input.id() + " para actualizar.");
        }
        // Se conserva el ObjectId (_id) del documento existente para reemplazarlo en lugar de crear otro
        nuevo.setObjectId(actual.get().getObjectId());
        if (input.fechaRegistro() == null || input.fechaRegistro().isBlank()) {
            nuevo.setFechaRegistro(actual.get().getFechaRegistro());
        }
        return Optional.of(repository.save(nuevo));
    }

    private InstrumentoViento construir(InstrumentoVientoInput input) throws Exception {
        LocalDate fecha;
        try {
            fecha = LocalDate.parse(input.fechaVenta());
        } catch (DateTimeParseException | NullPointerException e) {
            throw new Exception("La fecha de venta no es válida. Use el formato AAAA-MM-DD.");
        }
        InstrumentoViento nuevo = new InstrumentoViento(input.id(), input.nombre(), input.precio(), fecha,
            input.numeroLlaves(), input.tipoBoquilla());
        if (input.fechaRegistro() != null && !input.fechaRegistro().isBlank()) {
            nuevo.setFechaRegistro(LocalDateTime.parse(input.fechaRegistro()));
        }
        return nuevo;
    }
}
