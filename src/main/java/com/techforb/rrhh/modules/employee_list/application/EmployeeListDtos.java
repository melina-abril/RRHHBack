package com.techforb.rrhh.modules.employee_list.application;

import java.time.LocalDate;

public class EmployeeListDtos {

  /**
   * Filtros de búsqueda y página para listado de colaboradores.
   */
  public record EmployeeListFilterRequest(
      String search, // nombre, apellido o legajo
      String categoria, // Permanente | Pasante
      String cliente,
      String proyecto,
      String estado // Activo | De licencia | Egresado
  ) {}

  /**
   * Resumen de colaborador en el listado.
   */
  public record EmployeeListItemSummary(
      String legajo,
      String nombre,
      String apellido,
      LocalDate fechaNacimiento,
      String categoria,
      String estado,
      String sector,
      String puesto,
      String descripcionRol,
      String cliente,
      String proyecto
  ) {}
}
