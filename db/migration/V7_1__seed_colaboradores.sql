-- Datos de ejemplo del módulo de colaboradores

-- Colaboradores de ejemplo (activos y egresados)
INSERT INTO colaboradores (legajo, nombre, apellido, documento_tipo, documento_numero, pais_residencia, fecha_nacimiento, correo_personal, fecha_ingreso, categoria, dedicacion, modalidad_trabajo, rol_laboral, email_corporativo, estado)
VALUES
  ('C-2024-001', 'Marina', 'López', 'DNI', '10984722', 'Argentina', '1987-09-22', 'marina.lopez@example.com', '2014-11-01', 'Permanente', 'Full time', 'Remoto', 'Desarrolladora Sr', 'marina.lopez@techforb.com', 'ACTIVO'),
  ('C-2024-002', 'Sebastián', 'Costa', 'DNI', '20851946', 'México', '1991-01-14', 'sebastian.costa@example.com', '2018-02-15', 'Pasante', 'Part time', 'Presencial', 'Soporte', NULL, 'ACTIVO'),
  ('C-2024-003', 'Julieta', 'Bassi', 'DNI', '35470983', 'Uruguay', '1994-05-31', 'julieta.bassi@example.com', '2022-03-01', 'Permanente', 'Jornada reducida', 'Mixto', 'Analista', 'julieta.bassi@techforb.com', 'EGRESADO'),
  ('C-2024-004', 'Martín', 'Del Río', 'DNI', '22783147', 'Argentina', '1989-12-19', 'martin.delrio@example.com', '2016-12-12', 'Permanente', 'Full time', 'Remoto', 'Líder Técnico', 'martin.delrio@techforb.com', 'ACTIVO');

-- Movimientos laborales de ejemplo
INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2022-09-30', 'EGRESO', c.categoria, NULL, 'Fin de contrato', NULL, 'Santiago Ramírez'
FROM colaboradores c WHERE c.legajo = 'C-2024-003';

INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2023-05-01', 'ALTA', NULL, c.categoria, 'Ingreso a la empresa', NULL, 'Laura Gomez'
FROM colaboradores c WHERE c.legajo = 'C-2024-004';
