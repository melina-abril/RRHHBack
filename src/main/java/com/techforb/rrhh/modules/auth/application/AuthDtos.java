package com.techforb.rrhh.modules.auth.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {

    public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo debe ser válido.")
        String email,
        @NotBlank(message = "La contraseña es obligatoria.")
        String password
    ) {
    }

    public record SesionResponse(
        String id,
        String email,
        String nombre,
        String rol,
        String organizacionId
    ) {
    }
}
