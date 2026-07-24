# Frontend Development Phases

## Fase 0: Foundation & Setup

**Duracion:** 3-5 dias
**Dependencias:** Ninguna

### Objetivos
- Inicializar proyecto Vite + React + TypeScript
- Configurar TailwindCSS, ESLint, Prettier
- Configurar estructura de carpetas (feature-based)
- Crear componentes UI base (Button, Input, Modal, Card, Badge, Skeleton, etc.)
- Configurar routing con React Router v6 (layout principal + rutas protegidas)
- Configurar Axios con interceptors (auth, refresh, error handling)
- Configurar TanStack Query con defaults
- Configurar Zustand para auth store
- Configurar shadcn/ui o componentes base custom
- Crear layout principal: Sidebar + Header + Main Content Area
- Implementar theme toggle (claro/oscuro) con Tailwind
- Configurar alias de imports (@/components, @/lib, etc.)

### Entregables
- Proyecto funcionando con pnpm dev
- Routing basico con layout
- Componentes UI base documentados
- Sistema de theme (claro/oscuro)
- API client configurado

**Estado de la fase:** Completada
---

## Fase 1: Autenticacion

### Objetivos
- Pagina de Login con validacion Zod
- Pagina de Registro con validacion
- Auth store (Zustand): tokens, user, login/logout/refresh
- Proteger rutas con RequireAuth component
- MFA Challenge screen (ingresar codigo 6 digitos)
- MFA Setup wizard (mostrar QR, verificar codigo)
- Password Reset flow (solicitar email -> token -> nueva password)
- Email Verification flow
- Sesiones activas (listar y revocar)
- Avatar upload (placeholder)
- Auto-refresh token en Axios interceptor
- Redirect post-login

### Entregables
- Flujo completo de auth
- Rutas protegidas funcionando
- MFA configurable
- Sesiones manejables

**Estado de la fase:** Completada
---

## Fase 2: Dashboard & Layout Global

### Objetivos
- Sidebar navegacion completa con iconos
- Header con busqueda global, notificaciones, avatar
- Dashboard page: resumen financiero (balance total, income, expenses, net worth)
- Componentes de chart base (AreaChart, BarChart, PieChart, LineChart)
- KPI cards reutilizables
- Date range picker global
- Loading skeletons para cada widget
- Error boundaries por seccion
- Responsive design (mobile sidebar como drawer)

### Entregables
- Dashboard funcional con datos reales del API
- Charts interactivos
- Layout responsivo

Ya implementada la fase 1, vamos a continuar con el desarrollo completo, profesional, avanzado, funcional, completo, sin omisiones, moderno del frontend de la aplicacion fip (financial-intelligence-platform), avancemos con el desarrollo de la siguiente fase completa y avanzada del proyecto por favor:

Fase 2: Dashboard & Layout Global

### Objetivos
- Sidebar navegacion completa con iconos
- Header con busqueda global, notificaciones, avatar
- Dashboard page: resumen financiero (balance total, income, expenses, net worth)
- Componentes de chart base (AreaChart, BarChart, PieChart, LineChart)
- KPI cards reutilizables
- Date range picker global
- Loading skeletons para cada widget
- Error boundaries por seccion
- Responsive design (mobile sidebar como drawer)

### Entregables
- Dashboard funcional con datos reales del API
- Charts interactivos
- Layout responsivo

Proporcioname todas las instrucciones, informacion, codigo, comandos, datos, detalles y todo lo necesario para esta siguente fase, no hagas ninguna implementacion ni ningun cambio tu, dame las instrucciones, codigo, detalles y todo lo relativo mas estrategias, ejemplos, etc a mi que yo lo hago por favor. Nota: recuerda siempre leer el docs/frontend-phases.md, el docs/frontend-definitions.md y el docs/frontend-AGENTS.md para que te retroalimentes cuando necesites informacion de cualquier cosa. Y escribir cualquier informacion en el archivo correspondiente a la fase en desarrollo actual por ejemplo frontend-phases/frontend-phase2-guide.md. No omitas nada, piensa en todo y selecciona las mejores opciones, arquitecturas, tecnologias, todo que me sea gratis xfa :). 
---

## Fase 3: Accounts & Wallets

**Duracion:** 3-4 dias
**Dependencias:** Fase 2

### Objetivos
- AccountListPage: tabla/tarjetas con tipo, balance, institucion, icono, color
- AccountCreatePage: formulario con selector de tipo (6 tipos), moneda, color, icono
- AccountDetailPage: detalle completo, editar, eliminar
- AccountSummaryWidget: resumen por moneda
- WalletListPage: tarjetas de wallets
- WalletCreatePage: formulario con selector de tipo (6 tipos)
- WalletDetailPage: cuentas vinculadas, balance por moneda
- Add/Remove accounts de wallet (multi-select)
- WalletLiquidityPage: visualizacion de liquidez (high/medium/low/mixed)
- Sort order drag-and-drop para accounts y wallets
- Status badges (active, inactive, archived, frozen)

### Entregables
- CRUD completo de accounts y wallets
- Visualizacion de balance por moneda
- Analisis de liquidez

---

## Fase 4: Categories

**Duracion:** 2-3 dias
**Dependencias:** Fase 3

### Objetivos
- CategoryListPage: arbol expandible con subcategorias
- CategoryCreatePage: formulario con tipo (expense/income/transfer/adjustment), color picker, icon selector
- CategoryDetailPage: detalle con subcategorias
- Subcategory CRUD inline
- CategoryPicker component: jerarquico, searchable, para usar en formularios
- Category badges/chips color-coded
- System vs user category distincion visual
- AI Categorization test tool: input description, ver prediccion
- CategoryStatsWidget

### Entregables
- Gestion completa de categorias
- Componente CategoryPicker reutilizable
- Integracion AI categorization test

---

## Fase 5: Transactions

**Duracion:** 5-7 dias
**Dependencias:** Fase 3, Fase 4

### Objetivos
- TransactionListPage: tabla virtualizada, filtros (tipo, fecha, categoria, cuenta, busqueda)
- TransactionCreatePage: formulario completo con selector de cuenta, categoria, tags, fecha
- TransactionDetailPage: drawer/modal con metadata completa + AI info
- TransactionEditPage: edicion inline o modal
- Soft-delete con confirmacion
- TransferWizard: origen -> destino -> monto -> confirmar
- Tag management: add/remove con autocomplete
- Attachment management: upload drag & drop, preview, delete
- RecurringTransactions CRUD: selector de frecuencia (daily/weekly/biweekly/monthly/quarterly/yearly)
- Recurring list page
- OCR upload: drag & drop image, preview extracted data, confirm/correct
- TransactionSummaryWidget: income/expense/net del periodo
- Transaction audit log viewer
- Paginacion con infinite scroll

### Entregables
- CRUD completo de transacciones
- Transferencias entre cuentas
- Transacciones recurrentes
- Attachments y OCR
- Tags y audit log

---

## Fase 6: Incomes

**Duracion:** 3-4 dias
**Dependencias:** Fase 5

### Objetivos
- IncomeListPage: lista con indicadores de tipo (salary/freelance/etc.), estabilidad
- IncomeCreatePage: formulario con source selector, stability selector, tax fields
- IncomeSource CRUD (employers, clients, etc.)
- IncomeScheduling: fechas esperadas, metodos de proyeccion, marcar como recibido
- IncomeSummaryDashboard: total, promedio, por tipo
- IncomeTrendsChart: linea mensual
- IncomeForecastVisualization: proyeccion 6 meses
- RecurringIncomeDetectionResults
- IrregularIncomeIdentification
- BatchStatusUpdates
- Stability badges color-coded

### Entregables
- Gestion completa de ingresos
- Fuentes de ingresos
- Programacion y proyeccion
- Analytics de ingresos

---

## Fase 7: Expenses

**Duracion:** 5-7 dias
**Dependencias:** Fase 5

### Objetivos
- ExpenseListPage: lista con prioridades, colores de categoria
- ExpenseCreatePage: formulario con links opcionales a service/template/subscription
- SplitExpenseCreator: multiple lineas con montos
- ExpenseTemplates CRUD + aplicar
- Services (utilities) management: crear, auto-create expense, marcar pagado
- Subscriptions list: costo anual, recomendaciones, cancelar
- CreditCards: crear, utilization gauge, statement/payment days
- CardBills: view, pay, status tracking
- ExpenseDashboard: daily average, subscriptions total, category breakdown, daily trend
- SpendingPatterns: top categories, monthly trend
- DuplicateDetection: review and handle
- RecurringCandidates: convert to recurring
- Priority badges (low/normal/high/critical)

### Entregables
- Gestion completa de gastos
- Templates, servicios, suscripciones
- Tarjetas de credito y facturas
- Dashboard de gastos

---

## Fase 8: Budgets

**Duracion:** 3-4 dias
**Dependencias:** Fase 5, Fase 6, Fase 7

### Objetivos
- BudgetListPage: barras de gasto con colores de estado (under=green, near=yellow, over=red)
- BudgetCreatePage: selector de tipo (total/category/account), periodo, category/account picker
- BudgetDetailPage: spent vs remaining, daily burn rate, projected overspend
- BudgetSummaryDashboard: utilization %, over/near counts
- AlertManagement: view alerts, mark read/dismissed
- Auto-adjust toggle + execution
- Rollover toggle
- Alert threshold slider
- Strategy selector

### Entregables
- Gestion completa de presupuestos
- Alertas de presupuesto
- Auto-ajuste y rollover

---

## Fase 9: Goals

**Duracion:** 3-4 dias
**Dependencias:** Fase 5

### Objetivos
- GoalListPage: progress bars, status, priority
- GoalCreateWizard: tipo -> detalles -> target -> tracking setup
- GoalDetailPage: progress %, predicted completion, AI recommendations
- GoalSimulation: input variables, ver proyeccion chart
- GoalSummaryDashboard: total progress, on track vs behind count
- ProgressRing component
- Auto-contribute toggle
- Priority selector (1-5)
- Goal type icons

### Entregables
- Gestion completa de metas
- Simulacion de metas
- Dashboard de progreso

---

## Fase 10: Credit Cards & Loans

**Duracion:** 4-5 dias
**Dependencias:** Fase 5, Fase 7

### Objetivos
- CardListPage: utilization %, network icon, last 4 digits
- CardDetailPage: credit limit, available, utilization gauge
- BillManagement: list by card, payment status, due dates
- PayBill flow: amount, method
- SpendingLimits: daily/weekly/monthly/category
- CardAlerts
- Statement/payment day config
- LoanListPage: balance, interest rate, status badges
- LoanCreatePage: type selector (9 tipos), interest type, frequency
- LoanDetailPage: amortization table, remaining balance, progress
- AmortizationChart: principal vs interest over time
- EarlyPayoffSimulator: extra payment, savings, new end date
- MakePayment flow
- PaymentHistory
- NewLoanSimulator: variables, monthly payment, total interest

### Entregables
- Gestion completa de tarjetas de credito
- Gestion completa de prestamos
- Tablas de amortizacion
- Simuladores

---

## Fase 11: Analytics

**Duracion:** 4-5 dias
**Dependencias:** Fase 5, Fase 6, Fase 7

### Objetivos
- KPICards: income, expenses, net flow, savings rate, top category
- CashFlowChart: area/bar chart income vs expenses over time
- NetWorthLineChart over time
- TrendCharts: customizable period/granularity (daily/weekly/monthly)
- CategoryBreakdown: pie/doughnut chart, bar chart
- SpendingHeatmap: day-of-week x week-of-month, day-of-week x hour
- AnalyticsDashboard: composite view, date range selector
- Chart export as image
- Interactive tooltips
- Period comparison (this month vs last month vs same month last year)

### Entregables
- Dashboard analitico completo
- Todos los charts interactivos
- Filtros de fecha y granularidad

---

## Fase 12: AI Features

**Duracion:** 4-5 dias
**Dependencias:** Fase 5, Fase 6, Fase 7

### Objetivos
- ClassificationResults: category + confidence + method display
- BatchClassification: trigger con progress indicator
- TrainPredictor: button con status feedback (pending/training/completed/failed)
- AnomalyDetectionResults: list anomalias con severidad
- RecommendationsFeed: list with explanation, savings amount, priority
- HabitsDashboard: score gauge, radar chart, breakdown
- RiskAssessment: health score gauge (0-100), risk factors list, recommendations
- SavingsOptimizer: 50/30/20 allocation visualization, debt strategy
- SavingsSimulator: input variables, projection chart
- ExplanationCards: headline, why, how, impact, action
- Confidence indicators: high=green, medium=yellow, low=red

### Entregables
- Todos los features de AI integrados
- Visualizaciones de AI insights
- Recomendaciones explicadas

---

## Fase 13: Automations

**Duracion:** 3-4 dias
**Dependencias:** Fase 5, Fase 8, Fase 9

### Objetivos
- AutomationListPage: trigger/action descriptions, active toggle
- AutomationCreateWizard: trigger type -> conditions -> action type -> params -> review
- Dynamic trigger condition builder (UI cambia segun trigger type)
- Dynamic action param builder (UI cambia segun action type)
- Active/inactive toggle
- Execution count + last execution display
- Manual execute button with result feedback
- ExecutionLogViewer: timestamp, status, details
- Templates: pre-built automation patterns
- Summary: total rules, active count, monthly executions
- Max executions per month input
- Min balance safeguard input

### Entregables
- Automations CRUD completo
- Wizard de creacion con UI dinamica
- Logs de ejecucion

---

## Fase 14: Notifications

**Duracion:** 2-3 dias
**Dependencias:** Fase 1

### Objetivos
- Bell icon con unread count badge en header
- NotificationDrawer/Panel: list with read/unread states
- Notification categories: budget_alert, goal_milestone, anomaly, payment_due, etc.
- Bulk mark as read
- NotificationPreferencesPage: channel toggles, per-channel type filtering
- Channel config: Telegram chat ID, Discord webhook, etc.
- Test notification button per channel
- Real-time polling or WebSocket
- Type icons + colors

### Entregables
- Sistema de notificaciones completo
- Panel de notificaciones en header
- Preferencias de notificacion configurables

---

## Fase 15: Imports & Exports

**Duracion:** 3-4 dias
**Dependencias:** Fase 5

### Objetivos
- ImportWizard: upload (drag & drop) -> preview -> column mapping -> confirm
- File upload for CSV/Excel
- PreviewStep: parsed rows, validation errors, duplicates
- ColumnMappingUI (si mapping automatico falla)
- ImportJobHistory: status indicators, row counts
- JobDetail: error rows view with correction option
- Export buttons with format selector (CSV/Excel/PDF)
- Filter config before export
- Download progress indicator
- Calendar export (.ics)
- Date range picker for export scope

### Entregables
- Import wizard completo
- Export con multiple formatos
- Job history tracking

---

## Fase 16: Admin Panel

**Duracion:** 3-4 dias
**Dependencias:** Fase 1

### Objetivos
- UsersTable: search, filter, paginate (server-side)
- UserDetail: info, role, status, activity
- RoleChange dropdown
- StatusToggle (active/inactive)
- Roles CRUD: create/edit/delete roles
- Permissions management: assign/remove per role
- AuditLogViewer: filter by action, resource, user, date range
- AuditLogStatsDashboard
- SystemStatsDashboard: user counts, role counts, recent logins
- Admin route guard (role-based)

### Entregables
- Admin panel completo
- User/role/permission management
- Audit log viewer

---

## Fase 17: Settings & User Profile

**Duracion:** 2-3 dias
**Dependencias:** Fase 1

### Objetivos
- ProfilePage: edit name, email, phone, avatar
- SecurityPage: change password, MFA toggle, active sessions
- PreferencesPage: language, timezone, currency, notifications defaults
- Theme preference persistido
- Currency selector para display default
- Timezone selector

### Entregables
- Pagina de perfil
- Configuracion de seguridad
- Preferencias de usuario

---

## Fase 18: Polish & Performance

**Duracion:** 4-5 dias
**Dependencias:** Todas las fases anteriores

### Objetivos
- Loading states: skeleton components everywhere
- Error boundaries por feature
- Empty states con ilustracion + mensaje + CTA
- Responsive design audit
- Dark mode audit
- Keyboard navigation audit
- Accessibility audit (ARIA labels, focus management)
- Performance audit: bundle size, re-renders, lazy loading
- Add react-helmet-async para SEO/page titles
- Add page transitions (framer-motion)
- Add toast notifications system-wide
- Add confirmation dialogs for destructive actions
- Add undo snackbar for soft-deletes

### Entregables
- UX pulido
- Performance optimizado
- Accesibilidad mejorada

---

## Fase 19: Testing & QA

**Duracion:** 5-7 dias
**Dependencias:** Todas las fases anteriores

### Objetivos
- Unit tests para todos los hooks y utils
- Component tests para UI components criticos
- Integration tests para flujos principales (login, create transaction, etc.)
- MSW setup para mock API en tests
- Test coverage > 80% en logica de negocio
- E2E tests con Playwright para los 5 flujo principales (opcional)
- Performance testing con Lighthouse
- Cross-browser testing

### Entregables
- Suite de tests completa
- CI pipeline con tests
- Reporte de cobertura

---

## Fase 20: Produccion & Deploy

**Duracion:** 2-3 dias
**Dependencias:** Fase 19

### Objetivos
- Configurar variables de entorno para prod
- Build optimizado (code splitting, tree shaking)
- Dockerizar frontend (opcional)
- Configurar CDN para assets estaticos
- SEO meta tags
- Analytics/Monitoring (Sentry for frontend)
- PWA support (opcional)
- Documentacion de deploy

### Entregables
- Frontend deployado
- Monitoreo configurado
- Documentacion de deploy
