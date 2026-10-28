-- V2__create_auth_tables.sql
-- Módulo: Inicio de sesión y auditoría de accesos
-- Administra la autenticación de la cuenta de Recursos Humanos y registra los accesos y cierres de sesión para trazabilidad.

-- Tabla para auditar accesos: registro de inicio y cierre de sesión, responsable y dirección IP.
CREATE TABLE auth_session_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NOT NULL,
  login_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  logout_at DATETIME(3) NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  -- Observación opcional o razón del cierre
  note VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_auth_session_logs PRIMARY KEY (id),
  CONSTRAINT fk_auth_session_logs_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
  KEY ix_auth_session_logs_employee_id (employee_id),
  KEY ix_auth_session_logs_login_at (login_at),
  KEY ix_auth_session_logs_logout_at (logout_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
