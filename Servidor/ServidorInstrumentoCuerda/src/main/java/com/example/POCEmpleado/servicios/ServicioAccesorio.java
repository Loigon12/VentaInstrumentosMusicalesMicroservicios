package com.example.POCEmpleado.servicios;

import com.example.POCEmpleado.model.AccesorioCuerda;
import com.example.POCEmpleado.model.AccesorioInput;
import com.example.POCEmpleado.model.Instrumento;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ServicioAccesorio {

    private static List<AccesorioCuerda> accesorios = new ArrayList<>();

    public static List<AccesorioCuerda> listAccesorio() {
        return List.copyOf(accesorios);
    }

    public static Optional<AccesorioCuerda> buscarAccesorioPorCodigo(int codigo) {
        return accesorios.stream()
                .filter(e -> e.getId() == codigo)
                .findFirst();
    }

    public static Optional<AccesorioCuerda> addAccesorio(AccesorioInput input) throws Exception {
        if (buscarAccesorioPorCodigo(input.id()).isPresent()) {
            throw new Exception("Ya existe un accesorio registrado con el ID " + input.id());
        }

        Optional<Instrumento> instrumento = ServicioInstrumento.buscarPorCodigo(input.idInstrumento());
        if (instrumento.isEmpty()) {
            throw new Exception("No existe ningún instrumento con el ID " + input.idInstrumento());
        }

        AccesorioCuerda accesorio = new AccesorioCuerda(input.id(), input.nombre(), input.tipo(),
                input.precio(), input.marca(), input.idInstrumento());
        instrumento.get().addAccesorio(accesorio);
        accesorios.add(accesorio);

        return Optional.of(accesorio);
    }

    public static Optional<AccesorioCuerda> delAccesorio(int codigo) throws Exception {
        Optional<AccesorioCuerda> accesorio = buscarAccesorioPorCodigo(codigo);
        if (accesorio.isEmpty()) {
            throw new Exception("No existe ningún accesorio con el ID " + codigo);
        }

        Optional<Instrumento> instrumento = ServicioInstrumento.buscarPorCodigo(accesorio.get().getIdInstrumento());
        if (instrumento.isPresent()) {
            instrumento.get().delAccesorio(accesorio.get());
        }
        accesorios.remove(accesorio.get());

        return accesorio;
    }

    public static Optional<AccesorioCuerda> editAccesorio(AccesorioInput input) throws Exception {
        Optional<AccesorioCuerda> actual = buscarAccesorioPorCodigo(input.id());
        if (actual.isEmpty()) {
            throw new Exception("No existe ningún accesorio con el ID " + input.id());
        }

        Optional<Instrumento> instrumentoNuevo = ServicioInstrumento.buscarPorCodigo(input.idInstrumento());
        if (instrumentoNuevo.isEmpty()) {
            throw new Exception("No existe ningún instrumento con el ID " + input.idInstrumento());
        }

        AccesorioCuerda nuevo = new AccesorioCuerda(input.id(), input.nombre(), input.tipo(),
                input.precio(), input.marca(), input.idInstrumento());

        // Se retira el accesorio actual de su instrumento original (puede ser el mismo u otro)
        Optional<Instrumento> instrumentoActual = ServicioInstrumento.buscarPorCodigo(actual.get().getIdInstrumento());
        if (instrumentoActual.isPresent()) {
            instrumentoActual.get().delAccesorio(actual.get());
        }
        instrumentoNuevo.get().addAccesorio(nuevo);
        accesorios.set(accesorios.indexOf(actual.get()), nuevo);

        return Optional.of(nuevo);
    }
}
