package com.techforb.rrhh.modules.colaboradores.application;

import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.ColaboradorFicha;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Servicio para registrar egresos y reingresos de colaboradores.
 * Dummy (no modifica datos reales)
 */
@Service
@Transactional
public class MovimientoLaboralService {
    public void egresarColaborador(Long colaboradorId, String motivo) {
        // Dummy: no hace nada, a reemplazar por lógica real
    }
    public ColaboradorFicha reingresarColaborador(Long id, String motivo) {
        // Dummy: devuelve una ficha dummy actualizada
        return new ColaboradorFicha(
            id, "C0001", "Juan", "Pérez",
            "DNI", "12345678", "Argentina",
            LocalDate.of(1985, 2, 14), "juan.perez@email.com",
            LocalDate.now(), // fecha de reingreso actual
            "Permanente", "Full-time", "Remoto", "Developer Sr.", "juan.perez@techforb.com",
            com.techforb.rrhh.modules.colaboradores.domain.EstadoColaborador.ACTIVO,
            java.util.List.of(
                new ColaboradorDtos.MovResumen("ACME S.A.", "Proyecto Alfa", "Dev", LocalDate.of(2020,1,15), null)),
            java.util.List.of("Vacaciones", "Días off"),
            java.util.List.of("DNI.pdf", "CV.pdf"),
            java.util.List.of("Marzo 2023: Verde", "Junio 2023: Amarillo"),
            java.util.List.of("Reconocimiento Marzo", "Incidencia Mayo"),
            java.util.List.of("Enero 2024, ARS 1.200.000"),
            java.util.List.of("Bono semestral Julio 2024")
        );
    }
}
