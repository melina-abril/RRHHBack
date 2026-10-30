package com.techforb.rrhh.modules.colaboradores.application;

import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.CrearColaboradorRequest;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.EditarColaboradorRequest;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.FiltroColaboradores;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.ColaboradorResumen;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.ColaboradorFicha;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.MovResumen;
import com.techforb.rrhh.modules.colaboradores.domain.Colaborador;
import com.techforb.rrhh.modules.colaboradores.domain.EstadoColaborador;
import com.techforb.rrhh.shared.domain.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de aplicación de colaboradores.
 * Implementación dummy.
 */
@Service
@Transactional
public class ColaboradorService {

    /**
     * Listado dummy - a reemplazar por la integración real
     */
    public PageResponse<ColaboradorResumen> listColaboradores(FiltroColaboradores filtro, int page, int size) {
        // Dummy: 2 empleados si no hay filtro, vacío si busqueda "nada".
        if (filtro.busqueda() != null && filtro.busqueda().equalsIgnoreCase("nada")) {
            return new PageResponse<>(List.of(), page, size, 0);
        }
        List<ColaboradorResumen> items = new ArrayList<>();
        items.add(new ColaboradorResumen(1L, "C0001", "Juan Pérez", "Permanente", "ACME S.A.", "Proyecto Alfa", EstadoColaborador.ACTIVO));
        items.add(new ColaboradorResumen(2L, "C0002", "María Gómez", "Pasante", "Beta Corp", "Proyecto Beta", EstadoColaborador.EGRESADO));
        return new PageResponse<>(items, page, size, 2);
    }

    /**
     * Devuelve la ficha de colaborador (dummy)
     */
    public Optional<ColaboradorFicha> getColaboradorFicha(Long id) {
        if (id == 1L) {
            return Optional.of(new ColaboradorFicha(
                1L, "C0001", "Juan", "Pérez",
                "DNI", "12345678", "Argentina",
                LocalDate.of(1985, 2, 14), "juan.perez@email.com",
                LocalDate.of(2020, 1, 10), "Permanente", "Full-time",
                "Remoto", "Developer Sr.", "juan.perez@techforb.com",
                EstadoColaborador.ACTIVO,
                List.of(new MovResumen("ACME S.A.", "Proyecto Alfa", "Dev", LocalDate.of(2020,1,15), null)),
                List.of("Vacaciones", "Días off"),
                List.of("DNI.pdf", "CV.pdf"),
                List.of("Marzo 2023: Verde", "Junio 2023: Amarillo"),
                List.of("Reconocimiento Marzo", "Incidencia Mayo"),
                List.of("Enero 2024, ARS 1.200.000"),
                List.of("Bono semestral Julio 2024")
            ));
        } else if (id == 2L) {
            return Optional.of(new ColaboradorFicha(
                2L, "C0002", "María", "Gómez",
                "DNI", "87654321", "Argentina",
                LocalDate.of(1999, 7, 5), "maria.gomez@email.com",
                LocalDate.of(2022, 6, 1), "Pasante", "Part-time",
                "Híbrido", "QA Analyst", null,
                EstadoColaborador.EGRESADO,
                List.of(new MovResumen("Beta Corp", "Proyecto Beta", "QA", LocalDate.of(2022,6,1), LocalDate.of(2023,12,31))),
                List.of("Vacaciones"),
                List.of("DNI.pdf"),
                List.of("Diciembre 2023: Rojo"),
                List.of("Observación Octubre"),
                List.of("Junio 2023, ARS 600.000"),
                List.of("Bono desempeño 2023")
            ));
        }
        return Optional.empty();
    }

    /**
     * Alta dummy: ignora duplicados
     */
    public ColaboradorFicha altaColaborador(CrearColaboradorRequest req) {
        return new ColaboradorFicha(
            10L, "C0010", req.nombre(), req.apellido(),
            req.documentoTipo(), req.documentoNumero(), req.paisResidencia(),
            req.fechaNacimiento(), req.correoPersonal(), req.fechaIngreso(),
            req.categoria(), req.dedicacion(), req.modalidadTrabajo(),
            req.rolLaboral(), req.emailCorporativo(), EstadoColaborador.ACTIVO,
            List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of()
        );
    }

    /**
     * Edición dummy: devuelve lo mismo ajustando valores.
     */
    public ColaboradorFicha editarColaborador(Long id, EditarColaboradorRequest req) {
        return new ColaboradorFicha(
            id, "C0001", req.nombre(), req.apellido(),
            req.documentoTipo(), req.documentoNumero(), req.paisResidencia(),
            req.fechaNacimiento(), req.correoPersonal(), LocalDate.of(2020,1,10),
            req.categoria(), req.dedicacion(), req.modalidadTrabajo(),
            req.rolLaboral(), req.emailCorporativo(), EstadoColaborador.ACTIVO,
            List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of()
        );
    }
}
