package com.example.POCEmpleado.servicios;

import com.example.POCEmpleado.model.Instrumento;
import com.example.POCEmpleado.model.InstrumentoInput;
import com.example.POCEmpleado.repository.AccesorioRepository;
import com.example.POCEmpleado.repository.InstrumentoRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ServicioInstrumento {

    private final InstrumentoRepository instrumentoRepository;
    private final AccesorioRepository accesorioRepository;
    private final MongoTemplate mongoTemplate;

    public ServicioInstrumento(InstrumentoRepository instrumentoRepository,
                               AccesorioRepository accesorioRepository,
                               MongoTemplate mongoTemplate) {
        this.instrumentoRepository = instrumentoRepository;
        this.accesorioRepository = accesorioRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Instrumento> listarInstrumentos() {
        return instrumentoRepository.findAll();
    }

    /**
     * Filtra directamente en MongoDB: nombre que contenga el texto (sin distinguir mayúsculas)
     * y precio menor o igual al máximo. Los filtros null o vacíos se ignoran.
     */
    public List<Instrumento> listarInstrumentos(String nombre, Double precioMaximo) {
        Query query = new Query();
        if (nombre != null && !nombre.isBlank()) {
            query.addCriteria(Criteria.where("nombre")
                    .regex(Pattern.compile(Pattern.quote(nombre), Pattern.CASE_INSENSITIVE)));
        }
        if (precioMaximo != null) {
            query.addCriteria(Criteria.where("precio").lte(precioMaximo));
        }
        return mongoTemplate.find(query, Instrumento.class);
    }

    public Optional<Instrumento> buscarPorCodigo(int codigo) {
        return instrumentoRepository.findByCodigo(codigo);
    }

    public Optional<Instrumento> addInstrumento(InstrumentoInput input) throws Exception {
        
        Instrumento ins = new Instrumento(input.id(), input.nombre(), input.precio(),
            LocalDate.parse(input.fechaVenta()), input.numeroCuerdas(), input.numeroTrastes());
        if (input.fechaRegistro() != null && !input.fechaRegistro().isBlank()) {
            ins.setFechaRegistro(LocalDateTime.parse(input.fechaRegistro()));
        }


        if (instrumentoRepository.existsByCodigo(input.id())) {
            throw new Exception("Ya existe un instrumento registrado con el ID " + input.id());
        }

        return Optional.of(instrumentoRepository.insert(ins));
    }

    public Optional<Instrumento> delInstrumento(int codigo) throws Exception {
        Optional<Instrumento> instrumento = buscarPorCodigo(codigo);
        if (instrumento.isEmpty()) {
            throw new Exception("No se ha encontrado ningun instrumento para eliminar");
        }

        // Los accesorios dependen del instrumento: se eliminan con él para no dejarlos huérfanos
        accesorioRepository.deleteByIdInstrumento(codigo);
        instrumentoRepository.deleteByCodigo(codigo);

        return instrumento;
    }

    public Optional<Instrumento> editInstrumento(InstrumentoInput ins) throws Exception {
        Optional<Instrumento> actual = instrumentoRepository.findByCodigo(ins.id());
        if (actual.isEmpty()) {
            throw new Exception("No se ha encontrado ningun instrumento para actualizar");
        }

        Instrumento nuevo = new Instrumento(ins.id(), ins.nombre(), ins.precio(),
                LocalDate.parse(ins.fechaVenta()), ins.numeroCuerdas(), ins.numeroTrastes());
        if (ins.fechaRegistro() != null && !ins.fechaRegistro().isBlank()) {
            nuevo.setFechaRegistro(LocalDateTime.parse(ins.fechaRegistro()));
        } else {
            nuevo.setFechaRegistro(actual.get().getFechaRegistro());
        }
        // Se conserva el ObjectId (_id) del documento existente para reemplazarlo en lugar de crear otro
        nuevo.setObjectId(actual.get().getObjectId());
        // Los accesorios viven en su propia colección y siguen enlazados por idInstrumento,
        // por lo que se conservan sin necesidad de copiarlos.

        return Optional.of(instrumentoRepository.save(nuevo));
    }
}
