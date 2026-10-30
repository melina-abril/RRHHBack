-- Datos de ejemplo (ficticios).
-- Áreas (departments)
INSERT INTO departments (code, name) VALUES
  ('TECH', 'Tecnología'),
  ('HR', 'Recursos Humanos'),
  ('ADMIN', 'Administración');

-- Puestos (positions)
INSERT INTO positions (name, department_id) SELECT 'Desarrollador', d.id FROM departments d WHERE d.code = 'TECH';
INSERT INTO positions (name, department_id) SELECT 'Líder Técnico', d.id FROM departments d WHERE d.code = 'TECH';
INSERT INTO positions (name, department_id) SELECT 'Analista de RRHH', d.id FROM departments d WHERE d.code = 'HR';
INSERT INTO positions (name, department_id) SELECT 'Administrador', d.id FROM departments d WHERE d.code = 'ADMIN';
INSERT INTO positions (name, department_id) SELECT 'Soporte', d.id FROM departments d WHERE d.code = 'TECH';

-- Colaboradores (employees)
-- Managers primero (sin manager_id)
INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0001', 'Laura', 'Gomez', 'DNI', '12345678', '1984-07-12', 'laura.gomez@example.com', '555-1010', '2015-04-10', d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'HR' AND p.name = 'Analista de RRHH' AND p.department_id = d.id;

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0002', 'Gastón', 'Martinez', 'DNI', '87654321', '1981-01-25', 'gaston.martinez@example.com', '555-2020', '2016-09-12', d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'TECH' AND p.name = 'Líder Técnico' AND p.department_id = d.id;

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0003', 'Raquel', 'Perez', 'DNI', '23456789', '1990-03-10', 'raquel.perez@example.com', '555-3030', '2018-03-01', d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'ADMIN' AND p.name = 'Administrador' AND p.department_id = d.id;

-- Otros empleados (con manager asignado después)
INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0004', 'Santiago', 'Ramirez', 'DNI', '23412345', '1995-06-21', 'santiago.ramirez@example.com', '555-4040', '2021-01-17', d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'TECH' AND p.name = 'Desarrollador' AND p.department_id = d.id;

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0005', 'Luciana', 'Prieto', 'DNI', '34567890', '1992-11-03', 'luciana.prieto@example.com', '555-5050', '2019-10-30', d.id, p.id, 'ACTIVE'
FROM departments d JOIN positions p ON d.code = 'TECH' AND p.name = 'Soporte' AND p.department_id = d.id;

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0006', 'Pablo', 'Delgado', 'DNI', '55667788', '1988-05-17', 'pablo.delgado@example.com', '555-6060', '2017-07-24', d.id, p.id, 'ON_LEAVE'
FROM departments d JOIN positions p ON d.code = 'HR' AND p.name = 'Analista de RRHH' AND p.department_id = d.id;

-- Asigna managers a empleados (solo si manager_id corresponde a otro empleado, usando employee_number)
UPDATE employees e
  JOIN employees m ON m.employee_number = 'E-0002'
SET e.manager_id = m.id
WHERE e.employee_number IN ('E-0004','E-0005');

UPDATE employees e
  JOIN employees m ON m.employee_number = 'E-0001'
SET e.manager_id = m.id
WHERE e.employee_number = 'E-0006';
