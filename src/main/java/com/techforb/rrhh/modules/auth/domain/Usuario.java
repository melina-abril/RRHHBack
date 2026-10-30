package com.techforb.rrhh.modules.auth.domain;

import java.util.UUID;
/**
 * Usuario del sistema RRHH (admin RRHH TECHFORB, preparado para futuro multi-org).
 */
public class Usuario {
    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final String nombre;
    private final String rol;
    private final UUID organizacionId;
    private final boolean activo;

    public Usuario(UUID id, String email, String passwordHash, String nombre, String rol, UUID organizacionId, boolean activo) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.nombre = nombre;
        this.rol = rol;
        this.organizacionId = organizacionId;
        this.activo = activo;
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getNombre() { return nombre; }
    public String getRol() { return rol; }
    public UUID getOrganizacionId() { return organizacionId; }
    public boolean isActivo() { return activo; }
}
