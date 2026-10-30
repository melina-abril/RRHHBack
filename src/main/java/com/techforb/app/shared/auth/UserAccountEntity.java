package com.techforb.app.shared.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * Usuario que inicia sesión. La tabla "users" la crea la capa database con estas columnas; su seed trae al menos
 * un usuario activo con un rol que exista en el sistema y el hash bcrypt de una contraseña documentada.
 */
@Entity
@Table(name = "users")
public class UserAccountEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "email", length = 150, nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", length = 100, nullable = false)
    private String passwordHash;

    @Column(name = "name", length = 120, nullable = false)
    private String name;

    /** Código del rol (ej. ADMIN): el mismo que usan @PreAuthorize("hasRole('ADMIN')") y el front. */
    @Column(name = "role", length = 40, nullable = false)
    private String role;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected UserAccountEntity() {
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
