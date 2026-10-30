package com.techforb.rrhh.modules.employee_technical_profile.application;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateSkillsRequest(
        @NotNull List<String> technologies,
        @NotNull List<String> tools,
        @NotNull Integer yearsExperience
) {
}
