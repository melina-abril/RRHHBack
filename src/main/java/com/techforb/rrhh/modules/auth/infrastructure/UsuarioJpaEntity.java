package com.techforb.rrhh.modules.auth.infrastructure;

import com.techforb.rrhh.shared.domain.AuditableEntity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class UsuarioJpaEntity extends AuditableEntity {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "rol", nullable = false)
    private String rol;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    // UUID id está en AuditableEntity

    public UsuarioJpaEntity() { }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    // Métodos de AuditableEntity: getId(), getOrganizacionId() ...
}
