-- Módulo: Gestión de empleados
-- Depende de V1 (employees) como referencia; no vuelve a crear tablas compartidas.

-- Tabla principal de colaboradores
CREATE TABLE colaboradores (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  legajo VARCHAR(20) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  documento_tipo VARCHAR(10) NOT NULL,
  documento_numero VARCHAR(30) NOT NULL COMMENT 'PII',
  pais_residencia VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo_personal VARCHAR(150) NOT NULL COMMENT 'PII',
  fecha_ingreso DATE NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  dedicacion VARCHAR(50) NOT NULL,
  modalidad_trabajo VARCHAR(50) NOT NULL,
  rol_laboral VARCHAR(50) NOT NULL,
  email_corporativo VARCHAR(150) NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  CONSTRAINT pk_colaboradores PRIMARY KEY (id),
  CONSTRAINT uq_colaboradores_legajo UNIQUE (legajo),
  CONSTRAINT uq_colaboradores_documento UNIQUE (documento_tipo, documento_numero),
  CONSTRAINT uq_colaboradores_correo_personal UNIQUE (correo_personal),
  CONSTRAINT uq_colaboradores_email_corporativo UNIQUE (email_corporativo),
  CONSTRAINT ck_colaboradores_estado CHECK (estado IN ('ACTIVO','EGRESADO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Cambios y movimientos históricos de colaboradores (egresos, reingresos, cambios de categoría, etc)
CREATE TABLE movimientos_laborales (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  colaborador_id BIGINT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  tipo_movimiento VARCHAR(30) NOT NULL,
  categoria_anterior VARCHAR(50) NULL,
  categoria_nueva VARCHAR(50) NULL,
  motivo VARCHAR(200) NULL,
  responsable_id BINARY(16) NULL,
  responsable_nombre VARCHAR(100) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_movimientos_laborales PRIMARY KEY (id),
  CONSTRAINT fk_movimientos_laborales_colaborador_id FOREIGN KEY (colaborador_id) REFERENCES colaboradores (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX ix_colaboradores_legajo ON colaboradores (legajo);
CREATE INDEX ix_colaboradores_estado ON colaboradores (estado);
CREATE INDEX ix_movimientos_laborales_colaborador_id ON movimientos_laborales (colaborador_id);
