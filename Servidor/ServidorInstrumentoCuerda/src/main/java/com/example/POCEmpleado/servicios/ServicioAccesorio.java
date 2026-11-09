package com.example.POCEmpleado.servicios;

import com.example.POCEmpleado.model.AccesorioCuerda;
import com.example.POCEmpleado.model.AccesorioInput;
import com.example.POCEmpleado.model.Instrumento;
import com.example.POCEmpleado.repository.AccesorioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class ServicioAccesorio {

    private final AccesorioRepository accesorioRepository;
    private final ServicioInstrumento servicioInstrumento;

    public ServicioAccesorio(AccesorioRepository accesorioRepository,
                             ServicioInstrumento servicioInstrumento) {
        this.accesorioRepository = accesorioRepository;
        this.servicioInstrumento = servicioInstrumento;
    }

    public List<AccesorioCuerda> listAccesorio() {
        return accesorioRepository.findAll();
    }

    public List<AccesorioCuerda> listarPorInstrumento(int idInstrumento) {
        return accesorioRepository.findByIdInstrumento(idInstrumento);
    }

    public Optional<AccesorioCuerda> buscarAccesorioPorCodigo(int codigo) {
        return accesorioRepository.findByCodigo(codigo);
    }

    public Optional<AccesorioCuerda> addAccesorio(AccesorioInput input) throws Exception {
        if (accesorioRepository.existsByCodigo(input.id())) {
            throw new Exception("Ya existe un accesorio registrado con el ID " + input.id());
        }
        Optional<Instrumento> instrumento = servicioInstrumento.buscarPorCodigo(input.idInstrumento());
        if (instrumento.isEmpty()) {
            throw new Exception("No existe ningún instrumento con el ID " + input.idInstrumento());
        }

        AccesorioCuerda accesorio = new AccesorioCuerda(input.id(), input.nombre(), input.tipo(),
                input.precio(), input.marca(), input.idInstrumento());
        if (input.fechaRegistro() != null && !input.fechaRegistro().isBlank()) {
            accesorio.setFechaRegistro(LocalDateTime.parse(input.fechaRegistro()));
        }
        accesorio.setObjectIdInstrumento(instrumento.get().getObjectId());

        return Optional.of(accesorioRepository.insert(accesorio));
    }

    public Optional<AccesorioCuerda> delAccesorio(int codigo) throws Exception {
        Optional<AccesorioCuerda> accesorio = buscarAccesorioPorCodigo(codigo);
        if (accesorio.isEmpty()) {
            throw new Exception("No existe ningún accesorio con el ID " + codigo);
        }

        accesorioRepository.deleteByCodigo(codigo);

        return accesorio;
    }

    public Optional<AccesorioCuerda> editAccesorio(AccesorioInput input) throws Exception {
        Optional<AccesorioCuerda> actual = accesorioRepository.findByCodigo(input.id());
        if (actual.isEmpty()) {
            throw new Exception("No existe ningún accesorio con el ID " + input.id());
        }
        Optional<Instrumento> instrumento = servicioInstrumento.buscarPorCodigo(input.idInstrumento());
        if (instrumento.isEmpty()) {
            throw new Exception("No existe ningún instrumento con el ID " + input.idInstrumento());
        }

        AccesorioCuerda nuevo = new AccesorioCuerda(input.id(), input.nombre(), input.tipo(),
                input.precio(), input.marca(), input.idInstrumento());
        if (input.fechaRegistro() != null && !input.fechaRegistro().isBlank()) {
            nuevo.setFechaRegistro(LocalDateTime.parse(input.fechaRegistro()));
        } else {
            nuevo.setFechaRegistro(actual.get().getFechaRegistro());
        }
        // Si el accesorio se movió a otro instrumento, la referencia se actualiza al nuevo ObjectId
        nuevo.setObjectIdInstrumento(instrumento.get().getObjectId());

        // Se conserva el ObjectId (_id) del documento existente para reemplazarlo en lugar de crear otro
        nuevo.setObjectId(actual.get().getObjectId());

        return Optional.of(accesorioRepository.save(nuevo));
    }
}
