package com.techforb.rrhh.modules.inicio.api;

import com.techforb.rrhh.modules.inicio.application.InicioDtos.InicioResumenResponse;
import com.techforb.rrhh.modules.inicio.application.InicioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Controlador del módulo de inicio.
 * Expone el indicador global (panel de inicio).
 */
@RestController
@RequestMapping("/api/inicio")
public class InicioController {

    private final InicioService inicioService;

    public InicioController(InicioService inicioService) {
        this.inicioService = inicioService;
    }

    /**
     * Devuelve indicadores globales del sistema para la pantalla principal: colaboradores activos, solicitudes pendientes y próximos eventos.
     */
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    @GetMapping("/resumen")
    public ResponseEntity<InicioResumenResponse> getSummary() {
        return ResponseEntity.ok(inicioService.getResumen());
    }
}
