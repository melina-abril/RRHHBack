# Gestión de RR.HH. — Firebase

Este repositorio reúne Cloud Firestore, Firebase Auth y la API en `functions/`. Las reglas de Firestore impiden el acceso directo de clientes: la API utiliza el SDK de administración.

## Desarrollo local

Se requiere Node.js 22 o superior. En una terminal:

```sh
npm install
npm run functions:install
npm start
```

En otra terminal, cargá los datos de ejemplo:

```sh
npm run seed:emulator
```

El panel de emuladores está en http://127.0.0.1:4005. Los puertos configurados son 8085 para Firestore, 9099 para Auth y 5002 para Functions. También se pueden iniciar únicamente los emuladores de Firestore y Auth con `npm run emulators:db`.

El usuario administrador de ejemplo es `clara.vega@example.com`, con rol `ADMIN` y contraseña `Demo1234!`. Cambiá o eliminá estas credenciales antes de utilizar datos de ejemplo fuera de un entorno de pruebas.

## Colecciones y cargas

`scripts/seed.js` ejecuta los archivos de `firestore/seeds/` en orden de versión y registra los aplicados en `_seedHistory`; no vuelve a ejecutar una versión aplicada. Para modificar datos ya cargados, agregá una versión nueva.

- Core (`V1__core.js`): `users`, `departments`, `positions` y `employees`. El usuario de ejemplo se crea tanto en Firebase Auth como en `users`. Esquema: `docs/collections/core.md`.
- Edición de colaborador (`employee-editing`): utiliza las colecciones compartidas; no crea colecciones propias.
- Movimientos laborales (`employment-movements`): no crea colecciones propias en esta generación.
- Clientes, proyectos y asignaciones (`project-assignments`): `clients`, `clientCountries`, `projects`, `projectContacts`, `projectAssignments` y `assignmentEvents`. Esquema: `docs/collections/project-assignments.md`.
- Perfil profesional y documentación (`professional-profiles`): no crea colecciones propias en esta generación.

Los índices compuestos se declaran en `firestore.indexes.json`; Firestore administra automáticamente los índices de campo individual.

## Despliegue

Seleccioná primero tu proyecto real con `firebase use --add`. Después ejecutá `npm run deploy` para desplegar Functions, reglas e índices. Para cargar los datos en ese proyecto, configurá `GOOGLE_APPLICATION_CREDENTIALS` y `FIREBASE_PROJECT_ID` en el entorno y ejecutá `npm run seed`. La carga incluye el usuario y la contraseña de ejemplo: no la ejecutes en producción sin revisar previamente los scripts de carga.
