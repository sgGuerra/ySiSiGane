# ¿Y Si Sí Me Lo Gané?

## Autor

**Luis Carlos Guerra**

---

## Descripción del proyecto

Aplicación web para gestionar boletas, rifas, sorteos y juegos de azar personales. Permite a cada usuario registrar sus tickets, consultar su estado, buscar en históricos y mantener un dashboard personalizado. Incluye un panel de administrador con estadísticas globales, filtros, búsqueda y actividad reciente.

El repositorio está organizado en dos capas principales:

- `backend/` — API REST con Express, TypeScript, Prisma y PostgreSQL.
- `frontend/` — Interfaz web con Next.js, React, TypeScript y Tailwind.

---

## Contenido del repositorio

### Carpetas clave

- `backend/`
  - `src/` — Código fuente de la API.
  - `package.json` — Dependencias y scripts del backend.
  - `readme.md` — Documentación específica del backend.
  - `prisma/` — Esquema Prisma, migraciones y configuración.
  - `database/` — Archivo SQL de esquema.

- `frontend/`
  - `src/` — Código fuente del frontend Next.js.
  - `package.json` — Dependencias y scripts del frontend.
  - `README.md` — Documentación específica del frontend.
  - `docs/` — Documentos del proyecto y referencia arquitectónica.

---

## Estructura rápida del backend

```
backend/src/
├── app.ts
├── index.ts
├── application/
│   ├── dtos/
│   └── usecases/
│       ├── auth/
│       └── tickets/
├── domain/
│   ├── entities/
│   ├── errors/
│   ├── repositories/
│   └── services/
├── infrastructure/
│   ├── config/
│   ├── prisma/
│   ├── prisma-client/
│   ├── repositories/
│   ├── security/
│   └── validators/
└── interface/
    ├── controllers/
    ├── middlewares/
    └── routes/
```

### Backend principal

- API REST en `backend/src/interface/routes/`.
- Controladores en `backend/src/interface/controllers/`.
- Repositorios y adaptadores Prisma en `backend/src/infrastructure/repositories/`.
- DTOs y casos de uso en `backend/src/application/`.

---

## Estructura rápida del frontend

```
frontend/src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── main/
│       ├── admin/
│       ├── dashboard/
│       └── tickets/
├── application/
│   └── services/
├── domain/
├── infrastructure/
└── presentation/
    └── components/
```

### Frontend principal

- Rutas y páginas en `frontend/src/app/`.
- Servicios HTTP y consumo de API en `frontend/src/application/services/`.
- Componentes reutilizables en `frontend/src/presentation/components/`.
- Estado de autenticación en `frontend/src/application/state/`.

---

## Instalación y ejecución

### Backend

1. Abrir terminal en `backend/`.
2. Ejecutar:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

3. Variables de entorno: copiar `backend/.env.example` a `backend/.env` y configurar `DATABASE_URL`, `JWT_SECRET`, `PORT`.

### Frontend

1. Abrir terminal en `frontend/`.
2. Ejecutar:

```bash
npm install
npm run dev
```

3. El frontend de desarrollo corre en `http://localhost:3000`.

---

## Documentación adicional

- `frontend/README.md` — Documentación específica del frontend y contexto de la práctica.
- `backend/readme.md` — Documentación específica del backend, endpoints y arquitectura.
- `implementation_plan.md` — Plan de cambios sobre logout, dashboard admin y actividad reciente.
- `task.md` — Lista de tareas pendientes a nivel backend y frontend.
- `frontend/docs/architecture.md` — Documentación arquitectónica del frontend.
- `backend/docs/api-mi-boleta.postman_collection.json` — Colección Postman para pruebas de API.

---

## Estado actual y próximos pasos

- Se está trabajando en mejoras del panel administrador: estadísticas globales, usuarios activos y actividad reciente.
- También hay una corrección pendiente en el flujo de logout para mostrar un modal de confirmación.
- La organización de la aplicación debe mantener separado el dashboard de usuario normal del del administrador.

---

## Notas

- El backend usa `Prisma` con Postgres y JWT para autenticación.
- El frontend usa `Next.js 16`, `React 19`, `Tailwind CSS 4` y `Zustand`.
- El proyecto está diseñado con una arquitectura limpia (Clean Architecture) entre dominio, aplicación, infraestructura e interfaz.
