# Core: colecciones compartidas

## users

Usuarios del sistema y sus permisos de acceso. Id del documento: uid de Firebase Auth ("admin-rrhh").

| Campo        | Tipo     | Obligatorio | Descripción                                                         |
|--------------|----------|-------------|---------------------------------------------------------------------|
| email        | string   | sí          | Correo electrónico de autenticación                                 |
| name         | string   | sí          | Nombre y apellido para mostrar                                      |
| role         | string   | sí          | Rol del usuario (`ADMIN`, `EMPLOYEE`)                               |
| employeeId   | string   | sí          | Id del legajo asociado ("E-0001", "E-0002"), referenciado en employees |
| active       | boolean  | sí          | Si el usuario está habilitado (acceso al sistema)                   |
| createdAt    | timestamp| sí          | Fecha de alta del usuario                                           |

Notas: Los usuarios sólo se crean mediante createDemoUsers. La contraseña demo de ejemplo es Demo1234!.

## departments

Áreas internas. Id del documento: código (`HR`, `IT`, `ADMIN`, `COM`).

| Campo       | Tipo     | Obligatorio | Descripción          |
|-------------|----------|-------------|----------------------|
| name        | string   | sí          | Nombre del área      |
| createdAt   | timestamp| sí          | Alta del documento   |

## positions

Puestos/roles laborales de la organización. Id del documento: código (ej. `IT_DEV`, `HR_MANAGER`).

| Campo        | Tipo     | Obligatorio | Descripción                    |
|--------------|----------|-------------|--------------------------------|
| name         | string   | sí          | Nombre del puesto              |
| departmentId | string   | sí          | Código del área, referencia a departments |
| createdAt    | timestamp| sí          | Alta del documento             |

## employees

Colaboradores de la empresa. Id del documento: legajo (`E-0001`, `E-0002`…)

| Campo          | Tipo      | Obligatorio | Descripción                                      |
|----------------|-----------|-------------|--------------------------------------------------|
| employeeNumber | string    | sí          | Legajo único                                     |
| firstName      | string    | sí          | Nombre                                           |
| lastName       | string    | sí          | Apellido                                         |
| documentType   | string    | sí          | Tipo de documento (`DNI`, `CUIT`…)               |
| documentNumber | string    | sí          | Número de documento                              |
| birthDate      | timestamp | sí          | Fecha de nacimiento                              |
| email          | string    | sí          | Correo electrónico del colaborador               |
| phone          | string    | sí          | Teléfono                                         |
| hireDate       | timestamp | sí          | Fecha de ingreso                                 |
| terminationDate| timestamp | no          | Fecha de egreso (si terminó)                     |
| departmentId   | string    | sí          | Área, referencia a departments                   |
| positionId     | string    | sí          | Puesto, referencia a positions                   |
| managerId      | string    | no          | Legajo del responsable, referencia a employees   |
| status         | string    | sí          | Estado (`ACTIVE`, `ON_LEAVE`, `TERMINATED`)      |
| deletedAt      | timestamp | no          | Borrado lógico si corresponde                    |
| createdAt      | timestamp | sí          | Fecha de alta del documento                      |
| updatedAt      | timestamp | sí          | Fecha de última actualización                    |

Índices: por defecto, consulta por employeeNumber, status y combinación de filtros con paginación.
