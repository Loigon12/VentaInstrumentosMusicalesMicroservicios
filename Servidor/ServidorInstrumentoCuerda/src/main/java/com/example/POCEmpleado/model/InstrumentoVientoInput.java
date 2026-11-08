package com.example.POCEmpleado.model;

public record InstrumentoVientoInput(int id,
                                     String nombre,
                                     double precio,
                                     String fechaVenta,
                                     int numeroLlaves,
                                     String tipoBoquilla) {
}
