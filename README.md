# Frontend · Plataforma de Reservas de Servicios (Sprint 1)

Frontend en **React + Vite**, construido contra el contrato oficial
(`back/docs/api-servas-swagger.yaml`) del equipo de backend.

## Historias de usuario cubiertas en este sprint

| HU | Título | Pantalla | Endpoint(s) |
|----|--------|----------|-------------|
| 001 | Registro de proveedor | `/registro` | `POST /auth/register` |
| 002 | Verificación del correo electrónico | `/verificar-correo` | `POST /auth/verify-email`, `POST /auth/verify-email/resend` |
| 003 | Datos de compañía | `/negocio` (requiere sesión) | `POST /companies` |
| 004 | Inicio de sesión | `/login` | `POST /auth/login` |
| 005 | Cierre de sesión | Botón en el header | `POST /auth/logout` |
| 008 | Selección de servicio | `/` (catálogo) | `GET /services`, `GET /comunas` |
| 009 | Detalle del servicio | Panel lateral en `/` | `GET /services/{id}` (vía selección de la lista) |

Cada archivo de página/servicio tiene un comentario indicando qué HU implementa,
para que sea fácil de rastrear en la revisión y en Azure DevOps.

## Cómo correrlo

```bash
npm install
cp .env.example .env
npm run dev
```

Se abre en `http://localhost:5173`.

## Modo mock vs. backend real

El backend (Spring Boot) **aún no tiene los controladores implementados**
(solo el scaffolding, el modelo de datos y el contrato Swagger), así que el
frontend puede trabajarse en paralelo con datos simulados:

- `.env` con `VITE_USE_MOCKS=true` → usa datos de ejemplo en memoria
  (`src/mocks/servicesMock.js` y estado simulado en `authService.js` /
  `companyService.js`). El código OTP de prueba es siempre `123456`.
- `.env` con `VITE_USE_MOCKS=false` y `VITE_API_BASE_URL` apuntando al
  backend real (por defecto `http://localhost:8080`) → llama a los
  endpoints reales tal como están definidos en el Swagger.

No hay que tocar los componentes de React para cambiar de modo: toda la
lógica de mock/real vive en `src/api/*.js`.

## Estructura

src/
├── api/ # Llamadas HTTP + lógica de mocks (1 archivo por dominio)
├── components/ # Header, ProtectedRoute
├── context/ # AuthContext (sesión, token, login/logout)
├── mocks/ # Datos de ejemplo para el catálogo
├── pages/ # Una página por HU (o grupo de HU relacionadas)
└── styles/ # CSS global
