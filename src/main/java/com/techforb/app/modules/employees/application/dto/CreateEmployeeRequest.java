package com.techforb.app.modules.employees.application.dto;

import com.techforb.app.modules.employees.domain.EmployeeCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Body del alta de colaborador: lo que pide el sistema en la carga inicial. Valida duplicados por email. */
public record CreateEmployeeRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 50, message = "El nombre puede tener hasta 50 caracteres.")
        String firstName,
        @NotBlank(message = "El apellido es obligatorio.")
        @Size(max = 50, message = "El apellido puede tener hasta 50 caracteres.")
        String lastName,
        @NotBlank(message = "El correo personal es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        String email,
        @NotNull(message = "La categoría es obligatoria.")
        EmployeeCategory category,
        @NotBlank(message = "El país de residencia es obligatorio.")
        @Size(min = 2, max = 2, message = "El país debe ser el código ISO de 2 letras.")
        String countryCode,
        @NotBlank(message = "La ciudad de residencia es obligatoria.")
        @Size(max = 60, message = "La ciudad puede tener hasta 60 caracteres.")
        String city,
        @NotBlank(message = "La fecha de ingreso es obligatoria.")
        String entryDate,
        @NotBlank(message = "El puesto es obligatorio.")
        @Size(max = 100, message = "El puesto puede tener hasta 100 caracteres.")
        String position,
        List<String> clients,
        List<String> projects
) {
}
