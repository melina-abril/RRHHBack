package com.techforb.app.modules.employees.application.dto;

import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeWorkMode;
import com.techforb.app.modules.employees.domain.EmployeeDedication;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateEmployeeRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 60, message = "El nombre puede tener hasta 60 caracteres.")
        String firstName,

        @NotBlank(message = "El apellido es obligatorio.")
        @Size(max = 60, message = "El apellido puede tener hasta 60 caracteres.")
        String lastName,

        @NotBlank(message = "El tipo de documento es obligatorio.")
        @Size(max = 10, message = "El tipo de documento puede tener hasta 10 caracteres.")
        String documentType,

        @NotBlank(message = "El número de documento es obligatorio.")
        @Size(max = 30, message = "El número de documento puede tener hasta 30 caracteres.")
        String documentNumber,

        @NotBlank(message = "El país de residencia es obligatorio.")
        String country,

        @NotNull(message = "La fecha de nacimiento es obligatoria.")
        LocalDate birthDate,

        @NotBlank(message = "El correo personal es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        String personalEmail,

        @NotBlank(message = "El teléfono es obligatorio.")
        @Pattern(regexp = "^[+\d][\d -]+$", message = "El teléfono tiene un formato inválido.")
        @Size(max = 20, message = "El teléfono puede tener hasta 20 caracteres.")
        String phoneNumber,

        @NotBlank(message = "La dirección es obligatoria.")
        @Size(max = 150, message = "La dirección puede tener hasta 150 caracteres.")
        String address,

        @NotBlank(message = "La ciudad es obligatoria.")
        @Size(max = 60, message = "La ciudad puede tener hasta 60 caracteres.")
        String city,

        @NotBlank(message = "El código postal es obligatorio.")
        @Size(max = 20, message = "El código postal puede tener hasta 20 caracteres.")
        String zipCode,

        @NotNull(message = "La categoría interna es obligatoria.")
        EmployeeCategory category,

        @NotNull(message = "La modalidad de trabajo es obligatoria.")
        EmployeeWorkMode workMode,

        @NotNull(message = "La dedicación es obligatoria.")
        EmployeeDedication dedication,

        @NotBlank(message = "El rol laboral es obligatorio.")
        @Size(max = 60, message = "El rol puede tener hasta 60 caracteres.")
        String role,

        @NotNull(message = "La fecha de ingreso es obligatoria.")
        LocalDate joinDate,

        @Size(max = 100, message = "El cliente puede tener hasta 100 caracteres.")
        String client,

        @Size(max = 100, message = "El proyecto puede tener hasta 100 caracteres.")
        String project
) {}
