package com.techforb.rrhh.modules.auth.infrastructure;

import com.techforb.rrhh.shared.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class UsuarioJpaEntity extends AuditableEntity {
    @Id
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(name = "password_hash", nullable = false)
    private String hashPassword;
    
    @Column(nullable = false)
    private String rol;
    
    @Column(name = "organizacion_id", nullable = false)
    private UUID organizacionId;
    
    @Column(nullable = false)
    private boolean activo;

    // Getters y setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getHashPassword() { return hashPassword; }
    public void setHashPassword(String hashPassword) { this.hashPassword = hashPassword; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public UUID getOrganizacionId() { return organizacionId; }
    public void setOrganizacionId(UUID organizacionId) { this.organizacionId = organizacionId; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
