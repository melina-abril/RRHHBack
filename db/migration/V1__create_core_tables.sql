-- Tabla: departments (áreas/departamentos)
CREATE TABLE departments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: positions (puestos)
CREATE TABLE positions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT uq_positions_department_name UNIQUE (department_id, name),
  CONSTRAINT fk_positions_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE INDEX ix_positions_department_id ON positions(department_id);

-- Tabla: employees (legajos/personas)
CREATE TABLE employees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  document_type VARCHAR(10) NOT NULL COMMENT 'PII',
  document_number VARCHAR(30) NOT NULL COMMENT 'PII',
  birth_date DATE NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE COMMENT 'PII',
  phone VARCHAR(30) NULL COMMENT 'PII',
  hire_date DATE NOT NULL,
  termination_date DATE NULL,
  department_id BIGINT UNSIGNED NOT NULL,
  position_id BIGINT UNSIGNED NOT NULL,
  manager_id BIGINT UNSIGNED NULL,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT uq_employees_document UNIQUE (document_type, document_number),
  CONSTRAINT fk_employees_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_position_id FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_manager_id FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE RESTRICT,
  CONSTRAINT ck_employees_status CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'TERMINATED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE INDEX ix_employees_department_id ON employees(department_id);
CREATE INDEX ix_employees_position_id ON employees(position_id);
CREATE INDEX ix_employees_manager_id ON employees(manager_id);
