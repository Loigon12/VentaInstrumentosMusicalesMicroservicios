package com.example.servidorproveedores.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "proveedores")
public class Proveedor {
    @Id
    private String objectId;
    @Indexed(unique = true)
    private int codigo;
    @Indexed(unique = true)
    private String nit;
    private String nombre;
    private String correo;
    private String telefono;
    private String direccion;
    private int idInstrumento;
    private LocalDateTime fechaRegistro;

    protected Proveedor() { }

    public Proveedor(ProveedorRequest request) {
        actualizarDatos(request);
        this.fechaRegistro = LocalDateTime.now();
    }

    public void actualizarDatos(ProveedorRequest request) {
        this.codigo = request.codigo();
        this.nit = request.nit().trim();
        this.nombre = request.nombre().trim();
        this.correo = request.correo().trim();
        this.telefono = request.telefono() == null ? null : request.telefono().trim();
        this.direccion = request.direccion() == null ? null : request.direccion().trim();
        this.idInstrumento = request.idInstrumento();
    }

    public String getObjectId() { return objectId; }
    public int getCodigo() { return codigo; }
    public String getNit() { return nit; }
    public String getNombre() { return nombre; }
    public String getCorreo() { return correo; }
    public String getTelefono() { return telefono; }
    public String getDireccion() { return direccion; }
    public int getIdInstrumento() { return idInstrumento; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
}
