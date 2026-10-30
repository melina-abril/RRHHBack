-- Gestión de empleados: tabla de historial de movimientos laborales de cada colaborador (altas, egresos, reingresos, cambios de categoría, etc).
-- Depende de V1 (employees): employees ya está creada como tabla compartida.

-- Movimientos laborales (histórico de cambios de estado y eventos relevantes en la relación laboral).
CREATE TABLE employment_movements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(30) NOT NULL,
  action_date DATE NOT NULL,
  previous_value VARCHAR(100) NULL,
  new_value VARCHAR(100) NULL,
  reason VARCHAR(500) NULL,
  responsible VARCHAR(100) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_employment_movements PRIMARY KEY (id),
  CONSTRAINT fk_employment_movements_employee_id FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE RESTRICT,
  CONSTRAINT ck_employment_movements_action CHECK (action IN ('ALTA', 'EDICION', 'EGRESO', 'REINGRESO', 'CAMBIO_CATEGORIA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_employment_movements_employee_id ON employment_movements (employee_id);
CREATE INDEX ix_employment_movements_action_date ON employment_movements (action_date);
