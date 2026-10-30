package com.techforb.app.modules.employees.application.dto;

import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeStatus;
import java.time.Instant;
import java.util.List;

/** Elemento de listado de colaboradores. */
public record EmployeeListResponse(
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
        Instant updatedAt
) {
    public static EmployeeListResponse from(Employee employee) {
        return new EmployeeListResponse(
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
                employee.getUpdatedAt()
        );
    }
}
