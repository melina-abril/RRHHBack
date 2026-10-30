package com.techforb.app.modules.employees.domain;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository {
    List<Employee> findAll();

    Optional<Employee> findById(String id);

    Optional<Employee> findByLegajo(String legajo);

    Optional<Employee> findByDocumentNumberAndCountry(String documentNumber, String country);

    Employee save(Employee employee);

    void deleteById(String id);

    String generateNextLegajo();
}
