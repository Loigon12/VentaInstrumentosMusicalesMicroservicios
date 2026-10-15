package com.example.POCEmpleado.model;

import java.time.LocalDate;
import java.util.ArrayList;

public class Instrumento {

    private int id;
    private String nombre;
    private double precio;
    private LocalDate fechaVenta;
    private int numeroCuerdas;
    private int numeroTrastes;
    private ArrayList<AccesorioCuerda> accesorios = new ArrayList<>();

    public Instrumento(int id, String nombre) throws Exception {
        setId(id);
        this.nombre = nombre;
    }

    public Instrumento(int id, String nombre, double precio, LocalDate fechaVenta, int numeroCuerdas, int numeroTrastes) throws Exception {
        this.id = id;
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
        return id;
    }

    public void setId(int id) throws Exception {
        if (id > 0) {
            this.id = id;
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

    public void addAccesorio(AccesorioCuerda accesorio) {
        accesorios.add(accesorio);
    }

    public ArrayList<AccesorioCuerda> getAccesorio() {
        return accesorios;
    }

    public void delAccesorio(AccesorioCuerda accesorio) {
        accesorios.remove(accesorio);
    }
}
