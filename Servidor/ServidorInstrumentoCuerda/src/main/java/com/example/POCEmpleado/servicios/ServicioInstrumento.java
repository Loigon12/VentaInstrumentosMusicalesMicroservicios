package com.example.POCEmpleado.servicios;

import com.example.POCEmpleado.model.AccesorioCuerda;
import com.example.POCEmpleado.model.Instrumento;
import com.example.POCEmpleado.model.InstrumentoInput;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ServicioInstrumento {
    private static List<Instrumento> instrumentos = new ArrayList<>();

    public static List<Instrumento> listarInstrumentos() {
        return List.copyOf(instrumentos);
    }

    public static List<Instrumento> listarInstrumentos(String nombre, Double precioMaximo) {
        return instrumentos.stream()
                .filter(instrumento -> nombre == null || nombre.isBlank()
                        || instrumento.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .filter(instrumento -> precioMaximo == null || instrumento.getPrecio() <= precioMaximo)
                .toList();
    }

    public static Optional<Instrumento> buscarPorCodigo(int codigo) {
        return instrumentos.stream()
                .filter(e -> e.getId() == codigo)
                .findFirst();
    }

    public static Optional<Instrumento> addInstrumento(InstrumentoInput input) throws Exception {
        if (buscarPorCodigo(input.id()).isPresent()) {
            throw new Exception("Ya existe un instrumento registrado con el ID " + input.id());
        }
        Instrumento ins = new Instrumento(input.id(), input.nombre(), input.precio(),
                LocalDate.parse(input.fechaVenta()), input.numeroCuerdas(), input.numeroTrastes());
        instrumentos.add(ins);

        return Optional.of(ins);
    }

    public static Optional<Instrumento> delInstrumento(int codigo) throws Exception {
        Optional<Instrumento> instrumento = buscarPorCodigo(codigo);
        if (instrumento.isEmpty()) {
            throw new Exception("No se ha encontrado ningun instrumento para eliminar");
        }

        Instrumento ins = instrumento.get();
        // Los accesorios dependen del instrumento: se eliminan con él para no dejarlos huérfanos
        for (AccesorioCuerda accesorio : List.copyOf(ins.getAccesorio())) {
            ServicioAccesorio.delAccesorio(accesorio.getId());
        }
        instrumentos.remove(ins);

        return Optional.of(ins);
    }

    public static Optional<Instrumento> editInstrumento(InstrumentoInput ins) throws Exception {
        Optional<Instrumento> actual = buscarPorCodigo(ins.id());
        if (actual.isEmpty()) {
            throw new Exception("No se ha encontrado ningun instrumento para actualizar");
        }

        Instrumento nuevo = new Instrumento(ins.id(), ins.nombre(), ins.precio(),
                LocalDate.parse(ins.fechaVenta()), ins.numeroCuerdas(), ins.numeroTrastes());
        // Se conservan los accesorios que ya tenía asignados
        for (AccesorioCuerda accesorio : actual.get().getAccesorio()) {
            nuevo.addAccesorio(accesorio);
        }
        instrumentos.set(instrumentos.indexOf(actual.get()), nuevo);

        return Optional.of(nuevo);
    }

}
