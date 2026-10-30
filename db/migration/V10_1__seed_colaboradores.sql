-- Datos de ejemplo del módulo de colaboradores (ficticios, coherentes con la estructura del sistema).

-- Inserta algunos colaboradores de ejemplo (la ficha individual y alta usan estos datos).
INSERT INTO colaboradores (legajo, nombre, apellido, documento_tipo, documento_numero, pais_residencia, fecha_nacimiento, correo_personal, fecha_ingreso, categoria, dedicacion, modalidad_trabajo, rol_laboral, email_corporativo, estado)
VALUES
  ('L-1001', 'Victoria', 'Sánchez', 'DNI', '13579113', 'Argentina', '1992-02-10', 'victoria.sanchez@example.com', '2020-08-15', 'Permanente', 'Full-time', 'Remoto', 'Desarrollador', 'victoria.sanchez@techforb.com', 'ACTIVO'),
  ('L-1002', 'Joaquín', 'López', 'CI', 'AB001234', 'México', '1989-11-08', 'joaquin.lopez@example.com', '2019-03-12', 'Pasante', 'Part-time', 'Presencial', 'Soporte', NULL, 'ACTIVO'),
  ('L-1003', 'Camila', 'Bustamante', 'DNI', '22334455', 'Argentina', '1996-05-22', 'camila.bustamante@example.com', '2023-01-20', 'Pasante', 'Part-time', 'Remoto', 'Desarrollador', NULL, 'ACTIVO'),
  ('L-1004', 'Martín', 'Suárez', 'DNI', '77665544', 'Argentina', '1984-06-09', 'martin.suarez@example.com', '2015-10-10', 'Permanente', 'Full-time', 'Híbrido', 'Líder Técnico', 'martin.suarez@techforb.com', 'ACTIVO'),
  ('L-1005', 'Paula', 'Ferreyra', 'DNI', '99887766', 'Argentina', '1991-09-16', 'paula.ferreyra@example.com', '2021-04-01', 'Permanente', 'Full-time', 'Híbrido', 'Analista de RRHH', 'paula.ferreyra@techforb.com', 'ACTIVO');

-- Movimientos laborales de ejemplo (altas y algún cambio de categoría o egreso)
INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2020-08-15', 'ALTA', NULL, 'Permanente', NULL, UNHEX('123e4567e89b12d3a456426655440000'), 'Laura Gomez' FROM colaboradores c WHERE c.legajo = 'L-1001';

INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2019-03-12', 'ALTA', NULL, 'Pasante', NULL, UNHEX('123e4567e89b12d3a456426655440001'), 'Gastón Martinez' FROM colaboradores c WHERE c.legajo = 'L-1002';

INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2023-01-20', 'ALTA', NULL, 'Pasante', NULL, UNHEX('123e4567e89b12d3a456426655440001'), 'Gastón Martinez' FROM colaboradores c WHERE c.legajo = 'L-1003';

INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2015-10-10', 'ALTA', NULL, 'Permanente', NULL, UNHEX('123e4567e89b12d3a456426655440000'), 'Laura Gomez' FROM colaboradores c WHERE c.legajo = 'L-1004';

INSERT INTO movimientos_laborales (colaborador_id, fecha, tipo_movimiento, categoria_anterior, categoria_nueva, motivo, responsable_id, responsable_nombre)
SELECT c.id, '2021-04-01', 'ALTA', NULL, 'Permanente', NULL, UNHEX('123e4567e89b12d3a456426655440002'), 'Raquel Perez' FROM colaboradores c WHERE c.legajo = 'L-1005';
