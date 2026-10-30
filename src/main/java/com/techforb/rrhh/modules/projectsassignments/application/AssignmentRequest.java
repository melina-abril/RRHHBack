package com.techforb.rrhh.modules.projectsassignments.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Request para crear o editar una asignación.
 */
public record AssignmentRequest(
        @NotBlank String clientId,
        @NotBlank String projectId,
        @NotBlank String countryId,
        @NotBlank String role,
        String referee,
        @NotNull LocalDate startDate,
        LocalDate endDate
) {}
