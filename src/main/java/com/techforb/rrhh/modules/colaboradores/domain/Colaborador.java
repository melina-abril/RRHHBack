package com.techforb.rrhh.modules.colaboradores.domain;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad de dominio Colaborador. Incluye datos personales, laborales y de contacto.
 */
public class Colaborador {
    private final Long id;
    private final String legajo;
    private final String nombre;
    private final String apellido;
    private final String documentoTipo;
    private final String documentoNumero;
    private final String paisResidencia;
    private final LocalDate fechaNacimiento;
    private final String correoPersonal;
    private final LocalDate fechaIngreso;
    private final String categoria;
    private final String dedicacion;
    private final String modalidadTrabajo;
    private final String rolLaboral;
    private final String emailCorporativo;
    private final EstadoColaborador estado;
    private final UUID organizacionId;

    public Colaborador(Long id, String legajo, String nombre, String apellido, String documentoTipo, String documentoNumero, String paisResidencia, LocalDate fechaNacimiento,
                       String correoPersonal, LocalDate fechaIngreso, String categoria, String dedicacion, String modalidadTrabajo, String rolLaboral, String emailCorporativo,
                       EstadoColaborador estado, UUID organizacionId) {
        this.id = id;
        this.legajo = legajo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.documentoTipo = documentoTipo;
        this.documentoNumero = documentoNumero;
        this.paisResidencia = paisResidencia;
        this.fechaNacimiento = fechaNacimiento;
        this.correoPersonal = correoPersonal;
        this.fechaIngreso = fechaIngreso;
        this.categoria = categoria;
        this.dedicacion = dedicacion;
        this.modalidadTrabajo = modalidadTrabajo;
        this.rolLaboral = rolLaboral;
        this.emailCorporativo = emailCorporativo;
        this.estado = estado;
        this.organizacionId = organizacionId;
    }

    public Long getId() {
        return id;
    }

    public String getLegajo() {
        return legajo;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getDocumentoTipo() {
        return documentoTipo;
    }

    public String getDocumentoNumero() {
        return documentoNumero;
    }

    public String getPaisResidencia() {
        return paisResidencia;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public String getCorreoPersonal() {
        return correoPersonal;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getDedicacion() {
        return dedicacion;
    }

    public String getModalidadTrabajo() {
        return modalidadTrabajo;
    }

    public String getRolLaboral() {
        return rolLaboral;
    }

    public String getEmailCorporativo() {
        return emailCorporativo;
    }

    public EstadoColaborador getEstado() {
        return estado;
    }
    
    public UUID getOrganizacionId() {
        return organizacionId;
    }
}
