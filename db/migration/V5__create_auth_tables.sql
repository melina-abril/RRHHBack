-- Módulo: inicio y cierre de sesión
-- Tabla de usuarios para la autenticación de cuentas administrativas de Recursos Humanos.
CREATE TABLE usuarios (
  id BINARY(16) NOT NULL,
  organizacion_id BINARY(16) NULL COMMENT 'Cada usuario puede pertenecer a una organización (null en esta etapa interna)',
  email VARCHAR(150) NOT NULL COMMENT 'PII',
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(30) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_usuarios PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
