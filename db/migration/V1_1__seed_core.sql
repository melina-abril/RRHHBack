-- Datos de ejemplo (ficticios).
-- Áreas
INSERT INTO departments (code, name) VALUES
  ('HR', 'Recursos Humanos'),
  ('TECH', 'Tecnología'),
  ('ADMIN', 'Administración');

-- Puestos
INSERT INTO positions (code, name, department_id)
SELECT 'HR-MGR', 'HR Manager', d.id FROM departments d WHERE d.code = 'HR';
INSERT INTO positions (code, name, department_id)
SELECT 'DEV', 'Developer', d.id FROM departments d WHERE d.code = 'TECH';
INSERT INTO positions (code, name, department_id)
SELECT 'QA', 'QA Analyst', d.id FROM departments d WHERE d.code = 'TECH';
INSERT INTO positions (code, name, department_id)
SELECT 'ADM-ASST', 'Admin Assistant', d.id FROM departments d WHERE d.code = 'ADMIN';

-- Empleados (legajos ficticios)
INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0001', 'Laura', 'Gomez', 'DNI', '32019876', '1990-03-15', 'laura.gomez@example.com', '3511234567', '2016-05-23', d.id, p.id, 'ACTIVE'
FROM departments d
JOIN positions p ON p.code = 'HR-MGR' AND p.department_id = d.id
WHERE d.code = 'HR';

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0002', 'Martín', 'Perez', 'DNI', '33345772', '1987-08-10', 'martin.perez@example.com', '3512378456', '2018-04-05', d.id, p.id, 'ACTIVE'
FROM departments d
JOIN positions p ON p.code = 'DEV' AND p.department_id = d.id
WHERE d.code = 'TECH';

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0003', 'Sofía', 'Rodriguez', 'DNI', '39876154', '1992-12-05', 'sofia.rodriguez@example.com', '3518456123', '2019-01-10', d.id, p.id, 'ON_LEAVE'
FROM departments d
JOIN positions p ON p.code = 'QA' AND p.department_id = d.id
WHERE d.code = 'TECH';

INSERT INTO employees (employee_number, first_name, last_name, document_type, document_number, birth_date, email, phone, hire_date, department_id, position_id, status)
SELECT 'E-0004', 'Lucas', 'Fernandez', 'DNI', '28457365', '1985-11-22', 'lucas.fernandez@example.com', '3513258741', '2015-09-03', d.id, p.id, 'ACTIVE'
FROM departments d
JOIN positions p ON p.code = 'ADM-ASST' AND p.department_id = d.id
WHERE d.code = 'ADMIN';

-- Jefes (manager_id): Sofía tiene como manager a Martín
UPDATE employees e
JOIN employees m ON m.employee_number = 'E-0002'
SET e.manager_id = m.id
WHERE e.employee_number = 'E-0003';

-- Usuarios del sistema (solo uno, administrador de RRHH)
-- Contraseña: Demo1234!  (hash bcrypt)
INSERT INTO users (id, email, password_hash, name, role, active)
VALUES ('5ae82590-ec64-4174-9d30-682668ca8202', 'admin.rrhh@example.com', '$2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO', 'Laura Gomez', 'ADMIN', 1);
