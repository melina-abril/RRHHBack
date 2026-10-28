-- Módulo: autenticación administrativa
-- Depende de V1 (employees). No vuelve a crear tablas compartidas.

-- Tabla: admin_users (usuarios administradores de RRHH con credenciales locales)
CREATE TABLE admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NULL,
  email VARCHAR(120) NOT NULL COMMENT 'PII',
  password_hash VARCHAR(255) NOT NULL COMMENT 'PII',
  role VARCHAR(30) NOT NULL DEFAULT 'ADMIN_RRHH',
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  last_login_at DATETIME(3) NULL,
  CONSTRAINT pk_admin_users PRIMARY KEY (id),
  CONSTRAINT uq_admin_users_email UNIQUE (email),
  CONSTRAINT fk_admin_users_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_admin_users_employee_id ON admin_users(employee_id);

-- Tabla: admin_sessions (sesiones activas de usuarios admin)
CREATE TABLE admin_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  issued_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at DATETIME(3) NOT NULL,
  revoked_at DATETIME(3) NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_admin_sessions PRIMARY KEY (id),
  CONSTRAINT fk_admin_sessions_user_id FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE RESTRICT,
  CONSTRAINT uq_admin_sessions_session_token UNIQUE (session_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX ix_admin_sessions_issued_at ON admin_sessions(issued_at);

-- Tabla: admin_login_history (historial de accesos de administradores)
CREATE TABLE admin_login_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  login_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  success TINYINT(1) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  fail_reason VARCHAR(100) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_admin_login_history PRIMARY KEY (id),
  CONSTRAINT fk_admin_login_history_user_id FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_admin_login_history_user_id ON admin_login_history(user_id);
CREATE INDEX ix_admin_login_history_login_at ON admin_login_history(login_at);
