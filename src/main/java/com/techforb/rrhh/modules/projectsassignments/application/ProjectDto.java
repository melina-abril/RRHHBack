package com.techforb.rrhh.modules.projectsassignments.application;

/**
 * DTO de proyecto
 */
public record ProjectDto(
        String projectId,
        String name,
        String countryId,
        boolean active
) {}
