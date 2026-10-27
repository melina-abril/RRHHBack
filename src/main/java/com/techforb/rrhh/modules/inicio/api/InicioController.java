package com.techforb.rrhh.modules.inicio.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.techforb.rrhh.modules.inicio.application.ResumenDashboardDto;

@RestController
@RequestMapping("/api/inicio")
public class InicioController {

    @PreAuthorize("hasRole('ADMIN_RRHH')")
    @GetMapping("/resumen")
    public ResponseEntity<ResumenDashboardDto> getDashboardSummary() {
        // Respuesta dummy: para reemplazar por lógica real
        ResumenDashboardDto resumen = new ResumenDashboardDto(
            42,      // colaboradores activos
            3,       // solicitudes pendientes
            2        // eventos próximos
        );
        return ResponseEntity.ok(resumen);
    }
}
