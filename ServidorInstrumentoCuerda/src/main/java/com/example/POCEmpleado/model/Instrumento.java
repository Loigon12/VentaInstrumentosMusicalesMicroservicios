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
        if (precio > 0) {
            this.precio = precio;
        } else {
            throw new Exception("Precio menor o igual a 0");
        }
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
        if (id > 0) {
            this.codigo = id;
        } else {
            throw new Exception("Id menor a 0");
        }
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) throws Exception {
        if (nombre.isEmpty()) {
            throw new Exception("No se puede crear un instrumento sin un nombre");
        } else {
            this.nombre = nombre;
        }
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
        if (numeroCuerdas > 0) {
            this.numeroCuerdas = numeroCuerdas;
        } else {
            throw new Exception("Numero de cuerdas menor o igual a 0");
        }
    }

    public int getNumeroTrastes() {
        return numeroTrastes;
    }

    public void setNumeroTrastes(int numeroTrastes) throws Exception {
        if (numeroTrastes >= 0) {
            this.numeroTrastes = numeroTrastes;
        } else {
            throw new Exception("Número de trastes menor a 0");
        }
    }
}
