package com.techforb.app.modules.employees.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Entidad de dominio para colaborador: estado más métodos de negocio básicos.
 */
public class Employee {
    private final String id;
    private final String legajo;
    private String firstName;
    private String lastName;
    private String email;
    private EmployeeCategory category;
    private EmployeeStatus status;
    private String countryCode;
    private String city;
    private String entryDate;
    private String position;
    private List<String> clients;
    private List<String> projects;
    private List<String> backgroundNotes;
    private Instant updatedAt;

    public Employee(String id, String legajo, String firstName, String lastName, String email, EmployeeCategory category,
                    EmployeeStatus status, String countryCode, String city, String entryDate, String position,
                    List<String> clients, List<String> projects, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        this.legajo = Objects.requireNonNull(legajo);
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.category = category;
        this.status = status;
        this.countryCode = countryCode;
        this.city = city;
        this.entryDate = entryDate;
        this.position = position;
        this.clients = clients != null ? new ArrayList<>(clients) : new ArrayList<>();
        this.projects = projects != null ? new ArrayList<>(projects) : new ArrayList<>();
        this.backgroundNotes = new ArrayList<>();
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

    public String getEmail() {
        return email;
    }

    public EmployeeCategory getCategory() {
        return category;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getCity() {
        return city;
    }

    public String getEntryDate() {
        return entryDate;
    }

    public String getPosition() {
        return position;
    }

    public List<String> getClients() {
        return Collections.unmodifiableList(clients);
    }

    public List<String> getProjects() {
        return Collections.unmodifiableList(projects);
    }

    public List<String> getBackgroundNotes() {
        return Collections.unmodifiableList(backgroundNotes);
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    // Métodos de negocio futuros: cambiar categoría, asignar proyecto, registrar evento...
}
