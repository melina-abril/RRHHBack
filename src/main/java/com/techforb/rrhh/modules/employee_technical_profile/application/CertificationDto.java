package com.techforb.rrhh.modules.employee_technical_profile.application;

public record CertificationDto(
        String title,
        String issuer,
        String issueDate,
        String certificateId
) {
}
