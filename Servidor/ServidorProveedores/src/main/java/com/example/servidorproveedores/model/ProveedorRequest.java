package com.example.servidorproveedores.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProveedorRequest(
        @NotNull @Positive Integer codigo,
        @NotBlank @Size(max = 120) String nombre,
        @NotBlank @Size(max = 30) String nit,
        @NotBlank @Email @Size(max = 150) String correo,
        @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "debe contener entre 7 y 15 dígitos, opcionalmente con + al inicio") String telefono,
        @Size(max = 200) String direccion,
        @NotNull @Positive Integer idInstrumento
) { }
