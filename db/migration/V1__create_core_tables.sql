-- Áreas de la empresa.
CREATE TABLE departments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_departments PRIMARY KEY (id),
  CONSTRAINT uq_departments_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_departments_code ON departments (code);

-- Puestos de la empresa, vinculados a área.
CREATE TABLE positions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(40) NOT NULL,
  name VARCHAR(100) NOT NULL,
  department_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_positions PRIMARY KEY (id),
  CONSTRAINT uq_positions_code UNIQUE (code),
  CONSTRAINT fk_positions_department_id FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_positions_department_id ON positions (department_id);
CREATE INDEX ix_positions_code ON positions (code);

-- Colaboradores/legajos: cada empleado pertenece a un área y a un puesto, puede tener jefe, con borrado lógico.
CREATE TABLE employees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_number VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  document_type VARCHAR(20) NOT NULL,
  document_number VARCHAR(30) NOT NULL COMMENT 'PII',
  birth_date DATE NOT NULL,
  email VARCHAR(150) NOT NULL COMMENT 'PII',
  phone VARCHAR(30) NOT NULL,
  hire_date DATE NOT NULL,
  termination_date DATE NULL,
  department_id BIGINT UNSIGNED NOT NULL,
  position_id BIGINT UNSIGNED NOT NULL,
  manager_id BIGINT UNSIGNED NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_employees PRIMARY KEY (id),
  CONSTRAINT uq_employees_employee_number UNIQUE (employee_number),
  CONSTRAINT uq_employees_document UNIQUE (document_type, document_number),
  CONSTRAINT uq_employees_email UNIQUE (email),
  CONSTRAINT fk_employees_department_id FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_position_id FOREIGN KEY (position_id) REFERENCES positions (id) ON DELETE RESTRICT,
  CONSTRAINT fk_employees_manager_id FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE RESTRICT,
  CONSTRAINT ck_employees_status CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'TERMINATED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_employees_department_id ON employees (department_id);
CREATE INDEX ix_employees_position_id ON employees (position_id);
CREATE INDEX ix_employees_manager_id ON employees (manager_id);
CREATE INDEX ix_employees_employee_number ON employees (employee_number);
CREATE INDEX ix_employees_email ON employees (email);

-- Usuarios de acceso interno.
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(40) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_users_email ON users (email);
