package com.techforb.rrhh.modules.colaboradores.api;

import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.CrearColaboradorRequest;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.EditarColaboradorRequest;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.ColaboradorResumen;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.ColaboradorFicha;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorDtos.FiltroColaboradores;
import com.techforb.rrhh.modules.colaboradores.application.ColaboradorService;
import com.techforb.rrhh.modules.colaboradores.application.MovimientoLaboralService;
import com.techforb.rrhh.shared.domain.PageResponse;
import com.techforb.rrhh.shared.exception.NotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

/**
 * Controlador REST de colaboradores.
 */
@RestController
@RequestMapping("/api/colaboradores")
public class ColaboradorController {

    private final ColaboradorService colaboradorService;
    private final MovimientoLaboralService movimientoLaboralService;

    @Autowired
    public ColaboradorController(ColaboradorService colaboradorService, MovimientoLaboralService movimientoLaboralService) {
        this.colaboradorService = colaboradorService;
        this.movimientoLaboralService = movimientoLaboralService;
    }

    /**
     * GET /api/colaboradores?busqueda=&categoria=&cliente=&proyecto=&estado=&page=&size=
     * Listado con filtros y paginación。
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public PageResponse<ColaboradorResumen> listColaboradores(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String cliente,
            @RequestParam(required = false) String proyecto,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        FiltroColaboradores filtro = new FiltroColaboradores(busqueda, categoria, cliente, proyecto, estado);
        return colaboradorService.listColaboradores(filtro, page, size);
    }

    /**
     * GET /api/colaboradores/{id}: ficha individual
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ColaboradorFicha getColaborador(@PathVariable Long id) {
        Optional<ColaboradorFicha> ficha = colaboradorService.getColaboradorFicha(id);
        return ficha.orElseThrow(() -> new NotFoundException("Colaborador no encontrado"));
    }

    /**
     * POST /api/colaboradores: alta
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ColaboradorFicha altaColaborador(@Valid @RequestBody CrearColaboradorRequest req) {
        return colaboradorService.altaColaborador(req);
    }

    /**
     * PUT /api/colaboradores/{id}: edición
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ColaboradorFicha editarColaborador(@PathVariable Long id, @Valid @RequestBody EditarColaboradorRequest req) {
        return colaboradorService.editarColaborador(id, req);
    }

    /**
     * POST /api/colaboradores/{id}/egreso: baja
     */
    @PostMapping("/{id}/egreso")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ResponseEntity<Void> egresoColaborador(@PathVariable Long id, @RequestParam(required = false) String motivo) {
        movimientoLaboralService.egresarColaborador(id, motivo);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/colaboradores/{id}/reingreso
     */
    @PostMapping("/{id}/reingreso")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ColaboradorFicha reingresoColaborador(@PathVariable Long id, @RequestParam(required = false) String motivo) {
        return movimientoLaboralService.reingresarColaborador(id, motivo);
    }
}
