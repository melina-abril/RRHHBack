-- Tabla: departments (áreas o departamentos)
CREATE TABLE departments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Índice único para el nombre del departamento
CREATE UNIQUE INDEX uq_departments_name ON departments(name);


-- Tabla: positions (puestos/cargos disponibles)
CREATE TABLE positions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_positions_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_positions_department_id ON positions(department_id);
CREATE UNIQUE INDEX uq_positions_name_department ON positions(name, department_id);


-- Tabla: employees (empleados)
CREATE TABLE employees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(20) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  document_type VARCHAR(20) NOT NULL COMMENT 'PII',
  document_number VARCHAR(30) NOT NULL COMMENT 'PII',
  birth_date DATE NOT NULL,
  email VARCHAR(120) NOT NULL COMMENT 'PII',
  phone VARCHAR(20) NULL COMMENT 'PII',
  hire_date DATE NOT NULL,
  termination_date DATE NULL,
  department_id BIGINT UNSIGNED NOT NULL,
  position_id BIGINT UNSIGNED NOT NULL,
  manager_id BIGINT UNSIGNED NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT fk_employees_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_position_id FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_manager_id FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE RESTRICT,
  CONSTRAINT chk_employees_status CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'TERMINATED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX uq_employees_employee_number ON employees(employee_number);
CREATE UNIQUE INDEX uq_employees_document_type_number ON employees(document_type, document_number);
CREATE UNIQUE INDEX uq_employees_email ON employees(email);
CREATE INDEX ix_employees_department_id ON employees(department_id);
CREATE INDEX ix_employees_position_id ON employees(position_id);
CREATE INDEX ix_employees_manager_id ON employees(manager_id);
