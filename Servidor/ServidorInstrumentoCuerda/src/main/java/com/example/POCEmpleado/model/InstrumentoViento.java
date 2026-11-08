package com.example.POCEmpleado.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "instrumentosViento")
public class InstrumentoViento {

    // _id de MongoDB: ObjectId generado automaticamente al insertar
    @Id
    private String objectId;

    // id de negocio: el que llega por GraphQL / cliente (se expone como "id" en el esquema)
    @Indexed(unique = true)
    private int codigo;
    private String nombre;
    private double precio;
    private LocalDate fechaVenta;
    private int numeroLlaves;
    private String tipoBoquilla;

    // Constructor sin argumentos: lo usa Spring Data para reconstruir el documento leído de MongoDB
    protected InstrumentoViento() {
    }

    public InstrumentoViento(int id, String nombre, double precio, LocalDate fechaVenta,
                             int numeroLlaves, String tipoBoquilla) throws Exception {
        setId(id);
        setNombre(nombre);
        setPrecio(precio);
        setFechaVenta(fechaVenta);
        setNumeroLlaves(numeroLlaves);
        setTipoBoquilla(tipoBoquilla);
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public int getId() {
        return codigo;
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
            throw new Exception("No se puede crear un instrumento de viento sin nombre.");
        }
        this.nombre = nombre.trim();
    }

    public double getPrecio() {
        return precio;
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

    public LocalDate getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDate fechaVenta) throws Exception {
        if (fechaVenta == null) {
            throw new Exception("No se puede crear un instrumento de viento sin fecha de venta.");
        }
        this.fechaVenta = fechaVenta;
    }

    public int getNumeroLlaves() {
        return numeroLlaves;
    }

    public void setNumeroLlaves(int numeroLlaves) throws Exception {
        if (numeroLlaves < 0) {
            throw new Exception("El número de llaves no puede ser negativo.");
        }
        this.numeroLlaves = numeroLlaves;
    }

    public String getTipoBoquilla() {
        return tipoBoquilla;
    }

    public void setTipoBoquilla(String tipoBoquilla) throws Exception {
        if (tipoBoquilla == null || tipoBoquilla.isBlank()) {
            throw new Exception("No se puede crear un instrumento de viento sin tipo de boquilla.");
        }
        this.tipoBoquilla = tipoBoquilla.trim();
    }
}
