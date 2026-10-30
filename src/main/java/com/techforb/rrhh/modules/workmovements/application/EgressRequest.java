package com.techforb.rrhh.modules.workmovements.application;

import java.time.LocalDate;

/**
 * Solicitud para registrar egreso de colaborador.
 */
public record EgressRequest(
    LocalDate effectiveDate,
    String reason
) {
}
