package com.techforb.rrhh.modules.employee_technical_profile.application;

import java.util.List;

public record EmployeeTechnicalProfileDto(
        String legajo,
        SkillsDto skills,
        List<CertificationDto> certifications,
        List<DocumentDto> documents
) {
}
