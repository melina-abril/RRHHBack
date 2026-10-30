package com.techforb.rrhh.modules.inicio.application;

import com.techforb.rrhh.modules.inicio.application.InicioDtos.InicioResumenResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para la generación del resumen del panel de inicio.
 */
@Service
@Transactional(readOnly = true)
public class InicioService {
    /**
     * Devuelve indicadores globales dummy (a reemplazar por datos reales).
     * - colaboradoresActivos: cantidad de colaboradores en estado ACTIVO
     * - solicitudesPendientes: solicitudes de ausencia, vacaciones, días off por revisar
     * - proximosEventos: próximos eventos relevantes (ej. vencimientos de vacaciones, cumpleaños, avisos)
     */
    public InicioResumenResponse getResumen() {
        // Dummy: valores de ejemplo realistas
        return new InicioResumenResponse(
            33,   // colaboradores activos
            5,    // solicitudes pendientes
            2     // próximos eventos relevantes (ej. vencimientos, cumpleaños)
        );
    }
}
