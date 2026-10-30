package com.techforb.rrhh.modules.workmovements.application;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Service
public class WorkMovementsService {

    public WorkMovementDto changeCategory(String legajo, ChangeCategoryRequest request) {
        // Dummy response for demo, replace with real business logic
        return new WorkMovementDto(
            legajo,
            "CHANGE_CATEGORY",
            request.effectiveDate(),
            "Pasante",
            request.newCategory(),
            "ACTIVO",
            "ACTIVO",
            request.reason(),
            "rrhh_admin@techforb.com",
            Instant.now()
        );
    }

    public WorkMovementDto registerEgress(String legajo, EgressRequest request) {
        // Dummy response for demo, replace with real business logic
        return new WorkMovementDto(
            legajo,
            "EGRESS",
            request.effectiveDate(),
            "Permanente",
            "Permanente",
            "ACTIVO",
            "EGRESADO",
            request.reason(),
            "rrhh_admin@techforb.com",
            Instant.now()
        );
    }

    public WorkMovementDto registerReentry(String legajo, ReentryRequest request) {
        // Dummy response for demo, replace with real business logic
        return new WorkMovementDto(
            legajo,
            "REENTRY",
            request.reentryDate(),
            null,
            request.newCategory(),
            "EGRESADO",
            "ACTIVO",
            request.reason(),
            "rrhh_admin@techforb.com",
            Instant.now()
        );
    }

    public List<WorkMovementDto> getWorkMovementsHistory(String legajo) {
        // Dummy response: historial fijo para ejemplo (orden del más reciente al más antiguo)
        List<WorkMovementDto> history = new ArrayList<>();
        history.add(new WorkMovementDto(
            legajo,
            "CHANGE_CATEGORY",
            LocalDate.now().minusMonths(2),
            "Pasante",
            "Permanente",
            "ACTIVO",
            "ACTIVO",
            "Promoción a Permanente",
            "rrhh_admin@techforb.com",
            Instant.now().minusSeconds(3000)
        ));
        history.add(new WorkMovementDto(
            legajo,
            "EGRESS",
            LocalDate.now().minusMonths(6),
            "Permanente",
            "Permanente",
            "ACTIVO",
            "EGRESADO",
            "Fin de contrato",
            "rrhh_admin@techforb.com",
            Instant.now().minusSeconds(20000)
        ));
        history.add(new WorkMovementDto(
            legajo,
            "REENTRY",
            LocalDate.now().minusMonths(12),
            null,
            "Pasante",
            "EGRESADO",
            "ACTIVO",
            "Reingreso tras ausencia",
            "rrhh_admin@techforb.com",
            Instant.now().minusSeconds(30000)
        ));
        return history;
    }
}
