package com.techforb.rrhh.modules.colaboradores.infrastructure;

import com.techforb.rrhh.shared.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad JPA para la tabla movimientos_laborales.
 * Una fila por cambio: egreso/reingreso/cambio de categoría.
 */
@Entity
@Table(name = "movimientos_laborales")
public class MovimientoLaboralJpaEntity extends AuditableEntity {
    @Column(name = "colaborador_id", nullable = false)
    private Long colaboradorId;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "tipo_movimiento", nullable = false)
    private String tipoMovimiento;

    @Column(name = "categoria_anterior")
    private String categoriaAnterior;

    @Column(name = "categoria_nueva")
    private String categoriaNueva;

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "responsable_id", columnDefinition = "BINARY(16)")
    private UUID responsableId;

    @Column(name = "responsable_nombre")
    private String responsableNombre;

    public Long getColaboradorId() {
        return colaboradorId;
    }

    public void setColaboradorId(Long colaboradorId) {
        this.colaboradorId = colaboradorId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public String getCategoriaAnterior() {
        return categoriaAnterior;
    }

    public void setCategoriaAnterior(String categoriaAnterior) {
        this.categoriaAnterior = categoriaAnterior;
    }

    public String getCategoriaNueva() {
        return categoriaNueva;
    }

    public void setCategoriaNueva(String categoriaNueva) {
        this.categoriaNueva = categoriaNueva;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public UUID getResponsableId() {
        return responsableId;
    }

    public void setResponsableId(UUID responsableId) {
        this.responsableId = responsableId;
    }

    public String getResponsableNombre() {
        return responsableNombre;
    }

    public void setResponsableNombre(String responsableNombre) {
        this.responsableNombre = responsableNombre;
    }
}
