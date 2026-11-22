package com.example.servidorproveedores.controller;

import com.example.servidorproveedores.model.Proveedor;
import com.example.servidorproveedores.model.ProveedorRequest;
import com.example.servidorproveedores.service.ProveedorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {
    private final ProveedorService service;

    public ProveedorController(ProveedorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Proveedor> crear(@Valid @RequestBody ProveedorRequest request) {
        Proveedor creado = service.crear(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{codigo}").buildAndExpand(creado.getCodigo()).toUri();
        return ResponseEntity.created(location).body(creado);
    }

    @GetMapping
    public List<Proveedor> listar(@RequestParam(required = false) String nombre) {
        return service.listar(nombre);
    }

    @GetMapping("/{codigo}")
    public Proveedor buscarPorCodigo(@PathVariable int codigo) {
        return service.buscarPorCodigo(codigo);
    }

    @GetMapping("/buscar")
    public Proveedor buscarPorNit(@RequestParam String nit) {
        return service.buscarPorNit(nit);
    }

    @PutMapping("/{codigo}")
    public Proveedor actualizar(@PathVariable int codigo, @Valid @RequestBody ProveedorRequest request) {
        return service.actualizar(codigo, request);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> eliminar(@PathVariable int codigo) {
        service.eliminar(codigo);
        return ResponseEntity.noContent().build();
    }
}
