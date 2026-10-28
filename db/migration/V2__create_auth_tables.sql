-- Módulo: autenticación administrativa
-- Tablas para la cuenta administradora de RH (inicialmente única)
-- Extensible a múltiples cuentas administrativas si se decide evolucionar en SaaS

CREATE TABLE admin_accounts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE COMMENT 'PII',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'ADMIN_RRHH',
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  last_login_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_admin_accounts PRIMARY KEY (id),
  CONSTRAINT uq_admin_accounts_email UNIQUE (email),
  CONSTRAINT ck_admin_accounts_status CHECK (status IN ('ACTIVE','INACTIVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla para tokens de sesión JWT (si se requiere mantener una lista de sesiones válidas para logout controlado)
CREATE TABLE admin_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_account_id BIGINT UNSIGNED NOT NULL,
  jwt_token VARCHAR(512) NOT NULL,
  issued_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at DATETIME(3) NOT NULL,
  revoked TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_admin_sessions PRIMARY KEY (id),
  CONSTRAINT fk_admin_sessions_admin_account_id FOREIGN KEY (admin_account_id) REFERENCES admin_accounts(id) ON DELETE RESTRICT,
  CREATE INDEX ix_admin_sessions_admin_account_id ON admin_sessions(admin_account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
