package com.techforb.rrhh.modules.colaboradores.infrastructure;

import com.techforb.rrhh.shared.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;

/**
 * Entidad JPA para la tabla colaboradores.
 * Extiende AuditableEntity para multi-organización y auditoría.
 */
@Entity
@Table(name = "colaboradores")
public class ColaboradorJpaEntity extends AuditableEntity {

    @Column(name = "legajo", nullable = false, unique = true, updatable = false)
    private String legajo;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "documento_tipo", nullable = false)
    private String documentoTipo;

    @Column(name = "documento_numero", nullable = false)
    private String documentoNumero;

    @Column(name = "pais_residencia", nullable = false)
    private String paisResidencia;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "correo_personal", nullable = false)
    private String correoPersonal;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "categoria", nullable = false)
    private String categoria;

    @Column(name = "dedicacion", nullable = false)
    private String dedicacion;

    @Column(name = "modalidad_trabajo", nullable = false)
    private String modalidadTrabajo;

    @Column(name = "rol_laboral", nullable = false)
    private String rolLaboral;

    @Column(name = "email_corporativo")
    private String emailCorporativo;

    @Column(name = "estado", nullable = false)
    private String estado;

    public String getLegajo() {
        return legajo;
    }

    public void setLegajo(String legajo) {
        this.legajo = legajo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getDocumentoTipo() {
        return documentoTipo;
    }

    public void setDocumentoTipo(String documentoTipo) {
        this.documentoTipo = documentoTipo;
    }

    public String getDocumentoNumero() {
        return documentoNumero;
    }

    public void setDocumentoNumero(String documentoNumero) {
        this.documentoNumero = documentoNumero;
    }

    public String getPaisResidencia() {
        return paisResidencia;
    }

    public void setPaisResidencia(String paisResidencia) {
        this.paisResidencia = paisResidencia;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getCorreoPersonal() {
        return correoPersonal;
    }

    public void setCorreoPersonal(String correoPersonal) {
        this.correoPersonal = correoPersonal;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDedicacion() {
        return dedicacion;
    }

    public void setDedicacion(String dedicacion) {
        this.dedicacion = dedicacion;
    }

    public String getModalidadTrabajo() {
        return modalidadTrabajo;
    }

    public void setModalidadTrabajo(String modalidadTrabajo) {
        this.modalidadTrabajo = modalidadTrabajo;
    }

    public String getRolLaboral() {
        return rolLaboral;
    }

    public void setRolLaboral(String rolLaboral) {
        this.rolLaboral = rolLaboral;
    }

    public String getEmailCorporativo() {
        return emailCorporativo;
    }

    public void setEmailCorporativo(String emailCorporativo) {
        this.emailCorporativo = emailCorporativo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
