package com.techforb.rrhh.modules.auth.domain;

import java.util.UUID;

/**
 * Usuario del sistema de gestión RH
 */
public class Usuario {
    private UUID id;
    private String email;
    private String nombre;
    private String hashPassword;
    private String rol; // ADMIN_RRHH
    private UUID organizacionId;
    private boolean activo;

    public Usuario(UUID id, String email, String nombre, String hashPassword, String rol, UUID organizacionId, boolean activo) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.hashPassword = hashPassword;
        this.rol = rol;
        this.organizacionId = organizacionId;
        this.activo = activo;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getHashPassword() {
        return hashPassword;
    }

    public String getRol() {
        return rol;
    }

    public UUID getOrganizacionId() {
        return organizacionId;
    }

    public boolean isActivo() {
        return activo;
    }
}