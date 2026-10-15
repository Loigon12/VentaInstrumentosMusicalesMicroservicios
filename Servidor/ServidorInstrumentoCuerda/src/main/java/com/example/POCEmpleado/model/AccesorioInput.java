package com.example.POCEmpleado.model;

public record AccesorioInput(int id,
                             String nombre,
                             AccesorioCuerda.tipo tipo,
                             double precio,
                             String marca,
                             int idInstrumento) {
}
