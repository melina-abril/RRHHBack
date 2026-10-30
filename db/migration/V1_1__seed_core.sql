-- Datos de ejemplo (ficticios) para áreas.
INSERT INTO departments (code, name) VALUES
  ('HR', 'Recursos Humanos'),
  ('TECH', 'Tecnología'),
  ('ADMIN', 'Administración'),
  ('SALES', 'Ventas');

-- Datos ficticios para puestos, con referencia a departments.
INSERT INTO positions (code, name, department_id) SELECT 'HR_MANAGER', 'Gerente de RRHH', id FROM departments WHERE code = 'HR';
INSERT INTO positions (code, name, department_id) SELECT 'DEV', 'Desarrollador/a', id FROM departments WHERE code = 'TECH';
INSERT INTO positions (code, name, department_id) SELECT 'ADMIN_ASSIST', 'Asistente Administrativo', id FROM departments WHERE code = 'ADMIN';
INSERT INTO positions (code, name, department_id) SELECT 'SALES_EXEC', 'Ejecutivo de Ventas', id FROM departments WHERE code = 'SALES';

-- Colaboradores de ejemplo, sin referenciar manager_id por ahora.
INSERT INTO employees (
  employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status
)
SELECT 
  'E-0001', 'Laura', 'Gomez', 'DNI', '12345678', '1990-02-03', 'laura.gomez@example.com', '+5491155551111', '2020-05-01',
  d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'HR' AND p.code = 'HR_MANAGER';

INSERT INTO employees (
  employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status
)
SELECT 
  'E-0002', 'Martín', 'Pérez', 'DNI', '22333444', '1988-07-15', 'martin.perez@example.com', '+5491155552222', '2021-01-10',
  d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'TECH' AND p.code = 'DEV';

INSERT INTO employees (
  employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status
)
SELECT 
  'E-0003', 'Carla', 'López', 'DNI', '33445566', '1992-11-25', 'carla.lopez@example.com', '+5491155553333', '2022-03-20',
  d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'TECH' AND p.code = 'DEV';

INSERT INTO employees (
  employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status
)
SELECT 
  'E-0004', 'Nicolás', 'Torres', 'DNI', '44556677', '1987-05-30', 'nicolas.torres@example.com', '+5491155554444', '2019-09-05',
  d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'ADMIN' AND p.code = 'ADMIN_ASSIST';

INSERT INTO employees (
  employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status
)
SELECT 
  'E-0005', 'Sofía', 'Martínez', 'DNI', '55667788', '1995-01-17', 'sofia.martinez@example.com', '+5491155555555', '2023-08-22',
  d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'SALES' AND p.code = 'SALES_EXEC';

-- Completa manager_id: E-0002 y E-0003 reportan a E-0001 (Laura Gomez)
UPDATE employees e
JOIN employees m ON m.employee_number = 'E-0001'
SET e.manager_id = m.id
WHERE e.employee_number IN ('E-0002', 'E-0003');

-- Usuario administrador activo (password: Demo1234!)
-- El hash corresponde a la contraseña Demo1234! (no cambiar): $2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO
INSERT INTO users (email, password_hash, name, role, active)
VALUES ('admin.rrhh@example.com', '$2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO', 'Administrador RRHH', 'ADMIN', 1);
