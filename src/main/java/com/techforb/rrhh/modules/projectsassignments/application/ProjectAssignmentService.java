package com.techforb.rrhh.modules.projectsassignments.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProjectAssignmentService {
    public List<ClientDto> getClients() {
        // Dummy: Clientes, países y proyectos activos
        return Arrays.asList(
                new ClientDto("C100", "Techforb S.A.", Arrays.asList(
                        new CountryDto("AR", "Argentina"),
                        new CountryDto("MX", "México")
                ), Arrays.asList(
                        new ProjectDto("P200", "Migración Cloud", "AR", true),
                        new ProjectDto("P201", "Desarrollo Portal", "MX", true)
                )),
                new ClientDto("C101", "RetailCorp S.R.L.", Arrays.asList(
                        new CountryDto("AR", "Argentina")
                ), Arrays.asList(
                        new ProjectDto("P300", "Ecommerce Rediseño", "AR", true)
                ))
        );
    }

    public List<AssignmentDto> getAssignmentsByLegajo(String legajo) {
        // Dummy: Vigentes e históricas
        return Arrays.asList(
                new AssignmentDto(
                        "A0001",
                        legajo,
                        "C100",
                        "Techforb S.A.",
                        "P200",
                        "Migración Cloud",
                        "AR",
                        "Argentina",
                        "Líder Técnico",
                        "Lucía Méndez",
                        LocalDate.of(2022, 9, 1),
                        null,
                        true
                ),
                new AssignmentDto(
                        "A0002",
                        legajo,
                        "C101",
                        "RetailCorp S.R.L.",
                        "P300",
                        "Ecommerce Rediseño",
                        "AR",
                        "Argentina",
                        "Desarrollador/a",
                        "Juan García",
                        LocalDate.of(2021, 3, 15),
                        LocalDate.of(2022, 8, 30),
                        false
                )
        );
    }

    public AssignmentDto createAssignment(String legajo, AssignmentRequest request) {
        // Dummy: Retorna la nueva asignación
        return new AssignmentDto(
                UUID.randomUUID().toString(),
                legajo,
                request.clientId(),
                "Techforb S.A.",
                request.projectId(),
                "Migración Cloud",
                request.countryId(),
                "Argentina",
                request.role(),
                request.referee(),
                request.startDate(),
                null,
                true
        );
    }

    public AssignmentDto editAssignment(String legajo, String assignmentId, AssignmentRequest request) {
        // Dummy: Simula edición; en real toma y actualiza la asignación existente
        return new AssignmentDto(
                assignmentId,
                legajo,
                request.clientId(),
                "Techforb S.A.",
                request.projectId(),
                "Migración Cloud",
                request.countryId(),
                "Argentina",
                request.role(),
                request.referee(),
                request.startDate(),
                request.endDate(),
                request.endDate() == null
        );
    }

    public AssignmentDto finalizeAssignment(String legajo, String assignmentId, String endDateStr) {
        // Dummy: Simula finalización
        LocalDate endDate = LocalDate.parse(endDateStr);
        return new AssignmentDto(
                assignmentId,
                legajo,
                "C100",
                "Techforb S.A.",
                "P200",
                "Migración Cloud",
                "AR",
                "Argentina",
                "Líder Técnico",
                "Lucía Méndez",
                LocalDate.of(2022, 9, 1),
                endDate,
                false
        );
    }
}
