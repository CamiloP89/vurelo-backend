#  Vurelo Backend API

Este proyecto es una **API RESTful** y **WebSocket** construida con [NestJS](https://nestjs.com/) y [Prisma ORM](https://www.prisma.io/) para la gestión de usuarios, portafolios de criptoactivos, y transacciones. La API incluye autenticación JWT y comunicación en tiempo real con WebSockets para notificar transacciones en vivo.

---

##  Tecnologías utilizadas

- **NestJS** + **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (Docker y Render)
- **JWT** para autenticación
- **WebSockets** (Gateway)
- **Swagger** para documentación interactiva
- **Docker** para base de datos local
- **Render** para deploy productivo

---

##  Estructura del Proyecto

```
src/
├── auth/                // Registro, login y protección JWT
├── users/               // Gestión de usuarios
├── portfolios/          // Crear y consultar portafolios
├── transactions/        // Crear y consultar transacciones
├── events/              // WebSocket Gateway
├── prisma/              // Prisma y base de datos
└── app.module.ts        // Módulo principal
```

---

##  Requisitos previos

- Node.js v18+
- Docker (para entorno local)
- Cuenta en [Render](https://render.com/) (para deploy opcional)

---

##  Instalación local

```bash
# 1. Clona el repositorio
git clone https://github.com/camiloP89/vurelo-backend.git
cd vurelo-backend

# 2. Instala dependencias
npm install

# 3. Crea y corre base de datos local en Docker
docker-compose up -d

# 4. Configura variables de entorno

El proyecto viene con render en default

DATABASE_URL="postgresql://vurelo_db_user:...@dpg-.../vurelo_db"

Ejemplo `.env` para desarrollo local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/vurelo"
JWT_SECRET="mi_clave_secreta"
JWT_EXPIRES_IN="1d"
```

---

##  Migraciones y cliente Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

##  Ejecutar el servidor

```bash
npm run start:dev
```

Accede a Swagger:
```
http://localhost:3000/api
```

---

##  API pública (deploy en Render)

- **URL base API:** https://vurelo-backend.onrender.com
- **Swagger online:** https://vurelo-backend.onrender.com/api
- **WebSocket URL:** `wss://vurelo-backend.onrender.com`

---

##  WebSocket

- **Evento emitido:** `transaction_created`
- **Ejemplo de conexión:**

```bash
npx wscat -c wss://vurelo-backend.onrender.com
```

```js
const socket = io('wss://vurelo-backend.onrender.com');
socket.on('transaction_created', (data) => {
  console.log('Transacción:', data);
});
```

---

##  Endpoints principales

| Método | Ruta                            | Descripción                                  |
|--------|----------------------------------|----------------------------------------------|
| POST   | /auth/register                  | Registro de usuario                          |
| POST   | /auth/login                     | Login y obtención de JWT                     |
| POST   | /auth/me                        | Datos del usuario autenticado                |
| POST   | /portfolios                     | Crear nuevo portafolio                       |
| GET    | /portfolios                     | Listar portafolios del usuario               |
| GET    | /portfolios/:id/value          | Total en USD del portafolio                  |
| POST   | /transactions                   | Crear transacción (deposit/withdrawal)       |
| GET    | /transactions/:portfolioId     | Listar transacciones con valor actual USD    |

---

## Cómo probar WebSocket

1. Haz una transacción (`POST /transactions`)
2. Verás el evento `transaction_created` emitido en WebSocket

---

## Tests

```bash
npm run test
```

- Test unitarios por módulo (`users`, `auth`, `transactions`, `portfolios`)
- Prisma mockeado en servicios

---

##  Autor

Desarrollado por **Camilo Pinzón** como parte de una prueba .

Fecha: 2025-05-18