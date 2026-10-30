package com.techforb.app.modules.employees.application.dto;

import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeDedication;
import com.techforb.app.modules.employees.domain.EmployeeState;
import com.techforb.app.modules.employees.domain.EmployeeWorkMode;
import java.time.Instant;
import java.time.LocalDate;

public record EmployeeResponse(
        String id,
        String legajo,
        String firstName,
        String lastName,
        String documentType,
        String documentNumber,
        String country,
        LocalDate birthDate,
        String personalEmail,
        String phoneNumber,
        String address,
        String city,
        String zipCode,
        EmployeeCategory category,
        EmployeeWorkMode workMode,
        EmployeeDedication dedication,
        String role,
        LocalDate joinDate,
        EmployeeState state,
        String client,
        String project,
        Instant createdAt,
        Instant updatedAt
) {
    public static EmployeeResponse from(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getLegajo(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getDocumentType(),
                employee.getDocumentNumber(),
                employee.getCountry(),
                employee.getBirthDate(),
                employee.getPersonalEmail(),
                employee.getPhoneNumber(),
                employee.getAddress(),
                employee.getCity(),
                employee.getZipCode(),
                employee.getCategory(),
                employee.getWorkMode(),
                employee.getDedication(),
                employee.getRole(),
                employee.getJoinDate(),
                employee.getState(),
                employee.getClient(),
                employee.getProject(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }
}
