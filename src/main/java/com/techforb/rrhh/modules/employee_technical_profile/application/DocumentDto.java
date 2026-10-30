package com.techforb.rrhh.modules.employee_technical_profile.application;

public record DocumentDto(
        String title,
        String category,
        String fileName,
        String uploadDate
) {
}
