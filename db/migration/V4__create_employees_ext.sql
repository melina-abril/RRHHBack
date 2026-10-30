-- Módulo: Gestión de Empleados (duplicados excluidos). Depende de V1 (core: departments, positions, employees).
-- Tablas principales ya están definidas en el core, así que aquí NO se repiten empleados, positions ni departments.
-- Solo se agregan datos extensibles y nuevas entidades propias de la ficha, asignaciones, perfiles, etc.

-- Asignaciones de empleados a cliente/proyecto y referente inicial (una persona puede estar en varios proyectos simultáneamente y conservar su historial).
CREATE TABLE employee_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NOT NULL,
  client VARCHAR(100) NULL,
  project VARCHAR(100) NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  referrer_name VARCHAR(100) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_employee_assignments PRIMARY KEY (id),
  CONSTRAINT fk_employee_assignments_employee_id FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE RESTRICT,
  CONSTRAINT ck_employee_assignments_dates CHECK (end_date IS NULL OR end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_employee_assignments_employee_id ON employee_assignments (employee_id);
CREATE INDEX ix_employee_assignments_start_date ON employee_assignments (start_date);
CREATE INDEX ix_employee_assignments_project ON employee_assignments (project);

-- Documentos adjuntos por colaborador (sección Documentación de la ficha).
CREATE TABLE employee_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(250) NULL,
  file_url VARCHAR(300) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_employee_documents PRIMARY KEY (id),
  CONSTRAINT fk_employee_documents_employee_id FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_employee_documents_employee_id ON employee_documents (employee_id);
CREATE INDEX ix_employee_documents_title ON employee_documents (title);

-- Perfiles profesionales, conocimientos, herramientas, experiencia, certificaciones por colaborador.
CREATE TABLE employee_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NOT NULL,
  profile_type VARCHAR(40) NOT NULL, -- Ej: "SKILL", "CERTIFICATION", "EXPERIENCE", "TOOL"
  name VARCHAR(100) NOT NULL,
  institution VARCHAR(100) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  description VARCHAR(250) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_employee_profiles PRIMARY KEY (id),
  CONSTRAINT fk_employee_profiles_employee_id FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_employee_profiles_employee_id ON employee_profiles (employee_id);
CREATE INDEX ix_employee_profiles_profile_type ON employee_profiles (profile_type);
CREATE INDEX ix_employee_profiles_name ON employee_profiles (name);

-- Bitácora: positivos/negativos, historial de acontecimientos por colaborador
CREATE TABLE employee_journals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NOT NULL,
  event_date DATE NOT NULL,
  type VARCHAR(20) NOT NULL, -- "POSITIVE" o "NEGATIVE"
  description VARCHAR(500) NOT NULL,
  project VARCHAR(100) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_employee_journals PRIMARY KEY (id),
  CONSTRAINT fk_employee_journals_employee_id FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE RESTRICT,
  CONSTRAINT ck_employee_journals_type CHECK (type IN ('POSITIVE','NEGATIVE')),
  CONSTRAINT ck_employee_journals_status CHECK (status IN ('OPEN','IN_PROGRESS','RESOLVED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_employee_journals_employee_id ON employee_journals (employee_id);
CREATE INDEX ix_employee_journals_event_date ON employee_journals (event_date);
CREATE INDEX ix_employee_journals_status ON employee_journals (status);
