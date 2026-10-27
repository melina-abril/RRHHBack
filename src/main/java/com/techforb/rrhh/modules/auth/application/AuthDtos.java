package com.techforb.rrhh.modules.auth.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record LoginRequest(
            @NotBlank(message = "El correo es requerido")
            @Email(message = "El correo debe ser válido")
            String email,
            @NotBlank(message = "La contraseña es requerida")
            String password
    ) {
    }

    /** Respuesta con datos de la sesión actual (usuario autenticado). */
    public record SesionResponse(
            String id,
            String nombre,
            String email,
            String rol,
            String organizacionId
    ) {
    }
}
