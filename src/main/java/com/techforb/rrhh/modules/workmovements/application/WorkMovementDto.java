package com.techforb.rrhh.modules.workmovements.application;

import java.time.LocalDate;
import java.time.Instant;

/**
 * DTO para responder los movimientos laborales.
 */
public record WorkMovementDto(
    String legajo,
    String type, // CHANGE_CATEGORY, EGRESS, REENTRY
    LocalDate date,
    String previousCategory,
    String newCategory,
    String previousStatus,
    String newStatus,
    String reason,
    String performedBy,
    Instant createdAt
) {
}
