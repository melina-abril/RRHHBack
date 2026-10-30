package com.techforb.rrhh.modules.auth.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() { }

    // DTO para el request de login
    public record LoginRequest(
            @NotBlank(message = "El email es obligatorio.")
            @Email(message = "Debe ingresar un email válido.")
            String email,

            @NotBlank(message = "La contraseña es obligatoria.")
            String password
    ) {}

    // DTO de respuesta de sesión
    public record SesionResponse(
            UUID id,
            String nombre,
            String email,
            String rol,
            UUID organizacionId,
            String jwt // JWT sólo se expone en login, no en /me
    ) {
        public SesionResponse withoutJwt() {
            return new SesionResponse(id, nombre, email, rol, organizacionId, null);
        }
    }
}
