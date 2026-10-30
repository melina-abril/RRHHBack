package com.techforb.app.modules.employees.api;

import com.techforb.app.modules.employees.application.EmployeeService;
import com.techforb.app.modules.employees.application.dto.CreateEmployeeRequest;
import com.techforb.app.modules.employees.application.dto.EmployeeResponse;
import com.techforb.app.modules.employees.application.dto.UpdateEmployeeRequest;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeState;
import com.techforb.app.shared.web.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Gestión de empleados")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista paginada de colaboradores con filtros por nombre, legajo, categoría, cliente, proyecto y estado")
    public PageResponse<EmployeeResponse> listEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String legajo,
            @RequestParam(required = false) EmployeeCategory category,
            @RequestParam(required = false) String client,
            @RequestParam(required = false) String project,
            @RequestParam(required = false) EmployeeState state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.listEmployees(search, legajo, category, client, project, state, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene la ficha individual de un colaborador seleccionado, con datos agrupados")
    public EmployeeResponse getEmployee(@PathVariable String id) {
        return service.getEmployee(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Da de alta un nuevo colaborador, genera legajo único y lo registra como activo")
    public EmployeeResponse createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        return service.createEmployee(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edita los datos personales y laborales del colaborador")
    public EmployeeResponse updateEmployee(@PathVariable String id, @Valid @RequestBody UpdateEmployeeRequest request) {
        return service.updateEmployee(id, request);
    }

    @PostMapping("/{id}/leave")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Registra egreso de colaborador, lo marca como inactivo y conserva la ficha")
    public void leaveEmployee(@PathVariable String id) {
        service.leaveEmployee(id);
    }

    @PostMapping("/{id}/rejoin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registra el reingreso de un colaborador con legajo existente, crea nuevo período laboral")
    public EmployeeResponse rejoinEmployee(@PathVariable String id) {
        return service.rejoinEmployee(id);
    }
}
