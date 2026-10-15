package com.example.POCEmpleado.controller;

import com.example.POCEmpleado.model.AccesorioCuerda;
import com.example.POCEmpleado.model.AccesorioInput;
import com.example.POCEmpleado.model.Instrumento;
import com.example.POCEmpleado.model.InstrumentoInput;
import com.example.POCEmpleado.servicios.ServicioAccesorio;
import com.example.POCEmpleado.servicios.ServicioInstrumento;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Controller
public class Controller {

    @QueryMapping
    public List<Instrumento> instrumento(@Argument String nombre, @Argument Double precioMaximo) {

        return ServicioInstrumento.listarInstrumentos(nombre, precioMaximo);
    }

    @QueryMapping
    public Optional<Instrumento> instrumentoPorCodigo(@Argument int codigo) {
        return ServicioInstrumento.buscarPorCodigo(codigo);
    }

    @MutationMapping
    public Optional<Instrumento> addInstrumento(@Argument("input") InstrumentoInput input) throws Exception {
        return ServicioInstrumento.addInstrumento(input);
    }

    @MutationMapping
    public Optional<Instrumento> delInstrumento(@Argument("input") int codigo) throws Exception {
        return ServicioInstrumento.delInstrumento(codigo);
    }

    @MutationMapping
    public Optional<Instrumento> editInstrumento(@Argument("input") InstrumentoInput ins) throws Exception {
        return ServicioInstrumento.editInstrumento(ins);
    }

    @QueryMapping
    public List<AccesorioCuerda> accesorio() {
        return ServicioAccesorio.listAccesorio();
    }

    @QueryMapping
    public Optional<AccesorioCuerda> accesorioPorCodigo(@Argument int codigo) {
        return ServicioAccesorio.buscarAccesorioPorCodigo(codigo);
    }

    @MutationMapping
    public Optional<AccesorioCuerda> addAccesorio(@Argument("input") AccesorioInput input) throws Exception {
        return ServicioAccesorio.addAccesorio(input);
    }

    @MutationMapping
    public Optional<AccesorioCuerda> delAccesorio(@Argument("input") int codigo) throws Exception {
        return ServicioAccesorio.delAccesorio(codigo);
    }

    @MutationMapping
    public Optional<AccesorioCuerda> editAccesorio(@Argument("input") AccesorioInput input) throws Exception {
        return ServicioAccesorio.editAccesorio(input);
    }
}
