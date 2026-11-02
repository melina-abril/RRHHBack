# Colecciones principales (core)

## users

Usuarios autenticados del sistema. Una entrada por cada acceso permitido. Id del documento: uid de Firebase Auth.

| Campo         | Tipo     | Obligatorio | Descripción                                             |
|---------------|----------|-------------|---------------------------------------------------------|
| email         | string   | sí          | Correo electrónico (único)                              |
| name          | string   | sí          | Nombre visible                                          |
| role          | string   | sí          | Rol asignado (`ADMIN`, `HR_ANALYST`, `EMPLOYEE`)        |
| employeeId    | string   | no          | Id de empleado relacionado (coincide con legajo)        |
| active        | boolean  | sí          | Si el usuario está activo                               |
| createdAt     | timestamp| sí          | Fecha y hora de alta                                    |

## departments

Áreas internas de la empresa. Id del documento: código del área (`HR`, `IT`, ...).

| Campo         | Tipo     | Obligatorio | Descripción            |
|---------------|----------|-------------|------------------------|
| name          | string   | sí          | Nombre del área        |
| createdAt     | timestamp| sí          | Fecha de alta          |

## positions

Puestos de la empresa. Id del documento: código de puesto (`DEVELOPER`, `HR_MANAGER`, ...).

| Campo         | Tipo     | Obligatorio | Descripción                       |
|---------------|----------|-------------|-----------------------------------|
| name          | string   | sí          | Nombre del puesto                 |
| departmentId  | string   | sí          | Id del área al que pertenece      |
| createdAt     | timestamp| sí          | Fecha de alta                     |

## employees

Colaboradores y excolaboradores. Id del documento: legajo, con formato `E-0001`, `E-0002`, ...

| Campo           | Tipo      | Obligatorio | Descripción                                                        |
|-----------------|-----------|-------------|--------------------------------------------------------------------|
| employeeNumber  | string    | sí          | Legajo (igual que el id)                                           |
| firstName       | string    | sí          | Nombre(s)                                                          |
| lastName        | string    | sí          | Apellido(s)                                                        |
| documentType    | string    | sí          | Tipo de documento (ejemplo: DNI, CUIT)                             |
| documentNumber  | string    | sí          | Número de documento                                                |
| birthDate       | timestamp | sí          | Fecha de nacimiento                                                |
| email           | string    | sí          | Correo personal o laboral                                          |
| phone           | string    | sí          | Teléfono de contacto                                               |
| hireDate        | timestamp | sí          | Fecha de ingreso                                                   |
| terminationDate | timestamp | no          | Fecha de egreso (si aplica)                                        |
| departmentId    | string    | sí          | Id del área (department)                                           |
| positionId      | string    | sí          | Id del puesto (position)                                           |
| managerId       | string    | no          | Id del colaborador que es manager directo                          |
| status          | string    | sí          | Estado (`ACTIVE`, `ON_LEAVE`, `TERMINATED`)                       |
| deletedAt       | timestamp | no          | Fecha de baja lógica (null si vigente)                             |
| createdAt       | timestamp | sí          | Creación del registro                                              |
| updatedAt       | timestamp | sí          | Última actualización                                               |

Índices: Por employeeNumber, por status (para filtros rápidos), por departmentId + positionId (combinaciones habituales).
