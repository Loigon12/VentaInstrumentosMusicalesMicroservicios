package com.example.POCEmpleado.model;

public record InstrumentoInput(int id,
                               String nombre,
                               double precio,
                               String fechaVenta,
                               int numeroCuerdas,
                               int numeroTrastes) {
}
