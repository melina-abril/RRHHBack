package com.techforb.rrhh.modules.employeeedition.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * DTO para editar los campos permitidos de un colaborador.
 */
public record UpdateEmployeeRequest(
    @NotBlank String nombre,
    @NotBlank String apellido,
    @NotNull LocalDate fechaNacimiento,
    @NotBlank String paisResidencia,
    @NotBlank @Email String correoPersonal,
    @NotBlank String dedicacion,
    @NotBlank String modalidadTrabajo,
    @NotBlank String rolLaboral,
    String categoria // editable dependiendo de reglas de negocio
){}
