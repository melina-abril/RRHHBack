package com.techforb.app.modules.maindashboard.api;

import com.techforb.app.modules.maindashboard.application.MainDashboardService;
import com.techforb.app.modules.maindashboard.application.dto.DashboardResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Pantalla principal: indicadores generales y textos de los módulos en el panel de inicio.
 * Todo /api/** requiere sesión activa (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Panel Principal")
public class MainDashboardController {

    private final MainDashboardService dashboardService;

    public MainDashboardController(MainDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @Operation(summary = "Devuelve indicadores principales para el panel de inicio y las descripciones visibles de los módulos")
    public DashboardResponse getDashboardIndicators() {
        return dashboardService.getDashboardIndicators();
    }
}
