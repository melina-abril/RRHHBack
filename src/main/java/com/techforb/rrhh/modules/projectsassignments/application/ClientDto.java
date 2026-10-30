package com.techforb.rrhh.modules.projectsassignments.application;

import java.util.List;

/**
 * DTO para cliente con países y proyectos activos.
 */
public record ClientDto(
        String clientId,
        String name,
        List<CountryDto> countries,
        List<ProjectDto> projects
) {}
