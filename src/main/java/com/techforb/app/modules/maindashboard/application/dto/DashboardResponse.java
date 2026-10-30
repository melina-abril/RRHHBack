package com.techforb.app.modules.maindashboard.application.dto;

import java.util.List;

/**
 * Respuesta para el panel de inicio: indicadores generales y descripciones de los módulos visibles.
 */
public record DashboardResponse(
        int activeEmployees,
        int pendingRequests,
        int upcomingEvents,
        String welcomeMessage,
        String quickAccessesMessage,
        List<ModuleShortcut> modules
) {
    /**
     * Dummy de ejemplo para la primera etapa: no conecta con la base ni con otros módulos.
     */
    public static DashboardResponse example() {
        return new DashboardResponse(
            42,
            5,
            3,
            "Bienvenido al sistema de Recursos Humanos de TECHFORB. Consultá la actividad general y accedé a los módulos desde un solo lugar.",
            "Ingresá directamente al módulo que necesitás.",
            List.of(
                new ModuleShortcut("Gestión de Empleados", "Legajos, perfiles y asignaciones", "employees"),
                new ModuleShortcut("Sueldos y Bonos", "Remuneraciones y beneficios", "payroll"),
                new ModuleShortcut("Solicitudes", "Revisión y seguimiento de pedidos", "requests"),
                new ModuleShortcut("Comunicados", "Mensajes y registro de envíos", "notices"),
                new ModuleShortcut("Horas Extras", "Autorizaciones y compensaciones", "extra-hours")
            )
        );
    }

    public record ModuleShortcut(
        String title,
        String description,
        String moduleKey
    ) {}
}
