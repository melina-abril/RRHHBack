package com.techforb.app.modules.employees.application.dto;

import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeStatus;
import java.time.Instant;
import java.util.List;

/**
 * Respuesta de la ficha individual de colaborador: todos los datos de la ficha y antecedentes básicos.
 */
public record EmployeeDetailsResponse(
        String id,
        String legajo,
        String firstName,
        String lastName,
        String email,
        EmployeeCategory category,
        EmployeeStatus status,
        String countryCode,
        String city,
        String entryDate,
        String position,
        List<String> clients,
        List<String> projects,
        List<String> backgroundNotes,
        Instant updatedAt
) {
    public static EmployeeDetailsResponse from(Employee employee) {
        return new EmployeeDetailsResponse(
                employee.getId(),
                employee.getLegajo(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getCategory(),
                employee.getStatus(),
                employee.getCountryCode(),
                employee.getCity(),
                employee.getEntryDate(),
                employee.getPosition(),
                employee.getClients(),
                employee.getProjects(),
                employee.getBackgroundNotes(),
                employee.getUpdatedAt()
        );
    }

    /** Dummy de ejemplo para desarrollo. */
    public static EmployeeDetailsResponse example() {
        return new EmployeeDetailsResponse(
                "f0b7cbb4-4e52-4e0b-af5c-ee05a5d0d0c4",
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
                List.of(
                        "Alta en TECHFORB (05/01/2023)",
                        "Asignado a Proyecto Beta (23/01/2023)",
                        "Ascendido a Desarrollador Java Ssr (01/10/2023)"
                ),
                Instant.parse("2024-05-01T10:15:00Z")
        );
    }
}
