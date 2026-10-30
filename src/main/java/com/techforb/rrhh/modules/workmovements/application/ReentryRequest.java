package com.techforb.rrhh.modules.workmovements.application;

import java.time.LocalDate;

/**
 * Solicitud para registrar reingreso de colaborador.
 */
public record ReentryRequest(
    LocalDate reentryDate,
    String newCategory,
    String reason
) {
}
