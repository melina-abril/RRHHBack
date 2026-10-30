package com.techforb.rrhh.modules.colaboradores.domain;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Representa un movimiento laboral asociado a un colaborador.
 * Ejemplo: cambio de categoría, egreso, reingreso; incluye historial.
 */
public class MovimientoLaboral {
    private final Long id;
    private final LocalDate fecha;
    private final String tipoMovimiento; // "ALTA", "CAMBIO_CATEGORIA", "EGRESO", "REINGRESO"
    private final String categoriaAnterior;
    private final String categoriaNueva;
    private final String motivo;
    private final UUID responsableId;
    private final String responsableNombre;
    private final Long colaboradorId;

    public MovimientoLaboral(Long id, LocalDate fecha, String tipoMovimiento,
                             String categoriaAnterior, String categoriaNueva, String motivo,
                             UUID responsableId, String responsableNombre, Long colaboradorId) {
        this.id = id;
        this.fecha = fecha;
        this.tipoMovimiento = tipoMovimiento;
        this.categoriaAnterior = categoriaAnterior;
        this.categoriaNueva = categoriaNueva;
        this.motivo = motivo;
        this.responsableId = responsableId;
        this.responsableNombre = responsableNombre;
        this.colaboradorId = colaboradorId;
    }

    public Long getId() {
        return id;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public String getTipoMovimiento() {
        return tipoMovimiento;
    }
    public String getCategoriaAnterior() {
        return categoriaAnterior;
    }
    public String getCategoriaNueva() {
        return categoriaNueva;
    }
    public String getMotivo() {
        return motivo;
    }
    public UUID getResponsableId() {
        return responsableId;
    }
    public String getResponsableNombre() {
        return responsableNombre;
    }
    public Long getColaboradorId() {
        return colaboradorId;
    }
}
