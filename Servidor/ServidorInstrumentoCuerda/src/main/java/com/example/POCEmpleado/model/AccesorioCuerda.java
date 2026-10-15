package com.example.POCEmpleado.model;

public class AccesorioCuerda {

    public enum tipo {
        CUERDAPULSADA, CUERDAFROTADA
    }

    private int id;
    private String nombre;
    private tipo tipo;
    private double precio;
    private String marca;
    private int idInstrumento;

    public void setId(int id) throws Exception {
        if (id > 0) {
            this.id = id;
        } else {
            throw new Exception("Id menor a 0");
        }
    }

    public void setNombre(String nombre) throws Exception {
        if (nombre.isEmpty()) {
            throw new Exception("No se puede crear un Accesorio sin un nombre");
        } else {
            this.nombre = nombre;
        }
    }

    public void setTipo(tipo tipo) {
        this.tipo = tipo;
    }

    public void setPrecio(double precio) throws Exception {
        if (precio > 0) {
            this.precio = precio;
        } else {
            throw new Exception("Precio menor o igual a 0");
        }
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public int getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public tipo getTipo() {
        return tipo;
    }

    public double getPrecio() {
        return precio;
    }

    public void setIdINstrumento(int idInstrumento) throws Exception {
        if (idInstrumento > 0) {
            this.idInstrumento = idInstrumento;
        } else {
            throw new Exception("Id menor a 0");
        }
    }

    public int getIdInstrumento() {
        return idInstrumento;
    }

    public AccesorioCuerda(int id, String nombre, tipo tipo, double precio, String marca, int idInstrumento) throws Exception {
        setId(id);
        setIdINstrumento(idInstrumento);
        setNombre(nombre);
        this.tipo = tipo;
        setPrecio(precio);
        this.marca = marca;
    }

    public String getMarca() {
        return marca;
    }
}
