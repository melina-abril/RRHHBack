package com.techforb.rrhh.modules.inicio.application;

public record InicioSummaryResponse(
        int totalColaboradores,
        int solicitudesPendientes,
        String proximoEvento,
        ModuloSummary gestionEmpleados,
        ModuloSummary sueldosBonos,
        ModuloSummary solicitudes,
        ModuloSummary comunicados,
        ModuloSummary horasExtras,
        String bienvenida,
        String indicacionAccesos
) {
    public record ModuloSummary(String nombre, String descripcion) {}
}
