package com.techforb.app.modules.employees.application;

import com.techforb.app.modules.employees.application.dto.CreateEmployeeRequest;
import com.techforb.app.modules.employees.application.dto.EmployeeDetailsResponse;
import com.techforb.app.modules.employees.application.dto.EmployeeListResponse;
import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeRepository;
import com.techforb.app.modules.employees.domain.EmployeeStatus;
import com.techforb.app.shared.error.ConflictException;
import com.techforb.app.shared.error.NotFoundException;
import com.techforb.app.shared.web.PageResponse;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Casos de uso de Gestión de Empleados. */
@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final Clock clock;

    public EmployeeService(EmployeeRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public PageResponse<EmployeeListResponse> listEmployees(
            String search,
            String legajo,
            EmployeeCategory category,
            String client,
            String project,
            EmployeeStatus status,
            int page,
            int size) {
        // Dummy: datos de ejemplo, sin acceso a BD todavía. Reemplazar por implementación real.
        // El filtrado simulado por parámetros.
        List<Employee> all = List.of(
            new Employee(
                UUID.randomUUID().toString(),
                "20240001",
                "Lautaro",
                "Martínez",
                "lautaro.martinez@techforb.com",
                EmployeeCategory.PERMANENT,
                EmployeeStatus.ACTIVE,
                "AR",
                "Buenos Aires",
                "2023-01-05",
                "Desarrollador Java Ssr",
                List.of("Acme Corp", "Globant"),
                List.of("Proyecto Alfa", "Proyecto Beta"),
                Instant.now(clock)),
            new Employee(
                UUID.randomUUID().toString(),
                "20230007",
                "Guadalupe",
                "Salinas",
                "guadalupe.salinas@techforb.com",
                EmployeeCategory.INTERN,
                EmployeeStatus.INACTIVE,
                "AR",
                "Córdoba",
                "2022-06-01",
                "Pasante QA",
                List.of("Acme Corp"),
                List.of("Proyecto Omega"),
                Instant.now(clock))
        );
        return PageResponse.of(all, page, size, EmployeeListResponse::from);
    }

    @Transactional(readOnly = true)
    public EmployeeDetailsResponse getEmployeeDetails(String id) {
        // Dummy: datos de ejemplo, sin acceso a BD todavía. Reemplazar por implementación real.
        if ("f0b7cbb4-4e52-4e0b-af5c-ee05a5d0d0c4".equals(id)) {
            return EmployeeDetailsResponse.example();
        }
        throw new NotFoundException("No existe el colaborador solicitado.");
    }

    @Transactional
    public EmployeeDetailsResponse createEmployee(CreateEmployeeRequest request) {
        // Dummy: verifica duplicado por email
        if (request.email().equalsIgnoreCase("lautaro.martinez@techforb.com")) {
            throw new ConflictException("Ya existe un colaborador registrado con ese correo.", "email");
        }
        // Dummy: crea con un legajo aleatorio, status ACTIVO y valores del request
        Employee empleado = new Employee(
                UUID.randomUUID().toString(),
                "202400" + (int)(Math.random() * 90 + 10), // Simula legajo único automático
                request.firstName(),
                request.lastName(),
                request.email(),
                request.category(),
                EmployeeStatus.ACTIVE,
                request.countryCode(),
                request.city(),
                request.entryDate(),
                request.position(),
                request.clients() != null ? request.clients() : List.of(),
                request.projects() != null ? request.projects() : List.of(),
                Instant.now(clock)
        );
        return EmployeeDetailsResponse.from(empleado);
    }
}
