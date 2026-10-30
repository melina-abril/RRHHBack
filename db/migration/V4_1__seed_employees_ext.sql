-- Datos de ejemplo (ficticios) para tablas de Gestión de Empleados.

-- Asignaciones iniciales de colaboradores a proyectos y clientes.
INSERT INTO employee_assignments (employee_id, client, project, start_date, referrer_name)
SELECT e.id, 'ACME S.A.', 'Portal Web', '2023-08-01', 'Carlos Duarte'
FROM employees e WHERE e.employee_number = 'E-0001';

INSERT INTO employee_assignments (employee_id, client, project, start_date)
SELECT e.id, 'Techforb', 'Intranet', '2024-01-10'
FROM employees e WHERE e.employee_number = 'E-0002';

INSERT INTO employee_assignments (employee_id, client, project, start_date)
SELECT e.id, 'Globex', 'Sistema de Ventas', '2024-02-01'
FROM employees e WHERE e.employee_number = 'E-0004';

-- Documentos adjuntos.
INSERT INTO employee_documents (employee_id, title, category, description, file_url)
SELECT e.id, 'DNI digital', 'DOCUMENT', 'Documento escaneado', 'https://example.com/files/dni_laura_gomez.pdf' FROM employees e WHERE e.employee_number = 'E-0001';
INSERT INTO employee_documents (employee_id, title, category, file_url)
SELECT e.id, 'Constancia de AFIP', 'CERTIFICATE', 'https://example.com/files/cert_afip_martin_perez.pdf' FROM employees e WHERE e.employee_number = 'E-0002';

-- Perfiles profesionales, certificaciones y experiencia.
INSERT INTO employee_profiles (employee_id, profile_type, name, institution, start_date, end_date, description)
SELECT e.id, 'SKILL', 'Spring Boot', NULL, '2021-01-01', NULL, 'Desarrollo backend en Java' FROM employees e WHERE e.employee_number = 'E-0002';
INSERT INTO employee_profiles (employee_id, profile_type, name, institution, start_date, end_date)
SELECT e.id, 'CERTIFICATION', 'Scrum Master', 'Scrum.org', '2022-02-01', NULL FROM employees e WHERE e.employee_number = 'E-0001';

-- Bitácora: acontecimientos positivos y negativos.
INSERT INTO employee_journals (employee_id, event_date, type, description, status)
SELECT e.id, '2023-09-30', 'POSITIVE', 'Reconocimiento por desempeño destacado en el cierre de Q3.', 'RESOLVED' FROM employees e WHERE e.employee_number = 'E-0001';
INSERT INTO employee_journals (employee_id, event_date, type, description, status, project)
SELECT e.id, '2024-01-15', 'NEGATIVE', 'Incumplimiento de plazo en entrega de módulo.', 'IN_PROGRESS', 'Portal Web' FROM employees e WHERE e.employee_number = 'E-0002';
