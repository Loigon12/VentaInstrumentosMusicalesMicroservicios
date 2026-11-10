package com.example.POCEmpleado.controller;

import com.example.POCEmpleado.model.AccesorioCuerda;
import com.example.POCEmpleado.model.AccesorioInput;
import com.example.POCEmpleado.model.Instrumento;
import com.example.POCEmpleado.model.InstrumentoInput;
import com.example.POCEmpleado.model.InstrumentoViento;
import com.example.POCEmpleado.model.InstrumentoVientoInput;
import com.example.POCEmpleado.servicios.ServicioAccesorio;
import com.example.POCEmpleado.servicios.ServicioInstrumento;
import com.example.POCEmpleado.servicios.ServicioInstrumentoViento;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Controller
public class Controller {

    private final ServicioInstrumento servicioInstrumento;
    private final ServicioAccesorio servicioAccesorio;
    private final ServicioInstrumentoViento servicioViento;

    public Controller(ServicioInstrumento servicioInstrumento, ServicioAccesorio servicioAccesorio,
                      ServicioInstrumentoViento servicioViento) {
        this.servicioInstrumento = servicioInstrumento;
        this.servicioAccesorio = servicioAccesorio;
        this.servicioViento = servicioViento;
    }

    @QueryMapping
    public List<Instrumento> instrumento(@Argument String nombre, @Argument Double precioMaximo) {
        return servicioInstrumento.listarInstrumentos(nombre, precioMaximo);
    }

    @QueryMapping
    public Optional<Instrumento> instrumentoPorCodigo(@Argument int codigo) {
        return servicioInstrumento.buscarPorCodigo(codigo);
    }

    @QueryMapping
    public Optional<Instrumento> instrumentoConAccesorios(@Argument int codigo) {
        return servicioInstrumento.buscarPorCodigo(codigo);
    }

    @MutationMapping
    public Optional<Instrumento> addInstrumento(@Argument("input") InstrumentoInput input) throws Exception {
         try {
            return servicioInstrumento.addInstrumento(input);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error al adicionar el instrumento");
        }
    }

    @MutationMapping
    public Optional<Instrumento> delInstrumento(@Argument("input") int codigo) throws Exception {
        return servicioInstrumento.delInstrumento(codigo);
    }

    @MutationMapping
    public Optional<Instrumento> editInstrumento(@Argument("input") InstrumentoInput ins) throws Exception {
        return servicioInstrumento.editInstrumento(ins);
    }

    // Campo "accesorio" de Instrumento: se consulta en la colección de accesorios por idInstrumento
    @SchemaMapping(typeName = "Instrumento", field = "accesorio")
    public List<AccesorioCuerda> accesoriosDelInstrumento(Instrumento instrumento) {
        return servicioAccesorio.listarPorInstrumento(instrumento.getId());
    }

    @QueryMapping
    public List<AccesorioCuerda> accesorio() {
        return servicioAccesorio.listAccesorio();
    }

    @QueryMapping
    public Optional<AccesorioCuerda> accesorioPorCodigo(@Argument int codigo) {
        return servicioAccesorio.buscarAccesorioPorCodigo(codigo);
    }

    @MutationMapping
    public Optional<AccesorioCuerda> addAccesorio(@Argument("input") AccesorioInput input) throws Exception {
        return servicioAccesorio.addAccesorio(input);
    }

    @MutationMapping
    public Optional<AccesorioCuerda> delAccesorio(@Argument("input") int codigo) throws Exception {
        return servicioAccesorio.delAccesorio(codigo);
    }

    @MutationMapping
    public Optional<AccesorioCuerda> editAccesorio(@Argument("input") AccesorioInput input) throws Exception {
        return servicioAccesorio.editAccesorio(input);
    }

    // ---------------- Instrumentos de viento ----------------

    @QueryMapping
    public List<InstrumentoViento> instrumentoViento(@Argument String nombre, @Argument Double precioMaximo) {
        return servicioViento.listarInstrumentos(nombre, precioMaximo);
    }

    @QueryMapping
    public Optional<InstrumentoViento> instrumentoVientoPorCodigo(@Argument int codigo) {
        return servicioViento.buscarPorCodigo(codigo);
    }

    @MutationMapping
    public Optional<InstrumentoViento> addInstrumentoViento(@Argument("input") InstrumentoVientoInput input) throws Exception {
        return servicioViento.addInstrumento(input);
    }

    @MutationMapping
    public Optional<InstrumentoViento> delInstrumentoViento(@Argument("input") int codigo) throws Exception {
        return servicioViento.delInstrumento(codigo);
    }

    @MutationMapping
    public Optional<InstrumentoViento> editInstrumentoViento(@Argument("input") InstrumentoVientoInput input) throws Exception {
        return servicioViento.editInstrumento(input);
    }
}
