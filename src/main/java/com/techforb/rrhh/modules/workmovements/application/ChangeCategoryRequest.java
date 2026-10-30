package com.techforb.rrhh.modules.workmovements.application;

import java.time.LocalDate;

/**
 * Solicitud para cambio de categoría laboral.
 */
public record ChangeCategoryRequest(
    String newCategory,
    LocalDate effectiveDate,
    String reason
) {
}
