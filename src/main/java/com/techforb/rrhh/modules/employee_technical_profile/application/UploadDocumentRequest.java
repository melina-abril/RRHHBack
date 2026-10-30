package com.techforb.rrhh.modules.employee_technical_profile.application;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record UploadDocumentRequest(
        @NotEmpty String title,
        @NotEmpty String category,
        @NotEmpty String fileName
) {
}
