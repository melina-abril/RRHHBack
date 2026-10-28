package com.techforb.rrhh.modules.employeeonboarding.api;

import com.techforb.rrhh.modules.employeeonboarding.application.CreateEmployeeRequest;
import com.techforb.rrhh.modules.employeeonboarding.application.EmployeeOnboardingService;
import com.techforb.rrhh.shared.domain.EmployeeDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para alta de colaborador.
 */
@RestController
@RequestMapping("/api/employee-onboarding")
public class EmployeeOnboardingController {

    private final EmployeeOnboardingService onboardingService;

    public EmployeeOnboardingController(EmployeeOnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PreAuthorize("hasRole('ADMIN_RRHH')")
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        EmployeeDto created = onboardingService.createEmployee(request);
        return ResponseEntity.ok(created);
    }
}
