package com.techforb.app.modules.employees.infrastructure;

import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeCategory;
import com.techforb.app.modules.employees.domain.EmployeeDedication;
import com.techforb.app.modules.employees.domain.EmployeeState;
import com.techforb.app.modules.employees.domain.EmployeeWorkMode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
public class EmployeeJpaEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "legajo", length = 20, nullable = false, unique = true)
    private String legajo;

    @Column(name = "first_name", length = 60, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 60, nullable = false)
    private String lastName;

    @Column(name = "document_type", length = 10, nullable = false)
    private String documentType;

    @Column(name = "document_number", length = 30, nullable = false)
    private String documentNumber;

    @Column(name = "country", length = 40, nullable = false)
    private String country;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "personal_email", length = 100, nullable = false)
    private String personalEmail;

    @Column(name = "phone_number", length = 20, nullable = false)
    private String phoneNumber;

    @Column(name = "address", length = 150, nullable = false)
    private String address;

    @Column(name = "city", length = 60, nullable = false)
    private String city;

    @Column(name = "zip_code", length = 20, nullable = false)
    private String zipCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 20, nullable = false)
    private EmployeeCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", length = 20, nullable = false)
    private EmployeeWorkMode workMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "dedication", length = 20, nullable = false)
    private EmployeeDedication dedication;

    @Column(name = "role", length = 60, nullable = false)
    private String role;

    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", length = 20, nullable = false)
    private EmployeeState state;

    @Column(name = "client", length = 100)
    private String client;

    @Column(name = "project", length = 100)
    private String project;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected EmployeeJpaEntity() {
    }

    static EmployeeJpaEntity from(Employee employee) {
        EmployeeJpaEntity entity = new EmployeeJpaEntity();
        entity.id = employee.getId();
        entity.legajo = employee.getLegajo();
        entity.firstName = employee.getFirstName();
        entity.lastName = employee.getLastName();
        entity.documentType = employee.getDocumentType();
        entity.documentNumber = employee.getDocumentNumber();
        entity.country = employee.getCountry();
        entity.birthDate = employee.getBirthDate();
        entity.personalEmail = employee.getPersonalEmail();
        entity.phoneNumber = employee.getPhoneNumber();
        entity.address = employee.getAddress();
        entity.city = employee.getCity();
        entity.zipCode = employee.getZipCode();
        entity.category = employee.getCategory();
        entity.workMode = employee.getWorkMode();
        entity.dedication = employee.getDedication();
        entity.role = employee.getRole();
        entity.joinDate = employee.getJoinDate();
        entity.state = employee.getState();
        entity.client = employee.getClient();
        entity.project = employee.getProject();
        entity.createdAt = employee.getCreatedAt();
        entity.updatedAt = employee.getUpdatedAt();
        return entity;
    }

    Employee toDomain() {
        return new Employee(
                id,
                legajo,
                firstName,
                lastName,
                documentType,
                documentNumber,
                country,
                birthDate,
                personalEmail,
                phoneNumber,
                address,
                city,
                zipCode,
                category,
                workMode,
                dedication,
                role,
                joinDate,
                state,
                client,
                project,
                createdAt,
                updatedAt
        );
    }
}
