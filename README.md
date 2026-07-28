# FIP — Financial Intelligence Platform (Frontend)

Dashboard moderno e inteligente para finanzas personales, construido con React 19 + TypeScript.

## Stack Tecnologico

| Capa | Tecnologia |
|-------|-----------|
| Framework | React 19 |
| Lenguaje | TypeScript (estricto) |
| Build | Vite 8 + Rolldown |
| Estilos | Tailwind CSS v4 |
| Rutas | React Router v7 |
| Estado | TanStack React Query v5 |
| Formularios | React Hook Form + Zod |
| Autenticacion | JWT con interceptor de auto-refresh |
| UI | shadcn/ui + Radix primitives + Framer Motion |
| Graficas | Recharts + Tremor |
| Tablas | TanStack Table v8 |
| Iconos | Lucide React |
| Fechas | date-fns |

## Funcionalidades

### Dashboard Financiero
- Vista general con KPIs, desglose de gastos, flujo de caja
- Seguimiento de patrimonio neto con grafico historico
- Navegacion rapida a todos los modulos

### Gestion de Transacciones
- CRUD completo con filtrado avanzado, ordenamiento y paginacion
- Transacciones divididas, patrones recurrentes, etiquetas, adjuntos
- Escaneo de recibos con OCR
- Importacion y exportacion (CSV, Excel, PDF)

### Gestion de Cuentas y Carteras
- Soporte multi-cuenta (cheques, ahorros, efectivo, credito)
- Agrupacion en carteras para organizacion del portafolio
- Seguimiento de saldo y liquidez

### Presupuestos
- Presupuestos mensuales/periodicos con asignacion por categoria
- Barras de progreso en tiempo real y umbrales de alerta
- Sugerencias de auto-ajuste

### Tarjetas
- Tarjetas de credito con seguimiento de facturas y programacion de pagos
- Limites de gasto y monitoreo de utilizacion
- Alertas de fechas de vencimiento y sobregiro

### Prestamos
- Visualizacion completa de tabla de amortizacion
- Calculadora de pago anticipado con proyeccion de ahorro
- Historial de pagos

### Metas
- Creacion de metas con monto objetivo y fecha limite
- Seguimiento de progreso con fecha de finalizacion estimada
- Simulaciones de "que pasaria si"

### Analitica e IA
- Tendencias de gastos, desglose por categorias, mapas de calor
- Visualizacion de flujo de caja (ingresos vs gastos)
- Clasificacion automatica de transacciones con IA
- Prediccion de gastos e ingresos
- Alertas de deteccion de anomalias
- Recomendaciones personalizadas de ahorro
- Puntaje de salud financiera y evaluacion de riesgos
- Analisis de habitos de gasto

### Automatizacion
- Creacion de reglas para auto-categorizacion, alertas, transferencias
- Registros de ejecucion y estadisticas resumidas

### Panel de Administracion
- Gestion de usuarios (crear, editar, activar/desactivar)
- Gestion de roles y permisos
- Visor de registros de auditoria con filtros y estadisticas
- Monitoreo de salud del servidor (BD, Redis, disco, memoria)

### Seguridad
- JWT con refresco automatico y rotacion de tokens
- Configuracion y verificacion de MFA (TOTP)
- Gestion de sesiones
- Llamadas a la API con limitacion de tasa
- RBAC para funciones administrativas

## Estructura del Proyecto

```
src/
  components/       # Componentes UI compartidos (estilo shadcn/ui)
  features/         # Modulos funcionales (admin, ai, analytics, auth, budgets, etc.)
  hooks/            # Hooks globales
  layouts/          # Layouts de la app (protegido, auth, admin)
  lib/              # Utilidades, cliente API, constantes
  pages/            # Componentes de pagina (destinos de ruteo)
  providers/        # Proveedores de contexto React
  routes/           # Definiciones de rutas
  stores/           # Stores de Zustand (auth)
  types/            # Tipos TypeScript compartidos
```

## Inicio Rapido

```bash
# Prerrequisitos: Node.js 20+, pnpm 9+

cd fip-frontend

# Instalar dependencias
pnpm install

# Copiar archivo de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
pnpm dev
```

La app corre en http://localhost:5173 y proxy las llamadas API a http://localhost:8080.

## Variables de Entorno

| Variable | Requerida | Default | Descripcion |
|----------|-----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:8080/api/v1` | URL base de la API backend |
| `VITE_APP_NAME` | No | `FIP` | Nombre de la aplicacion |
| `VITE_APP_URL` | No | `http://localhost:5173` | URL publica de la app |
| `VITE_APP_DESCRIPTION` | No | `...` | Meta descripcion |
| `VITE_SENTRY_DSN` | No | — | DSN de Sentry para seguimiento de errores |
| `VITE_SENTRY_ENVIRONMENT` | No | `development` | Entorno en Sentry |
| `VITE_ENABLE_MOCK` | No | `false` | Habilitar datos mock |
| `VITE_ENABLE_DEBUG` | No | `false` | Habilitar funciones de depuracion |

## Scripts Disponibles

```bash
pnpm dev        # Iniciar servidor de desarrollo con HMR
pnpm build      # Compilacion para produccion
pnpm preview    # Vista previa del build de produccion
pnpm lint       # ESLint
pnpm tsc        # Verificacion de tipos TypeScript
pnpm format     # Formatear con Prettier
```

## Rutas

| Ruta | Modulo | Descripcion |
|------|--------|-------------|
| `/login`, `/register` | Auth | Inicio de sesion y registro |
| `/dashboard` | Dashboard | Vista principal |
| `/accounts` | Accounts | Cuentas financieras |
| `/wallets` | Wallets | Gestion de carteras |
| `/transactions` | Transactions | Lista y gestion de transacciones |
| `/incomes` | Incomes | Seguimiento de ingresos |
| `/expenses` | Expenses | Seguimiento de gastos |
| `/budgets` | Budgets | Gestion de presupuestos |
| `/cards` | Cards | Gestion de tarjetas de credito |
| `/loans` | Loans | Seguimiento de prestamos |
| `/goals` | Goals | Metas financieras |
| `/analytics` | Analytics | Graficos y analitica |
| `/ai` | AI | Informacion y predicciones de IA |
| `/automations` | Automations | Reglas de automatizacion |
| `/notifications` | Notifications | Notificaciones del usuario |
| `/settings` | Settings | Preferencias del usuario |
| `/admin/*` | Admin | Panel admin (usuarios, roles, permisos, auditoria, estadisticas) |

## Deploy

### Vercel

Conecta tu repositorio de GitHub a Vercel, configura las variables de entorno y despliega.

```
pnpm build  # Salida en dist/
```

El archivo `vercel.json` configura headers (CSP, cache), rewrites (SPA) y redirects.

### Docker (opcional)

```bash
docker build -t fip-frontend .
docker run -p 3000:80 fip-frontend
```
