package com.techforb.app.modules.employees.domain;

import java.util.List;
import java.util.Optional;

/** Puerto de Employees: para persistencia real, implementa este interfaz el adaptador JPA. */
public interface EmployeeRepository {
    List<Employee> findAll();
    Optional<Employee> findById(String id);
    Optional<Employee> findByEmail(String email);
    Employee save(Employee employee);
    void deleteById(String id);
}
