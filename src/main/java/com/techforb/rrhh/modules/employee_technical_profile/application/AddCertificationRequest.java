package com.techforb.rrhh.modules.employee_technical_profile.application;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record AddCertificationRequest(
        @NotEmpty String title,
        @NotEmpty String issuer,
        @NotEmpty String issueDate,
        String certificateId
) {
}
