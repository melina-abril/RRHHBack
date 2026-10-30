package com.techforb.rrhh.modules.inicio.application;

/**
 * DTOs y respuestas de la pantalla de inicio.
 */
public class InicioDtos {
    /**
     * Resumen para el panel de inicio: indicadores globales.
     */
    public record InicioResumenResponse(
        int colaboradoresActivos,
        int solicitudesPendientes,
        int proximosEventos
    ) {}
}
