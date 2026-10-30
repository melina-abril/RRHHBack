package com.techforb.app.modules.employees.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

public class Employee {
    private final String id;
    private final String legajo;
    private String firstName;
    private String lastName;
    private String documentType;
    private String documentNumber;
    private String country;
    private LocalDate birthDate;
    private String personalEmail;
    private String phoneNumber;
    private String address;
    private String city;
    private String zipCode;
    private EmployeeCategory category;
    private EmployeeWorkMode workMode;
    private EmployeeDedication dedication;
    private String role;
    private LocalDate joinDate;
    private EmployeeState state;
    private String client;
    private String project;
    private final Instant createdAt;
    private Instant updatedAt;

    public Employee(String id, String legajo, String firstName, String lastName, String documentType, String documentNumber, String country, LocalDate birthDate, String personalEmail, String phoneNumber, String address, String city, String zipCode, EmployeeCategory category, EmployeeWorkMode workMode, EmployeeDedication dedication, String role, LocalDate joinDate, EmployeeState state, String client, String project, Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        this.legajo = Objects.requireNonNull(legajo);
        update(firstName, lastName, documentType, documentNumber, country, birthDate, personalEmail, phoneNumber, address, city, zipCode, category, workMode, dedication, role, joinDate, client, project, updatedAt);
        this.state = state;
        this.createdAt = createdAt;
    }

    public void update(String firstName, String lastName, String documentType, String documentNumber, String country, LocalDate birthDate, String personalEmail, String phoneNumber, String address, String city, String zipCode, EmployeeCategory category, EmployeeWorkMode workMode, EmployeeDedication dedication, String role, LocalDate joinDate, String client, String project, Instant updatedAt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.country = country;
        this.birthDate = birthDate;
        this.personalEmail = personalEmail;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.zipCode = zipCode;
        this.category = category;
        this.workMode = workMode;
        this.dedication = dedication;
        this.role = role;
        this.joinDate = joinDate;
        this.client = client;
        this.project = project;
        this.updatedAt = updatedAt;
    }

    public void leave(Instant updatedAt) {
        this.state = EmployeeState.INACTIVE;
        this.updatedAt = updatedAt;
    }

    public void rejoin(Instant updatedAt) {
        this.state = EmployeeState.ACTIVE;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getLegajo() {
        return legajo;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public String getCountry() {
        return country;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getPersonalEmail() {
        return personalEmail;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public EmployeeCategory getCategory() {
        return category;
    }

    public EmployeeWorkMode getWorkMode() {
        return workMode;
    }

    public EmployeeDedication getDedication() {
        return dedication;
    }

    public String getRole() {
        return role;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public EmployeeState getState() {
        return state;
    }

    public String getClient() {
        return client;
    }

    public String getProject() {
        return project;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
