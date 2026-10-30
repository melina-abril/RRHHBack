package com.techforb.rrhh.modules.employee_list.application;

import com.techforb.rrhh.modules.employee_list.application.EmployeeListDtos.EmployeeListFilterRequest;
import com.techforb.rrhh.modules.employee_list.application.EmployeeListDtos.EmployeeListItemSummary;
import com.techforb.rrhh.shared.domain.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeListService {

  public EmployeeListService() {}

  /**
   * Consulta el listado filtrando en memoria sobre un dataset dummy. Este método debe reemplazarse por persistencia real
   * cuando se implemente la integración con la base, siguiendo la convención de filtrado y paginado.
   */
  @Transactional(readOnly = true)
  public PageResponse<EmployeeListItemSummary> getEmployeeList(EmployeeListFilterRequest filter, Pageable pageable) {
    // Dummy dataset (esto debe ir a repositorio cuando se tenga persistencia)
    List<EmployeeListItemSummary> all = List.of(
      new EmployeeListItemSummary(
        "E-0001",
        "Ana",
        "Pérez",
        LocalDate.of(1990, 4, 2),
        "Permanente",
        "Activo",
        "Recursos Humanos",
        "Jefe de RRHH",
        "Planificación y organización de procesos administrativos.",
        "Techforb SA",
        "Proyecto Interno"
      ),
      new EmployeeListItemSummary(
        "E-0002",
        "Juan",
        "García",
        LocalDate.of(1986, 7, 18),
        "Pasante",
        "Activo",
        "Ingeniería",
        "Desarrollador/a",
        "Implementación de soluciones técnicas en proyectos fintech.",
        "Financiera Río",
        "App Banca Digital"
      ),
      new EmployeeListItemSummary(
        "E-0003",
        "Lucía",
        "Méndez",
        LocalDate.of(1994, 12, 3),
        "Permanente",
        "De licencia",
        "Ingeniería",
        "Líder Técnico",
        "Liderazgo de equipos técnicos y revisión de código.",
        "Techforb SA",
        "Proyecto Interno"
      ),
      new EmployeeListItemSummary(
        "E-0004",
        "Mario",
        "Vega",
        LocalDate.of(1982, 2, 20),
        "Permanente",
        "Egresado",
        "Ventas",
        "Gerente de Ventas",
        "Gestión comercial, contacto con clientes y generación de oportunidades.",
        "Importadora XYZ",
        "Expansión LATAM"
      )
    );
    // Filtros sobre los campos de ejemplo
    List<EmployeeListItemSummary> filtered = all.stream()
      .filter(e -> filter.search() == null ||
        e.legajo().equalsIgnoreCase(filter.search()) ||
        e.nombre().toLowerCase().contains(filter.search().toLowerCase()) ||
        e.apellido().toLowerCase().contains(filter.search().toLowerCase())
      )
      .filter(e -> filter.categoria() == null || e.categoria().equalsIgnoreCase(filter.categoria()))
      .filter(e -> filter.estado() == null || e.estado().equalsIgnoreCase(filter.estado()))
      .filter(e -> filter.cliente() == null || (e.cliente() != null && e.cliente().equalsIgnoreCase(filter.cliente())))
      .filter(e -> filter.proyecto() == null || (e.proyecto() != null && e.proyecto().equalsIgnoreCase(filter.proyecto())))
      .toList();
    // Paginado simulado
    int from = (int) pageable.getOffset();
    int to = Math.min(from + pageable.getPageSize(), filtered.size());
    List<EmployeeListItemSummary> content = from < filtered.size() ? filtered.subList(from, to) : List.of();
    return new PageResponse<>(content, pageable.getPageNumber(), pageable.getPageSize(), (long) filtered.size());
  }
}
