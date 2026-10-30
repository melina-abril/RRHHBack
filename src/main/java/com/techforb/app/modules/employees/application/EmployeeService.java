package com.techforb.app.modules.employees.application;

import com.techforb.app.modules.employees.application.dto.CreateEmployeeRequest;
import com.techforb.app.modules.employees.application.dto.EmployeeResponse;
import com.techforb.app.modules.employees.application.dto.UpdateEmployeeRequest;
import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeRepository;
import com.techforb.app.modules.employees.domain.EmployeeState;
import com.techforb.app.shared.error.BusinessRuleException;
import com.techforb.app.shared.error.ConflictException;
import com.techforb.app.shared.error.NotFoundException;
import com.techforb.app.shared.web.PageResponse;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final Clock clock;

    public EmployeeService(EmployeeRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    public PageResponse<EmployeeResponse> listEmployees(String search, String legajo, EmployeeCategory category, String client, String project, EmployeeState state, int page, int size) {
        String term = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        String legajoTerm = legajo == null ? "" : legajo.trim();
        String clientTerm = client == null ? "" : client.trim().toLowerCase(Locale.ROOT);
        String projectTerm = project == null ? "" : project.trim().toLowerCase(Locale.ROOT);

        List<Employee> filtered = repository.findAll().stream()
                .filter(e -> term.isEmpty() || e.getFullName().toLowerCase(Locale.ROOT).contains(term))
                .filter(e -> legajoTerm.isEmpty() || e.getLegajo().equalsIgnoreCase(legajoTerm))
                .filter(e -> category == null || e.getCategory() == category)
                .filter(e -> clientTerm.isEmpty() || (e.getClient() != null && e.getClient().toLowerCase(Locale.ROOT).contains(clientTerm)))
                .filter(e -> projectTerm.isEmpty() || (e.getProject() != null && e.getProject().toLowerCase(Locale.ROOT).contains(projectTerm)))
                .filter(e -> state == null || e.getState() == state)
                .toList();
        return PageResponse.of(filtered, page, size, EmployeeResponse::from);
    }

    public EmployeeResponse getEmployee(String id) {
        return EmployeeResponse.from(find(id));
    }

    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        assertUniqueIdentity(request.documentNumber(), request.country());
        String generatedLegajo = repository.generateNextLegajo();
        String id = UUID.randomUUID().toString();
        Instant now = Instant.now(clock);
        Employee employee = new Employee(
                id,
                generatedLegajo,
                request.firstName(),
                request.lastName(),
                request.documentType(),
                request.documentNumber(),
                request.country(),
                request.birthDate(),
                request.personalEmail(),
                request.phoneNumber(),
                request.address(),
                request.city(),
                request.zipCode(),
                request.category(),
                request.workMode(),
                request.dedication(),
                request.role(),
                request.joinDate(),
                EmployeeState.ACTIVE,
                request.client(),
                request.project(),
                now,
                now
        );
        return EmployeeResponse.from(repository.save(employee));
    }

    public EmployeeResponse updateEmployee(String id, UpdateEmployeeRequest request) {
        Employee employee = find(id);
        if (!employee.getDocumentNumber().equals(request.documentNumber()) || !employee.getCountry().equals(request.country())) {
            assertUniqueIdentity(request.documentNumber(), request.country());
        }
        employee.update(
                request.firstName(),
                request.lastName(),
                request.documentType(),
                request.documentNumber(),
                request.country(),
                request.birthDate(),
                request.personalEmail(),
                request.phoneNumber(),
                request.address(),
                request.city(),
                request.zipCode(),
                request.category(),
                request.workMode(),
                request.dedication(),
                request.role(),
                request.joinDate(),
                request.client(),
                request.project(),
                Instant.now(clock)
        );
        return EmployeeResponse.from(repository.save(employee));
    }

    public void leaveEmployee(String id) {
        Employee employee = find(id);
        if (employee.getState() == EmployeeState.INACTIVE) {
            throw new BusinessRuleException("EMPLOYEE_ALREADY_INACTIVE", "El colaborador ya se encuentra inactivo.");
        }
        employee.leave(Instant.now(clock));
        repository.save(employee);
    }

    public EmployeeResponse rejoinEmployee(String id) {
        Employee employee = find(id);
        if (employee.getState() == EmployeeState.ACTIVE) {
            throw new BusinessRuleException("EMPLOYEE_ALREADY_ACTIVE", "El colaborador ya está activo.");
        }
        employee.rejoin(Instant.now(clock));
        return EmployeeResponse.from(repository.save(employee));
    }

    private void assertUniqueIdentity(String documentNumber, String country) {
        Optional<Employee> existing = repository.findByDocumentNumberAndCountry(documentNumber, country);
        if (existing.isPresent()) {
            throw new ConflictException("Ya existe un colaborador con este documento en ese país.", "documentNumber");
        }
    }

    private Employee find(String id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("No existe el colaborador con id " + id + "."));
    }
}
