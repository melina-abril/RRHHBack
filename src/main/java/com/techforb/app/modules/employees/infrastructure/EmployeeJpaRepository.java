package com.techforb.app.modules.employees.infrastructure;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

interface EmployeeJpaRepository extends JpaRepository<EmployeeJpaEntity, String> {
    List<EmployeeJpaEntity> findAllByOrderByUpdatedAtDesc();
    Optional<EmployeeJpaEntity> findByLegajo(String legajo);
    Optional<EmployeeJpaEntity> findByDocumentNumberAndCountry(String documentNumber, String country);
}
