-- V1__create_core_tables.sql
-- Tablas compartidas: departments, positions, employees

-- Tabla de departamentos (áreas)
CREATE TABLE departments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_departments_name (name),
  KEY ix_departments_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de puestos/roles internos
CREATE TABLE positions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_positions_name (name),
  KEY ix_positions_department_id (department_id),
  CONSTRAINT fk_positions_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de empleados (legajos)
CREATE TABLE employees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  document_type VARCHAR(10) NOT NULL COMMENT 'PII',
  document_number VARCHAR(30) NOT NULL COMMENT 'PII',
  birth_date DATE NOT NULL,
  email VARCHAR(150) NOT NULL COMMENT 'PII',
  phone VARCHAR(30) NULL COMMENT 'PII',
  hire_date DATE NOT NULL,
  termination_date DATE NULL,
  department_id BIGINT UNSIGNED NOT NULL,
  position_id BIGINT UNSIGNED NOT NULL,
  manager_id BIGINT UNSIGNED NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  deleted_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_employees_employee_number (employee_number),
  UNIQUE KEY uq_employees_document (document_type, document_number),
  UNIQUE KEY uq_employees_email (email),
  KEY ix_employees_department_id (department_id),
  KEY ix_employees_position_id (position_id),
  KEY ix_employees_manager_id (manager_id),
  CONSTRAINT fk_employees_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_position_id FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_manager_id FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE RESTRICT,
  CONSTRAINT chk_employees_status CHECK (status IN ('ACTIVE','ON_LEAVE','TERMINATED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
