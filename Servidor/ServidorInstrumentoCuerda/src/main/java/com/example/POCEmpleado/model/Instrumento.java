package com.example.POCEmpleado.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "instrumentos")
public class Instrumento {

    // _id de MongoDB: ObjectId generado automaticamente al insertar
    @Id
    private String objectId;

    // id de negocio: el que llega por GraphQL / cliente (se expone como "id" en el esquema)
    @Indexed(unique = true)
    private int codigo;
    private String nombre;
    private double precio;
    private LocalDate fechaVenta;
    private int numeroCuerdas;
    private int numeroTrastes;

    // Constructor sin argumentos: lo usa Spring Data para reconstruir el documento leído de MongoDB
    protected Instrumento() {
    }

    public Instrumento(int id, String nombre) throws Exception {
        setId(id);
        this.nombre = nombre;
    }

    public Instrumento(int id, String nombre, double precio, LocalDate fechaVenta, int numeroCuerdas, int numeroTrastes) throws Exception {
        this.codigo = id;
        this.nombre = nombre;
        setId(id);
        this.fechaVenta = fechaVenta;
        setNombre(nombre);
        setPrecio(precio);
        setNumeroCuerdas(numeroCuerdas);
        setNumeroTrastes(numeroTrastes);
    }

    public void setPrecio(double precio) throws Exception {
        if (precio < 0) {
            throw new Exception("El precio no puede ser negativo.");
        }
        if (precio == 0) {
            throw new Exception("El precio debe ser mayor que cero.");
        }
        this.precio = precio;
    }

    public double getPrecio() {
        return precio;
    }

    public int getId() {
        return codigo;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public void setId(int id) throws Exception {
        if (id < 0) {
            throw new Exception("El id no puede ser negativo.");
        }
        if (id == 0) {
            throw new Exception("El id debe ser mayor que cero.");
        }
        this.codigo = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) throws Exception {
        if (nombre == null || nombre.isBlank()) {
            throw new Exception("No se puede crear un instrumento sin nombre.");
        }
        this.nombre = nombre.trim();
    }

    public LocalDate getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDate fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public int getNumeroCuerdas() {
        return numeroCuerdas;
    }

    public void setNumeroCuerdas(int numeroCuerdas) throws Exception {
        if (numeroCuerdas < 0) {
            throw new Exception("El número de cuerdas no puede ser negativo.");
        }
        if (numeroCuerdas == 0) {
            throw new Exception("El número de cuerdas debe ser mayor que cero.");
        }
        this.numeroCuerdas = numeroCuerdas;
    }

    public int getNumeroTrastes() {
        return numeroTrastes;
    }

    public void setNumeroTrastes(int numeroTrastes) throws Exception {
        if (numeroTrastes < 0) {
            throw new Exception("El número de trastes no puede ser negativo.");
        }
        this.numeroTrastes = numeroTrastes;
    }
}
