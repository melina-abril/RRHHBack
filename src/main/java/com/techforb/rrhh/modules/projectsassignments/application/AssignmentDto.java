package com.techforb.rrhh.modules.projectsassignments.application;

import java.time.LocalDate;

/**
 * DTO de asignación de colaborador a proyecto.
 */
public record AssignmentDto(
        String assignmentId,
        String legajo,
        String clientId,
        String clientName,
        String projectId,
        String projectName,
        String countryId,
        String countryName,
        String role,
        String referee,
        LocalDate startDate,
        LocalDate endDate,
        boolean active // true = vigente, false = terminada
) {}
