-- V1_1__seed_core.sql
-- Datos de ejemplo para core: departamentos, puestos y empleados

-- Departamentos
INSERT INTO departments (name) VALUES
  ('Recursos Humanos'),
  ('Tecnología'),
  ('Administración'),
  ('Ventas');

-- Puestos
INSERT INTO positions (name, department_id) VALUES
  ('HR Manager', (SELECT id FROM departments WHERE name = 'Recursos Humanos')),
  ('HR Analyst', (SELECT id FROM departments WHERE name = 'Recursos Humanos')),
  ('Tech Lead', (SELECT id FROM departments WHERE name = 'Tecnología')),
  ('Developer', (SELECT id FROM departments WHERE name = 'Tecnología')),
  ('Accounting Analyst', (SELECT id FROM departments WHERE name = 'Administración')),
  ('Sales Executive', (SELECT id FROM departments WHERE name = 'Ventas'));

-- Empleados
INSERT INTO employees (
  employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, termination_date, department_id, position_id, manager_id, status
) VALUES
-- Admin RRHH activo (sin manager)
('E-0001', 'Sofía', 'Gómez', 'DNI', '12345678', '1990-05-12', 'sofia.gomez@example.com', '+54-011-1234-5678', '2015-03-01', NULL,
  (SELECT id FROM departments WHERE name = 'Recursos Humanos'),
  (SELECT id FROM positions WHERE name = 'HR Manager'),
  NULL,
  'ACTIVE'
),
-- Tech Lead activo (manager: Sofía)
('E-0002', 'Martín', 'Pérez', 'DNI', '23456789', '1986-10-04', 'martin.perez@example.com', '+54-011-8765-4321', '2018-01-10', NULL,
  (SELECT id FROM departments WHERE name = 'Tecnología'),
  (SELECT id FROM positions WHERE name = 'Tech Lead'),
  (SELECT id FROM employees WHERE employee_number = 'E-0001'),
  'ACTIVE'
),
-- Developer activo (manager: Martín)
('E-0003', 'Ana', 'Lopez', 'DNI', '34567890', '1993-02-19', 'ana.lopez@example.com', '+54-011-1111-2222', '2020-07-15', NULL,
  (SELECT id FROM departments WHERE name = 'Tecnología'),
  (SELECT id FROM positions WHERE name = 'Developer'),
  (SELECT id FROM employees WHERE employee_number = 'E-0002'),
  'ACTIVE'
),
-- HR Analyst inactivo (terminado)
('E-0004', 'Laura', 'Fernández', 'DNI', '45678901', '1991-09-25', 'laura.fernandez@example.com', '+54-011-3333-4444', '2016-06-01', '2023-04-30',
  (SELECT id FROM departments WHERE name = 'Recursos Humanos'),
  (SELECT id FROM positions WHERE name = 'HR Analyst'),
  (SELECT id FROM employees WHERE employee_number = 'E-0001'),
  'TERMINATED'
),
-- Accounting Analyst activo
('E-0005', 'Juan', 'Ramírez', 'DNI', '56789012', '1989-11-11', 'juan.ramirez@example.com', '+54-011-5555-6666', '2017-09-20', NULL,
  (SELECT id FROM departments WHERE name = 'Administración'),
  (SELECT id FROM positions WHERE name = 'Accounting Analyst'),
  (SELECT id FROM employees WHERE employee_number = 'E-0001'),
  'ACTIVE'
),
-- Sales Executive activo
('E-0006', 'Micaela', 'Santos', 'DNI', '67890123', '1995-07-07', 'micaela.santos@example.com', '+54-011-6666-7777', '2022-03-05', NULL,
  (SELECT id FROM departments WHERE name = 'Ventas'),
  (SELECT id FROM positions WHERE name = 'Sales Executive'),
  (SELECT id FROM employees WHERE employee_number = 'E-0001'),
  'ACTIVE'
);
