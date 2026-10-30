package com.techforb.app.modules.employees.infrastructure;

import com.techforb.app.modules.employees.domain.Employee;
import com.techforb.app.modules.employees.domain.EmployeeRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;

@Repository
public class JpaEmployeeRepository implements EmployeeRepository {

    private final EmployeeJpaRepository jpa;

    public JpaEmployeeRepository(EmployeeJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<Employee> findAll() {
        return jpa.findAllByOrderByUpdatedAtDesc().stream().map(EmployeeJpaEntity::toDomain).toList();
    }

    @Override
    public Optional<Employee> findById(String id) {
        return jpa.findById(id).map(EmployeeJpaEntity::toDomain);
    }

    @Override
    public Optional<Employee> findByLegajo(String legajo) {
        return jpa.findByLegajo(legajo).map(EmployeeJpaEntity::toDomain);
    }

    @Override
    public Optional<Employee> findByDocumentNumberAndCountry(String documentNumber, String country) {
        return jpa.findByDocumentNumberAndCountry(documentNumber, country).map(EmployeeJpaEntity::toDomain);
    }

    @Override
    public Employee save(Employee employee) {
        return jpa.save(EmployeeJpaEntity.from(employee)).toDomain();
    }

    @Override
    public void deleteById(String id) {
        try {
            jpa.deleteById(id);
        } catch (EmptyResultDataAccessException ignored) {
            // No existe, no hacer nada
        }
    }

    @Override
    public String generateNextLegajo() {
        // Se asume: legajo es un número correlativo con 5 dígitos, el siguiente al mayor. Si no existen, empezar en "00001".
        List<EmployeeJpaEntity> all = jpa.findAll();
        int maxLegajo = 0;
        for (EmployeeJpaEntity e : all) {
            try {
                int legajoNumber = Integer.parseInt(e.legajo);
                if (legajoNumber > maxLegajo) {
                    maxLegajo = legajoNumber;
                }
            } catch (NumberFormatException ignore) { }
        }
        return String.format("%05d", maxLegajo + 1);
    }
}
