package com.techforb.app.modules.employees.api;

import com.techforb.app.modules.employees.application.EmployeeService;
import com.techforb.app.modules.employees.application.dto.CreateEmployeeRequest;
import com.techforb.app.modules.employees.application.dto.EmployeeDetailsResponse;
import com.techforb.app.modules.employees.application.dto.EmployeeListResponse;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeStatus;
import com.techforb.app.shared.web.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Solo HTTP: recibe, valida y delega en el service. Un método por servicio, coincide con el plan del módulo.
 */
@RestController
@RequestMapping("/api/employees")
@Tag(name = "Gestión de Empleados")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listado paginado con búsqueda y filtros por nombre, legajo, categoría, cliente, proyecto y estado")
    public PageResponse<EmployeeListResponse> listEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String legajo,
            @RequestParam(required = false) EmployeeCategory category,
            @RequestParam(required = false) String client,
            @RequestParam(required = false) String project,
            @RequestParam(required = false) EmployeeStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return service.listEmployees(search, legajo, category, client, project, status, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un colaborador: ficha individual")
    public EmployeeDetailsResponse getEmployeeDetails(@PathVariable String id) {
        return service.getEmployeeDetails(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Alta de colaborador")
    public EmployeeDetailsResponse createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        return service.createEmployee(request);
    }
}
