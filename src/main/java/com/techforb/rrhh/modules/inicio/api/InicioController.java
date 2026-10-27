package com.techforb.rrhh.modules.inicio.api;

import com.techforb.rrhh.modules.inicio.application.InicioSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inicio")
public class InicioController {
    @GetMapping("/resumen")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ResponseEntity<InicioSummaryResponse> getHomepageSummary() {
        // Dummy: respuesta de ejemplo para la pantalla principal
        InicioSummaryResponse summary = new InicioSummaryResponse(
                27, // colaboradores activos
                3, // solicitudes pendientes
                "2024-07-01", // próximo evento (ejemplo: vencimiento de vacaciones)
                new InicioSummaryResponse.ModuloSummary("Gestión de Empleados", "Legajos, perfiles y asignaciones"),
                new InicioSummaryResponse.ModuloSummary("Sueldos y Bonos", "Remuneraciones y beneficios"),
                new InicioSummaryResponse.ModuloSummary("Solicitudes", "Revisión y seguimiento de pedidos"),
                new InicioSummaryResponse.ModuloSummary("Comunicados", "Mensajes y registro de envíos"),
                new InicioSummaryResponse.ModuloSummary("Horas Extras", "Autorizaciones y compensaciones"),
                "Bienvenido al sistema de Recursos Humanos de TECHFORB. Consultá la actividad general y accedé a los módulos desde un solo lugar.",
                "Ingresá directamente al módulo que necesitás."
        );
        // Esta estructura y valores simulados se reemplazarán por los reales
        return ResponseEntity.ok(summary);
    }
}
