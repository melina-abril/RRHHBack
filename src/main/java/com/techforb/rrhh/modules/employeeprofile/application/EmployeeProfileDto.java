package com.techforb.rrhh.modules.employeeprofile.application;

import java.time.LocalDate;

public record EmployeeProfileDto(
        String legajo,
        String nombre,
        String apellido,
        LocalDate fechaNacimiento,
        String paisResidencia,
        String correoPersonal,
        LocalDate fechaIngreso,
        String categoria,
        String dedicacion,
        String modalidadTrabajo,
        String rolLaboral,
        String estado,
        String cliente,
        String proyecto,
        String referente,
        String datosCorporativos
) {
}
