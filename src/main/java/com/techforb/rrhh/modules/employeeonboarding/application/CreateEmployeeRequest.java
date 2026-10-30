package com.techforb.rrhh.modules.employeeonboarding.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Request DTO para alta de colaborador (con los campos mínimos requeridos)
 */
public record CreateEmployeeRequest(
    @NotBlank String nombre,
    @NotBlank String apellido,
    @NotNull LocalDate fechaNacimiento,
    @NotBlank String paisResidencia,
    @NotBlank String correoPersonal,
    @NotNull LocalDate fechaIngreso,
    @NotBlank String categoria,
    @NotBlank String dedicacion,
    @NotBlank String modalidadTrabajo,
    @NotBlank String rolLaboral,
    String cliente, // Opcional
    String proyecto, // Opcional
    String referente, // Opcional
    String datosCorporativos // Opcional
) {}
