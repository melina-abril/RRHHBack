package com.techforb.rrhh.modules.employeeedition.api;

import com.techforb.rrhh.modules.employeeedition.application.EmployeeEditionService;
import com.techforb.rrhh.modules.employeeedition.application.UpdateEmployeeRequest;
import com.techforb.rrhh.shared.domain.EmployeeDto;
import com.techforb.rrhh.shared.exception.BusinessException;
import com.techforb.rrhh.shared.exception.NotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller para edición de colaboradores.
 */
@RestController
@RequestMapping("/api/employee-edition")
public class EmployeeEditionController {
    private final EmployeeEditionService employeeEditionService;

    public EmployeeEditionController(EmployeeEditionService employeeEditionService) {
        this.employeeEditionService = employeeEditionService;
    }

    /**
     * Modifica los datos personales y laborales de un colaborador por su id.
     * @param id Identificador del colaborador (número de legajo o id interno)
     * @param request Información con los campos editables
     * @return ficha actualizada, o ProblemDetail si hay error
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody UpdateEmployeeRequest request
    ) {
        EmployeeDto updated = employeeEditionService.updateEmployee(id, request);
        return ResponseEntity.ok(updated);
    }
}
