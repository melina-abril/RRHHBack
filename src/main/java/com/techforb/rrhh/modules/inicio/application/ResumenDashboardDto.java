package com.techforb.rrhh.modules.inicio.application;

/**
 * DTO de resumen general del panel de inicio
 */
public record ResumenDashboardDto(
    int colaboradoresActivos,
    int solicitudesPendientes,
    int eventosProximos
) {}
