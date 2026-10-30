package com.techforb.rrhh.modules.employee_list.api;

import com.techforb.rrhh.modules.employee_list.application.EmployeeListService;
import com.techforb.rrhh.modules.employee_list.application.EmployeeListDtos.EmployeeListFilterRequest;
import com.techforb.rrhh.modules.employee_list.application.EmployeeListDtos.EmployeeListItemSummary;
import com.techforb.rrhh.shared.domain.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/employee-list")
public class EmployeeListController {
  private final EmployeeListService employeeListService;

  public EmployeeListController(EmployeeListService employeeListService) {
    this.employeeListService = employeeListService;
  }

  /**
   * GET /api/employee-list
   * Devuelve el listado de colaboradores filtrados y paginados (legajo, datos personales, estado y asignaciones).
   * Filtros: búsqueda por nombre/legajo, categoría, cliente, proyecto, estado.
   *
   * Ejemplo de query:
   *   ?search=ana&categoria=Permanente&page=0&size=20
   */
  @GetMapping
  @PreAuthorize("hasRole('ADMIN_RRHH')")
  public ResponseEntity<PageResponse<EmployeeListItemSummary>> getEmployeeList(
      @RequestParam Optional<String> search,
      @RequestParam Optional<String> categoria,
      @RequestParam Optional<String> cliente,
      @RequestParam Optional<String> proyecto,
      @RequestParam Optional<String> estado,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "25") int size,
      @RequestParam(defaultValue = "lastName,firstName") String sort
  ) {
    EmployeeListFilterRequest filter = new EmployeeListFilterRequest(
      search.orElse(null),
      categoria.orElse(null),
      cliente.orElse(null),
      proyecto.orElse(null),
      estado.orElse(null)
    );
    // Permite ordenar por múltiples campos (ej. "estado,lastName")
    String[] sortFields = sort.split(",");
    Sort sorting = Sort.by(
      java.util.Arrays.stream(sortFields)
        .map(String::trim)
        .filter(f -> !f.isEmpty())
        .map(Sort.Order::asc)
        .toList()
    );
    Pageable pageable = PageRequest.of(page, size, sorting);
    return ResponseEntity.ok(employeeListService.getEmployeeList(filter, pageable));
  }
}
