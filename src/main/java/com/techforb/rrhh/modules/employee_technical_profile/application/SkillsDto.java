package com.techforb.rrhh.modules.employee_technical_profile.application;

import java.util.List;

public record SkillsDto(
        List<String> technologies,
        List<String> tools,
        int yearsExperience
) {
}
