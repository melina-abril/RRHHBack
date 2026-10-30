-- Datos de ejemplo: historial de movimientos para la gestión de empleados.
-- Asocia movimientos a empleados existentes por employee_number, no por id fijo.

-- Alta (ingreso original) para Laura Gomez
INSERT INTO employment_movements (employee_id, action, action_date, new_value, responsible)
SELECT e.id, 'ALTA', '2015-04-10', 'Permanente', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0001';

-- Alta para Gastón Martinez
INSERT INTO employment_movements (employee_id, action, action_date, new_value, responsible)
SELECT e.id, 'ALTA', '2016-09-12', 'Permanente', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0002';

-- Alta para Raquel Perez
INSERT INTO employment_movements (employee_id, action, action_date, new_value, responsible)
SELECT e.id, 'ALTA', '2018-03-01', 'Permanente', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0003';

-- Alta para Santiago Ramirez
INSERT INTO employment_movements (employee_id, action, action_date, new_value, responsible)
SELECT e.id, 'ALTA', '2021-01-17', 'Pasante', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0004';

-- Cambio de categoría para Santiago Ramirez
INSERT INTO employment_movements (employee_id, action, action_date, previous_value, new_value, responsible)
SELECT e.id, 'CAMBIO_CATEGORIA', '2023-07-01', 'Pasante', 'Permanente', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0004';

-- Egreso para Luciana Prieto
INSERT INTO employment_movements (employee_id, action, action_date, previous_value, new_value, reason, responsible)
SELECT e.id, 'EGRESO', '2025-02-15', 'Permanente', 'Egresado', 'Fin de contrato', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0005';

-- Reingreso para Luciana Prieto
INSERT INTO employment_movements (employee_id, action, action_date, previous_value, new_value, responsible)
SELECT e.id, 'REINGRESO', '2026-03-01', 'Egresado', 'Permanente', 'sofia.ruiz@example.com'
FROM employees e WHERE e.employee_number = 'E-0005';
