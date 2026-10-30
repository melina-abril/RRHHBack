-- Módulo: inicio y cierre de sesión (auth).
-- Tabla de usuarios administrativos del sistema (solo RRHH, no colaboradores comunes).
CREATE TABLE usuarios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organizacion_id BINARY(16) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(120) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  created_by VARCHAR(100) NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by VARCHAR(100) NOT NULL,
  CONSTRAINT pk_usuarios PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT ck_usuarios_rol CHECK (rol IN ('ADMIN_RRHH')),
  CONSTRAINT ck_usuarios_activo CHECK (activo IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
