package com.techforb.rrhh.shared.domain;

import java.time.LocalDate;

/**
 * DTO para intercambio de información de colaboradores entre módulos.
 */
public interface EmployeeDto {
    String legajo();
    String nombre();
    String apellido();
    LocalDate fechaNacimiento();
    String paisResidencia();
    String correoPersonal();
    LocalDate fechaIngreso();
    String categoria();
    String dedicacion();
    String modalidadTrabajo();
    String rolLaboral();
    String estado();
    String cliente(); // Opcional
    String proyecto(); // Opcional
    String referente(); // Opcional
    String datosCorporativos(); // Opcional
}
