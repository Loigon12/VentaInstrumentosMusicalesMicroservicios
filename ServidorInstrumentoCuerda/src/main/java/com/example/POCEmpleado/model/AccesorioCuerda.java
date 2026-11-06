package com.example.POCEmpleado.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "accesorios")
public class AccesorioCuerda {

    public enum tipo {
        CUERDAPULSADA, CUERDAFROTADA
    }

    // _id de MongoDB: ObjectId generado automaticamente al insertar
    @Id
    private String objectId;

    // id de negocio: el que llega por GraphQL / cliente (se expone como "id" en el esquema)
    @Indexed(unique = true)
    private int codigo;
    private String nombre;
    private tipo tipo;
    private double precio;
    private String marca;
    private int idInstrumento;

    // Referencia al _id (ObjectId) del instrumento al que pertenece el accesorio
    @Field(targetType = FieldType.OBJECT_ID)
    private String objectIdInstrumento;

    public void setId(int id) throws Exception {
        if (id > 0) {
            this.codigo = id;
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
        return codigo;
    }

    public String getObjectIdInstrumento() {
        return objectIdInstrumento;
    }

    public void setObjectIdInstrumento(String objectIdInstrumento) {
        this.objectIdInstrumento = objectIdInstrumento;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
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

    // Constructor sin argumentos: lo usa Spring Data para reconstruir el documento leído de MongoDB
    protected AccesorioCuerda() {
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
