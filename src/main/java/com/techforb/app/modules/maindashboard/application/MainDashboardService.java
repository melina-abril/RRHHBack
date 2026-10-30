package com.techforb.app.modules.maindashboard.application;

import com.techforb.app.modules.maindashboard.application.dto.DashboardResponse;
import java.time.Clock;
import org.springframework.stereotype.Service;

/** Casos de uso principales del panel: devuelve indicadores dummy y los textos visibles de los módulos. */
@Service
public class MainDashboardService {

    private final Clock clock;

    public MainDashboardService(Clock clock) {
        this.clock = clock;
    }

    public DashboardResponse getDashboardIndicators() {
        // JSON dummy: valores de ejemplo, ya que no hay integración con otros módulos aún.
        // NOTA: los módulos futuros y sus endpoints reales reemplazarán estos datos.
        return DashboardResponse.example();
    }
}
