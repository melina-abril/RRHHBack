# Módulo: comunicados

## notices

Comunicados enviados por correo electrónico a colaboradores. Id del documento: `N-0001`, `N-0002`, ...

| Campo               | Tipo                                                      | Obligatorio | Descripción                                                                            |
|---------------------|-----------------------------------------------------------|-------------|----------------------------------------------------------------------------------------|
| subject             | string                                                    | sí          | Asunto del comunicado                                                                 |
| body                | string                                                    | sí          | Texto o contenido completo del comunicado                                             |
| sentById            | string → employees                                        | sí          | Legajo de quien lo envía                                                              |
| sentByName          | string                                                    | sí          | Nombre de quien lo envía (para mostrar en historial)                                  |
| targetEmployeeIds   | array de string → employees                               | sí          | Legajos de los destinatarios directos (opcionalmente filtrados por departamento)      |
| targetDepartments   | array de string → departments | null                                 | no          | Códigos de los departamentos destinatarios para envíos masivos (puede ser null)        |
| sentAt              | timestamp | null                                        | no          | Fecha y hora de envío (null si borrador)                                              |
| deliveryState       | string                                                    | sí          | `DRAFT`, `SENT` o `ERROR`                                                             |
| deliveryResult      | string | null                                           | no          | Resumen textual del resultado del envío                                               |
| errors              | array de objetos { employeeId, email, message } | null            | no          | Errores individuales del envío (si hay)                                               |
| createdAt           | timestamp                                                 | sí          | Fecha de creación del comunicado                                                      |

Índices: `sentById` + `sentAt` desc (historial de envíos por usuario); `targetEmployeeIds` (búsqueda rápida por destinatario).
