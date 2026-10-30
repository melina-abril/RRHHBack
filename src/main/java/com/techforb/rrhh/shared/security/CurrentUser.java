package com.techforb.rrhh.shared.security;

import java.util.UUID;

/**
 * Representación del usuario autenticado en sesión.
 */
public class CurrentUser {
    private final UUID id;
    private final String nombre;
    private final String email;
    private final String rol;
    private final UUID organizacionId;

    public CurrentUser(UUID id, String nombre, String email, String rol, UUID organizacionId) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.organizacionId = organizacionId;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public UUID getOrganizacionId() {
        return organizacionId;
    }
}
