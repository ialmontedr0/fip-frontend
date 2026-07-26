# Fase 10: Credit Cards & Loans — Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Backend API Reference](#2-backend-api-reference)
    - 2.1 [Cards CRUD](#21-cards-crud)
    - 2.2 [Cards Summary & Utilization](#22-cards-summary--utilization)
    - 2.3 [Card Bills](#23-card-bills)
    - 2.4 [Card Spending Limits](#24-card-spending-limits)
    - 2.5 [Card Alerts](#25-card-alerts)
    - 2.6 [Card Statements](#26-card-statements)
    - 2.7 [Card Automations (Quick Card Payment)](#27-card-automations-quick-card-payment)
    - 2.8 [Loans CRUD](#28-loans-crud)
    - 2.9 [Loans Amortization](#29-loans-amortization)
    - 2.10 [Loan Payments](#210-loan-payments)
    - 2.11 [Loan Simulations & Early Payoff](#211-loan-simulations--early-payoff)
    - 2.12 [Enums & Constants](#212-enums--constants)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Tipos de TypeScript](#4-tipos-de-typescript)
5. [API Client](#5-api-client)
6. [Hooks de TanStack Query](#6-hooks-de-tanstack-query)
7. [Constantes y Configuracion](#7-constantes-y-configuracion)
8. [Componentes Compartidos](#8-componentes-compartidos)
    - 8.1 [UtilizationGauge](#81-utilizationgauge)
    - 8.2 [CardNetworkBadge](#82-cardnetworkbadge)
    - 8.3 [CardStatusBadge](#83-cardstatusbadge)
    - 8.4 [BillStatusBadge](#84-billstatusbadge)
    - 8.5 [LoanTypeBadge](#85-loantypebadge)
    - 8.6 [LoanStatusBadge](#86-loanstatusbadge)
    - 8.7 [AmortizationTable](#87-amortizationtable)
    - 8.8 [AmortizationChart](#88-amortizationchart)
    - 8.9 [CardCard (Card List Item)](#89-cardcard-card-list-item)
    - 8.10 [LoanCard (Loan List Item)](#810-loancard-loan-list-item)
    - 8.11 [SpendingLimitCard](#811-spendinglimitcard)
    - 8.12 [CardAlertItem](#812-cardalertitem)
    - 8.13 [BillCard](#813-billcard)
    - 8.14 [PaymentForm](#814-paymentform)
    - 8.15 [LoanSimulatorForm](#815-loansimulatorform)
    - 8.16 [EarlyPayoffResult](#816-earlypayoffresult)
9. [Pages (Layouts y Comportamiento)](#9-pages-layouts-y-comportamiento)
    - 9.1 [CardListPage](#91-cardlistpage)
    - 9.2 [CardCreatePage](#92-cardcreatepage)
    - 9.3 [CardEditPage](#93-cardeditpage)
    - 9.4 [CardDetailPage](#94-carddetailpage)
    - 9.5 [CardBillListPage](#95-cardbilllistpage)
    - 9.6 [CardBillPayPage](#96-cardbillpaypage)
    - 9.7 [CardSpendingLimitsPage](#97-cardspendinglimitspage)
    - 9.8 [CardAlertsPage](#98-cardalertspage)
    - 9.9 [LoanListPage](#99-loanlistpage)
    - 9.10 [LoanCreatePage](#910-loancreatepage)
    - 9.11 [LoanDetailPage](#911-loandetailpage)
    - 9.12 [LoanAmortizationPage](#912-loanamortizationpage)
    - 9.13 [LoanPaymentPage](#913-loanpaymentpage)
    - 9.14 [LoanPaymentHistoryPage](#914-loanpaymenthistorypage)
    - 9.15 [LoanEarlyPayoffPage](#915-loanearlypayoffpage)
    - 9.16 [NewLoanSimulatorPage](#916-newloansimulatorpage)
10. [Actualizacion de Routing](#10-actualizacion-de-routing)
11. [Actualizacion de Sidebar](#11-actualizacion-de-sidebar)
12. [Estrategias y Mejores Practicas](#12-estrategias-y-mejores-practicas)
13. [Verificacion Final](#13-verificacion-final)

---

## 1. Resumen de la Fase

**Estado actual:** Fase 9 completada (Goals CRUD, Simulation, Summary Dashboard, redesign moderno).

**Objetivos de Fase 10:**

| Area | Descripcion |
|------|-------------|
| **Card CRUD** | Crear, listar, detalle, editar, eliminar tarjetas de credito |
| **Card Summary** | Portfolio total: limite total, utilizado, disponible, utilization pct |
| **Card Utilization Gauge** | Grafico de medidor circular (healthy/warning/danger) |
| **Card Bills** | Listar por tarjeta, crear/editar/eliminar facturas, payment status + due dates |
| **Pay Bill Flow** | Formulario de pago: monto, metodo (manual/auto/transfer/cash) |
| **Spending Limits** | CRUD de limites: daily/weekly/monthly/category con progreso |
| **Card Alerts** | Listar, marcar como leido, dismiss, check ahora |
| **Card Network Badges** | Visa, Mastercard, Amex con colores distintivos |
| **Statement Generation** | Auto-generar statement desde transacciones |
| **Loan CRUD** | Crear (9 tipos), listar, detalle, editar, eliminar, cambiar status |
| **Loan Amortization Table** | Tabla completa pago a pago con principal/interest/balance |
| **Amortization Chart** | Grafico de barras apiladas principal vs interest por mes |
| **Loan Payments** | Hacer pago (monto, metodo, referencia), historial de pagos |
| **Early Payoff Simulator** | Calcular monto total para liquidacion anticipada + ahorro |
| **New Loan Simulator** | Stateless: variables -> monthly payment, total interest, schedule preview |

### Convenciones a Seguir

- **Patron existente**: Seguir exactamente la misma estructura que Fases 6-9
- **API Client**: Todos los llamados van por `lib/api.ts`
- **Server State**: TanStack Query para todos los datos del API
- **Forms**: React Hook Form + Zod para validacion
- **Toasts**: `react-hot-toast` para feedback
- **Estilo**: TailwindCSS con glass morphism `bg-white/80 backdrop-blur-xl`
- **Animaciones**: `animate-fade-in` con `animationDelay` escalonado
- **Componentes UI**: Usar los existentes en `components/ui/` (Card, Button, Input, Badge, Skeleton, Modal, etc.)
- **Iconos**: Lucide React
- **Balance**: Usar `formatCurrency(parseFloat(amount), currency_code)` de `lib/utils.ts`
- **Charts**: Recharts para amortization chart (BarChart stacked) y utilization gauge
- **Tabla responsive**: Card layout en mobile, tabla en desktop
- **Misma estructura que goals**: Carpeta `api/`, `hooks/`, `components/`, `pages/`

---

## 2. Backend API Reference

Base path: `/api/v1`

---

### 2.1 Cards CRUD

#### `POST /cards` — Crear tarjeta (201)

**Request Body:**
```typescript
{
  name: string                          // requerido, 1-100 chars
  account_id: string                    // requerido, UUID
  last_four_digits?: string | null      // max 4 chars
  card_network?: string | null          // visa | mastercard | amex
  credit_limit?: string | null          // decimal como string "10000.00"
  available_credit?: string | null
  statement_day?: number | null         // 1-28
  payment_due_day?: number | null       // 1-28
  interest_rate?: string | null         // anual ej. "0.2499" = 24.99%
  color?: string | null                 // hex "#FF5733"
  icon?: string | null                  // max 500 chars
}
```

**Response (201):**
```typescript
{
  id: string
  name: string
  account_id: string
  last_four_digits: string | null
  card_network: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  color: string | null
  created_at: string | null             // ISO datetime
}
```

#### `GET /cards` — Listar tarjetas (200)

**Response:**
```typescript
{
  cards: Array<{
    id: string
    name: string
    account_id: string
    last_four_digits: string | null
    card_network: string | null
    credit_limit: string | null
    available_credit: string | null
    statement_day: number | null
    payment_due_day: number | null
    interest_rate: string | null
    is_active: boolean
    color: string | null
    created_at: string | null
  }>
  total: number
}
```

#### `GET /cards/summary` — Portfolio summary (200)

**Response:**
```typescript
{
  total_cards: number
  total_credit_limit: string
  total_used_credit: string
  total_available_credit: string
  average_utilization_pct: string
  unpaid_bills: number
  total_minimum_payment: string
  unread_alerts: number
  cards: Array<{
    id: string
    name: string
    last_four_digits: string | null
    card_network: string | null
    credit_limit: string | null
    is_active: boolean
    color: string | null
  }>
}
```

#### `GET /cards/{card_id}` — Detalle de tarjeta (200)

**Response:**
```typescript
{
  id: string
  name: string
  account_id: string
  last_four_digits: string | null
  card_network: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  include_in_totals: boolean
  color: string | null
  icon: string | null
  utilization: {
    credit_limit: string
    available_credit: string
    used_credit: string
    used_in_cycle: string
    utilization_percentage: string
    status: 'healthy' | 'warning' | 'danger'
    period_start: string                // ISO date
    period_end: string                  // ISO date
  }
  unread_alerts: number
  created_at: string | null
  updated_at: string | null
}
```

#### `PATCH /cards/{card_id}` — Actualizar tarjeta (200)

**Request Body:** (todos opcionales)
```typescript
{
  name?: string
  last_four_digits?: string | null
  card_network?: string | null
  credit_limit?: string | null          // debe ser > 0
  available_credit?: string | null
  statement_day?: number | null         // 1-28
  payment_due_day?: number | null       // 1-28
  interest_rate?: string | null
  is_active?: boolean
  include_in_totals?: boolean
  color?: string | null
  icon?: string | null
}
```

**Response:** Mismo shape que GET detail pero sin `utilization` y `unread_alerts`.

#### `DELETE /cards/{card_id}` — Eliminar tarjeta (200)

**Response:** `{ message: "Credit card deleted successfully" }`

---

### 2.2 Cards Summary & Utilization

#### `GET /cards/{card_id}/utilization` — Utilization actual (200)

**Response:**
```typescript
{
  credit_limit: string
  available_credit: string
  used_credit: string
  used_in_cycle: string
  utilization_percentage: string
  status: 'healthy' | 'warning' | 'danger'
  period_start: string
  period_end: string
}
```

**Thresholds:** `< 30%` = healthy, `30-69%` = warning, `>= 70%` = danger

#### `GET /cards/{card_id}/utilization/history?months=6` — Historial utilization (200)

**Response:**
```typescript
{
  credit_card_id: string
  current: { /* utilization object */ }
  history: Array<{
    month: string                       // ISO date (primer dia del mes)
    spent: string
    credit_limit: string
    utilization_pct: string
    status: 'healthy' | 'warning' | 'danger'
  }>
  months: number
}
```

#### `GET /cards/{card_id}/spending?period_start=&period_end=` — Spending por categoria (200)

**Response:**
```typescript
{
  credit_card_id: string
  period_start: string | null
  period_end: string | null
  total_spent: string
  categories: Array<{
    category_id: string | null
    total: string
    transaction_count: number
  }>
}
```

---

### 2.3 Card Bills

#### `POST /cards/{card_id}/bills` — Crear factura (201)

**Request Body:**
```typescript
{
  statement_date: string                // ISO date "YYYY-MM-DD"
  due_date: string                      // ISO date, debe ser > statement_date
  total_amount: string                  // >= 0
  minimum_payment?: string | null
  interest_charged?: string | null
  notes?: string | null
}
```

**Response (201):**
```typescript
{
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  payment_status: 'pending'            // siempre empieza como pending
  amount_paid: string
  transaction_count: number
  notes: string | null
  created_at: string | null
}
```

#### `GET /cards/{card_id}/bills` — Listar facturas (200)

**Response:**
```typescript
{
  bills: Array<{
    id: string
    credit_card_id: string
    statement_date: string
    due_date: string
    total_amount: string
    minimum_payment: string | null
    interest_charged: string | null
    payment_status: string              // pending | partial | paid | overdue | waived
    amount_paid: string
    paid_at: string | null
    transaction_count: number
    notes: string | null
    created_at: string | null
  }>
  total: number
  credit_card_id: string
}
```

#### `PATCH /cards/{card_id}/bills/{bill_id}` — Actualizar factura (200)

**Request Body:** (todos opcionales)
```typescript
{
  total_amount?: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'
  notes?: string | null
}
```

**Response:** Mismo shape que create response + `updated_at`.

#### `DELETE /cards/{card_id}/bills/{bill_id}` — Eliminar factura (200)

**Response:** `{ message: "Bill deleted successfully" }`

#### `POST /cards/{card_id}/bills/{bill_id}/pay` — Pagar factura (200)

**Request Body:**
```typescript
{
  amount: number                        // > 0
  payment_method?: 'manual' | 'auto' | 'transfer' | 'cash'
}
```

**Response:**
```typescript
{
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  amount_paid: string
  payment_status: 'pending' | 'partial' | 'paid'
  paid_at: string | null
  payment_amount: string
  payment_method: string
}
```

**Logica de pago:** Si `amount_paid + amount >= total` -> status = `paid`, amount_paid = total. Si `amount_paid + amount > 0` -> `partial`. Sino `pending`.

---

### 2.4 Card Spending Limits

#### `POST /cards/{card_id}/limits` — Crear limite de gasto (201)

**Request Body:**
```typescript
{
  limit_type: 'daily' | 'weekly' | 'monthly' | 'category'
  limit_amount: string                  // > 0
  category_id?: string | null           // UUID, requerido si limit_type = "category"
  alert_threshold?: number              // 1-100, default 80
  alert_enabled?: boolean               // default true
  description?: string | null
}
```

**Response (201):**
```typescript
{
  id: string
  credit_card_id: string
  limit_type: string
  limit_amount: string
  spent_amount: string
  category_id: string | null
  alert_threshold: number
  alert_enabled: boolean
  description: string | null
  is_active: boolean
  created_at: string | null
}
```

#### `GET /cards/{card_id}/limits` — Listar limites (200)

**Response:**
```typescript
{
  limits: Array<{
    id: string
    credit_card_id: string
    limit_type: string
    limit_amount: string
    spent_amount: string
    remaining: string
    pct_used: number
    status: 'ok' | 'warning' | 'exceeded'
    category_id: string | null
    alert_threshold: number
    alert_enabled: boolean
    description: string | null
    is_active: boolean
    period_start: string | null
    period_end: string | null
    created_at: string | null
  }>
  total: number
}
```

**Status logic:** `pct_used > 100` -> `exceeded`, `pct_used >= alert_threshold` -> `warning`, sino `ok`.

#### `PATCH /cards/{card_id}/limits/{limit_id}` — Actualizar limite (200)

**Request Body:** (todos opcionales)
```typescript
{
  limit_amount?: string                 // > 0
  alert_threshold?: number              // 1-100
  alert_enabled?: boolean
  description?: string | null
  is_active?: boolean
}
```

**Response:** Mismo shape que create + `pct_used` y `updated_at`.

#### `DELETE /cards/{card_id}/limits/{limit_id}` — Eliminar limite (200)

**Response:** `{ message: "Spending limit deleted successfully" }`

---

### 2.5 Card Alerts

#### `GET /cards/alerts/all?credit_card_id=&is_read=&alert_type=&severity=` — Listar alertas (200)

**Response:**
```typescript
{
  alerts: Array<{
    id: string
    credit_card_id: string
    credit_card_bill_id: string | null
    alert_type: string                  // high_utilization | limit_approaching | due_date_approaching | payment_overdue
    severity: string                    // warning | critical
    title: string
    message: string
    threshold_percentage: number | null
    current_amount: string | null
    limit_amount: string | null
    is_read: boolean
    is_dismissed: boolean
    triggered_at: string | null
  }>
  total: number
}
```

#### `POST /cards/alerts/read` — Marcar alerta(s) como leida(s) (200)

**Request Body:**
```typescript
{
  alert_id?: string                     // UUID, requerido si mark_all = false
  mark_all?: boolean                    // default false
}
```

**Response (single):** `{ message: "Alert marked as read" }`
**Response (all):** `{ message: "Marked 5 alerts as read", count: 5 }`

#### `POST /cards/alerts/{alert_id}/dismiss` — Descartar alerta (200)

**Response:** `{ message: "Alert dismissed" }`

#### `POST /cards/alerts/check` — Check alerts y generar nuevas (200)

**Response:**
```typescript
{
  new_alerts: number
  unread_alerts: number
  alerts_created: Array<{
    id: string
    alert_type: string
    severity: string
    title: string
  }>
}
```

**Alert types generados:**
- `high_utilization` (>= 90%, severity: `critical`)
- `limit_approaching` (>= 70% pero < 90%, severity: `warning`)
- `due_date_approaching` (bill due en 7 dias, severity: `warning` o `critical` si <= 2 dias)
- `payment_overdue` (bill past due, severity: `critical`)

---

### 2.6 Card Statements

#### `POST /cards/{card_id}/statements/generate` — Generar statement desde transacciones (200)

**Response:**
```typescript
{
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  transaction_count: number
  payment_status: 'pending'
}
```
O si no hay transacciones: `{ message: "No transactions found for statement generation" }`

---

### 2.7 Card Automations (Quick Card Payment)

#### `POST /automations/quick/card-payment` — Configurar pago automatico (200)

**Request Body:**
```typescript
{
  card_id: string                       // UUID, requerido
  payment_account_id: string            // UUID, requerido (cuenta origen)
  payment_type?: 'full' | 'partial'     // default "full"
  days_before_due?: number              // default 3
  name?: string | null
}
```

**Response:**
```typescript
{
  id: string
  name: string
  message: string
}
```

---

### 2.8 Loans CRUD

#### `POST /loans` — Crear prestamo (201)

**Request Body:**
```typescript
{
  name: string                          // requerido, 1-150 chars
  principal_amount: number              // > 0
  annual_interest_rate: number          // >= 0, ej. 12 = 12%
  term_months: number                   // 1-600
  loan_type?: string                    // default "personal"
  interest_type?: string                // default "fixed"
  payment_frequency?: string            // default "monthly"
  account_id?: string | null            // UUID
  lender_name?: string | null           // max 200
  account_number?: string | null        // max 100
  disbursement_date?: string | null     // ISO date
  grace_period_days?: number            // default 0, >= 0
  early_payoff_allowed?: boolean        // default true
  early_payoff_penalty_pct?: number | null  // >= 0
  penalty_rate_monthly?: number | null  // >= 0
  notes?: string | null                 // max 1000
}
```

**Response (201):**
```typescript
{
  id: string
  name: string
  loan_type: string
  principal_amount: number
  current_balance: number
  annual_interest_rate: number
  interest_type: string
  term_months: number
  monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_interest_expected: number
  disbursement_date: string | null
  first_payment_date: string | null
  next_payment_date: string | null
  final_payment_date: string | null
  status: 'active'
  lender_name: string | null
  account_number: string | null
  notes: string | null
  amortization_entries_count: number
  created_at: string | null
}
```

#### `GET /loans?status=&loan_type=` — Listar prestamos (200)

**Response:**
```typescript
{
  loans: Array<{
    id: string
    name: string
    loan_type: string
    principal_amount: number
    current_balance: number
    annual_interest_rate: number
    monthly_payment: number
    total_paid: number
    status: string
    next_payment_date: string | null
    progress_pct: number
    created_at: string | null
  }>
  total: number
}
```

#### `GET /loans/summary` — Portfolio summary (200)

**Response:**
```typescript
{
  total_balance: number
  total_monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_loans: number
  by_status: Record<string, number>
  upcoming_payments_30d: Array<{
    loan_id: string
    loan_name: string
    next_payment_date: string | null
    monthly_payment: number
    current_balance: number
  }>
  upcoming_count: number
}
```

#### `GET /loans/{loan_id}` — Detalle de prestamo (200)

**Response:**
```typescript
{
  id: string
  name: string
  description: string | null
  loan_type: string
  lender_name: string | null
  account_number: string | null
  principal_amount: number
  current_balance: number
  annual_interest_rate: number
  interest_type: string
  term_months: number
  payment_frequency: string
  monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_interest_expected: number
  disbursement_date: string | null
  first_payment_date: string | null
  next_payment_date: string | null
  final_payment_date: string | null
  paid_off_date: string | null
  status: string
  grace_period_days: number
  early_payoff_allowed: boolean
  early_payoff_penalty_pct: number | null
  penalty_rate_monthly: number | null
  progress_pct: number
  payments_summary: {
    total_paid: number
    total_interest: number
    total_principal: number
    total_penalties: number
    payment_count: number
  }
  upcoming_payment: {
    next_payment_date: string
    monthly_payment: number
    days_until_payment: number
  } | null
  notes: string | null
  created_at: string | null
}
```

#### `PATCH /loans/{loan_id}` — Actualizar prestamo (200)

**Request Body:** (solo estos campos)
```typescript
{
  name?: string
  description?: string | null
  lender_name?: string | null
  account_number?: string | null
  notes?: string | null
  grace_period_days?: number
  early_payoff_allowed?: boolean
  early_payoff_penalty_pct?: number | null
  penalty_rate_monthly?: number | null
}
```

**Response:** `{ id, name, description, lender_name, account_number, grace_period_days, early_payoff_allowed, early_payoff_penalty_pct, penalty_rate_monthly, notes, status }`

#### `DELETE /loans/{loan_id}` — Eliminar prestamo (200)

**Response:** `{ message: "Loan deleted successfully" }`

#### `PATCH /loans/{loan_id}/status` — Cambiar status (200)

**Request Body:**
```typescript
{ status: string }
```

**Transiciones validas:**
```
pending    -> active, cancelled
active     -> paid_off, defaulted, refinanced, suspended
suspended  -> active, defaulted
defaulted  -> active
```

**Response:**
```typescript
{ id: string, status: string, paid_off_date: string | null }
```

---

### 2.9 Loans Amortization

#### `GET /loans/{loan_id}/amortization?paid_only=false` — Schedule completo (200)

**Response:**
```typescript
{
  loan_id: string
  loan_name: string
  total_entries: number
  entries: Array<{
    entry_number: number
    due_date: string                    // ISO date
    payment_amount: number
    principal_portion: number
    interest_portion: number
    balance_after: number
    total_interest_to_date: number
    total_principal_to_date: number
    is_paid: boolean
  }>
}
```

#### `GET /loans/{loan_id}/amortization/summary` — Stats del schedule (200)

**Response:**
```typescript
{
  loan_id: string
  total_entries: number
  entries_paid: number
  entries_remaining: number
  progress_pct: number
  total_interest_scheduled: number
  total_principal_scheduled: number
  monthly_payment: number
  current_balance: number
}
```

---

### 2.10 Loan Payments

#### `POST /loans/{loan_id}/payments` — Hacer pago (201)

**Request Body:**
```typescript
{
  amount: number                        // > 0, debe exceder porcion de interes mensual
  payment_date?: string | null          // ISO date
  payment_method?: string               // default "bank_transfer"
  reference_number?: string | null      // max 100
  is_extra_payment?: boolean            // default false
  notes?: string | null
}
```

**Response (201):**
```typescript
{
  payment_id: string
  loan_id: string
  amount: number
  principal_portion: number
  interest_portion: number
  penalty_portion: number
  payment_date: string
  payment_method: string
  balance_after: number
  is_extra_payment: boolean
  loan_status: string
  current_balance: number
  total_paid: number
  total_interest_paid: number
}
```

#### `GET /loans/{loan_id}/payments?limit=50&offset=0` — Historial de pagos (200)

**Response:**
```typescript
{
  loan_id: string
  payments: Array<{
    id: string
    amount: number
    principal_portion: number
    interest_portion: number
    penalty_portion: number
    payment_date: string
    payment_method: string
    reference_number: string | null
    status: string                      // pending | completed | failed | reversed
    balance_after: number
    is_extra_payment: boolean
    notes: string | null
    created_at: string | null
  }>
  total: number
  summary: {
    total_paid: number
    total_interest: number
    total_principal: number
    total_penalties: number
    payment_count: number
  }
}
```

---

### 2.11 Loan Simulations & Early Payoff

#### `GET /loans/{loan_id}/early-payoff?payoff_date=` — Calcular liquidacion anticipada (200)

**Response:**
```typescript
{
  loan_id: string
  loan_name: string
  current_balance: number
  payoff_date: string
  remaining_months_scheduled: number
  outstanding_principal: number
  pro_rata_interest: number
  early_payoff_penalty: number
  total_payoff_amount: number
  interest_saved: number
  monthly_payment_current: number
  total_paid_so_far: number
}
```

#### `POST /loans/simulate` — Simular nuevo prestamo (stateless) (200)

**Request Body:**
```typescript
{
  principal_amount: number              // > 0
  annual_interest_rate: number          // >= 0
  term_months: number                   // 1-600
  start_date?: string | null            // ISO date
  extra_monthly_payment?: number        // default 0, >= 0
}
```

**Response:**
```typescript
{
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  monthly_payment: number
  extra_monthly_payment: number
  total_paid: number
  total_interest: number
  total_cost: number
  interest_to_principal_ratio: number
  actual_months: number
  early_payoff_months: number
  interest_saved_with_extra: number
  schedule_preview: Array<{             // primeros 12 meses
    entry_number: number
    due_date: string
    payment_amount: number
    principal_portion: number
    interest_portion: number
    balance_after: number
  }>
}
```

**Formula (cuota fija francesa):** `M = P * [r(1+r)^n] / [(1+r)^n - 1]`

Donde `P` = principal, `r` = tasa mensual (anual/100/12), `n` = meses.

---

### 2.12 Enums & Constants

**Card Networks:** `visa`, `mastercard`, `amex`

**Limit Types:** `daily`, `weekly`, `monthly`, `category`

**Utilization Status:** `healthy` (< 30%), `warning` (30-69%), `danger` (>= 70%)

**Bill Payment Status:** `pending`, `partial`, `paid`, `overdue`, `waived`

**Payment Method:** `manual`, `auto`, `transfer`, `cash`

**Alert Types:** `high_utilization`, `limit_approaching`, `due_date_approaching`, `payment_overdue`

**Alert Severity:** `warning`, `critical`

**Spend Limit Status:** `ok`, `warning`, `exceeded`

**Loan Types:**
| Type | Display |
|------|---------|
| personal | Prestamo Personal |
| mortgage | Hipotecario |
| auto | Auto |
| student | Estudiantil |
| business | Empresarial |
| personal_line | Linea de Credito |
| payday | Prestamo de Nomina |
| microloan | Microcredito |
| consolidation | Consolidacion de Deuda |

**Interest Types:** `fixed` (Fijo), `variable` (Variable), `mixed` (Mixto)

**Payment Frequencies:** `monthly` (Mensual), `bi_weekly` (Quincenal), `weekly` (Semanal)

**Loan Statuses:** `pending`, `active`, `paid_off`, `defaulted`, `refinanced`, `suspended`, `cancelled`

**Payment Methods (loans):** `bank_transfer`, `cash`, `auto_debit`, `check`, `online`, `mobile`

**Payment Statuses (loans):** `pending`, `completed`, `failed`, `reversed`

---

## 3. Estructura de Archivos

Crear dentro de `src/features/cards/` y `src/features/loans/`:

```
src/features/cards/
  api/
    cards.ts               # API client CRUD + utilization + spending
    bills.ts               # API client bills CRUD + pay
    limits.ts              # API client spending limits CRUD
    alerts.ts              # API client alerts
  hooks/
    useCards.ts            # TanStack Query hooks for cards
    useBills.ts            # TanStack Query hooks for bills
    useLimits.ts           # TanStack Query hooks for spending limits
    useAlerts.ts           # TanStack Query hooks for alerts
  components/
    UtilizationGauge.tsx    # Gauge semicircular (Recharts Pie)
    CardNetworkBadge.tsx    # Visa/Mastercard/Amex badge
    CardStatusBadge.tsx     # Active/inactive badge
    BillStatusBadge.tsx     # Pending/partial/paid/overdue/waived badge
    CardCard.tsx            # Card list item (responsive)
    BillCard.tsx            # Bill list item (responsive)
    SpendingLimitCard.tsx   # Limit card with progress
    CardAlertItem.tsx       # Single alert item
    CardForm.tsx            # Create/edit card form
    BillForm.tsx            # Create/edit bill form
    SpendingLimitForm.tsx   # Create/edit limit form
    PaymentForm.tsx         # Shared payment form (card bills + loan payments)
    SpendingByCategoryChart.tsx # Category breakdown pie/doughnut
    UtilizationHistoryChart.tsx # Line chart of utilization over time
  pages/
    CardListPage.tsx        # Lista de tarjetas con summary + gauges
    CardCreatePage.tsx      # Crear tarjeta
    CardEditPage.tsx        # Editar tarjeta
    CardDetailPage.tsx      # Detalle con tabs (overview, bills, limits, alerts)
    CardBillListPage.tsx    # Lista de facturas de una tarjeta
    CardBillCreatePage.tsx  # Crear factura manual
    CardBillPayPage.tsx     # Pagar factura
    CardSpendingLimitsPage.tsx # Gestion de limites de gasto
    CardAlertsPage.tsx      # Alertas de tarjetas
    CardStatementGeneratePage.tsx # Generar statement (modal/action)
  constants.ts              # Card networks, limit types, payment statuses, colors

src/features/loans/
  api/
    loans.ts               # API client loans CRUD + status + simulate
    amortization.ts        # API client amortization schedule + summary
    payments.ts            # API client payments CRUD + early payoff
  hooks/
    useLoans.ts            # TanStack Query hooks for loans
    useAmortization.ts     # TanStack Query hooks for amortization
    usePayments.ts         # TanStack Query hooks for payments
  components/
    LoanTypeBadge.tsx       # Badge de tipo con icono
    LoanStatusBadge.tsx     # Badge de estado con color
    LoanCard.tsx            # Loan list item (responsive)
    LoanForm.tsx            # Create/edit loan form
    AmortizationTable.tsx   # Tabla de amortizacion completa
    AmortizationChart.tsx   # Stacked bar chart principal vs interest
    PaymentCard.tsx         # Payment history list item
    PaymentForm.tsx         # Make payment form
    LoanSimulatorForm.tsx   # New loan simulator form
    EarlyPayoffResult.tsx   # Early payoff result card
    LoanSummaryCards.tsx    # Summary KPIs for loans portfolio
  pages/
    LoanListPage.tsx        # Lista de prestamos con summary bar
    LoanCreatePage.tsx      # Crear prestamo
    LoanEditPage.tsx        # Editar prestamo
    LoanDetailPage.tsx      # Detalle con tabs (overview, amortization, payments)
    LoanAmortizationPage.tsx # Tabla + chart de amortizacion
    LoanPaymentPage.tsx     # Hacer pago
    LoanPaymentHistoryPage.tsx # Historial de pagos
    LoanEarlyPayoffPage.tsx # Liquidacion anticipada
    NewLoanSimulatorPage.tsx # Simulador de nuevo prestamo
  constants.ts              # Loan types, interest types, frequencies, statuses, colors
```

---

## 4. Tipos de TypeScript

Crear `src/types/cards.ts`:

```typescript
// ================================================================
// Card Enums
// ================================================================

export const CARD_NETWORKS = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
} as const

export type CardNetwork = keyof typeof CARD_NETWORKS

export const CARD_LIMIT_TYPES = {
  daily: 'Diario',
  weekly: 'Semanal',
  monthly: 'Mensual',
  category: 'Categoria',
} as const

export type CardLimitType = keyof typeof CARD_LIMIT_TYPES

export const UTILIZATION_STATUS = {
  healthy: 'Saludable',
  warning: 'Precaucion',
  danger: 'Critico',
} as const

export type UtilizationStatus = keyof typeof UTILIZATION_STATUS

export const BILL_PAYMENT_STATUS = {
  pending: 'Pendiente',
  partial: 'Parcial',
  paid: 'Pagado',
  overdue: 'Vencido',
  waived: 'Condolido',
} as const

export type BillPaymentStatus = keyof typeof BILL_PAYMENT_STATUS

export const CARD_PAYMENT_METHODS = {
  manual: 'Manual',
  auto: 'Automatico',
  transfer: 'Transferencia',
  cash: 'Efectivo',
} as const

export type CardPaymentMethod = keyof typeof CARD_PAYMENT_METHODS

export const ALERT_TYPES = {
  high_utilization: 'Alta Utilization',
  limit_approaching: 'Limite Proximo',
  due_date_approaching: 'Vencimiento Proximo',
  payment_overdue: 'Pago Vencido',
} as const

export type AlertType = keyof typeof ALERT_TYPES

export const ALERT_SEVERITY = {
  warning: 'Advertencia',
  critical: 'Critico',
} as const

export type AlertSeverity = keyof typeof ALERT_SEVERITY

export const SPEND_LIMIT_STATUS = {
  ok: 'Ok',
  warning: 'Precaucion',
  exceeded: 'Excedido',
} as const

export type SpendLimitStatus = keyof typeof SPEND_LIMIT_STATUS

// ================================================================
// Card
// ================================================================

export interface CreateCardRequest {
  name: string
  account_id: string
  last_four_digits?: string | null
  card_network?: CardNetwork | null
  credit_limit?: string | null
  available_credit?: string | null
  statement_day?: number | null
  payment_due_day?: number | null
  interest_rate?: string | null
  color?: string | null
  icon?: string | null
}

export interface UpdateCardRequest {
  name?: string
  last_four_digits?: string | null
  card_network?: CardNetwork | null
  credit_limit?: string | null
  available_credit?: string | null
  statement_day?: number | null
  payment_due_day?: number | null
  interest_rate?: string | null
  is_active?: boolean
  include_in_totals?: boolean
  color?: string | null
  icon?: string | null
}

export interface CardUtilization {
  credit_limit: string
  available_credit: string
  used_credit: string
  used_in_cycle: string
  utilization_percentage: string
  status: UtilizationStatus
  period_start: string
  period_end: string
}

export interface CardResponse {
  id: string
  name: string
  account_id: string
  last_four_digits: string | null
  card_network: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  include_in_totals: boolean
  color: string | null
  icon: string | null
  utilization?: CardUtilization
  unread_alerts?: number
  created_at: string | null
  updated_at: string | null
}

export interface CardListItem {
  id: string
  name: string
  account_id: string
  last_four_digits: string | null
  card_network: string | null
  credit_limit: string | null
  available_credit: string | null
  statement_day: number | null
  payment_due_day: number | null
  interest_rate: string | null
  is_active: boolean
  color: string | null
  created_at: string | null
}

export interface CardSummaryResponse {
  total_cards: number
  total_credit_limit: string
  total_used_credit: string
  total_available_credit: string
  average_utilization_pct: string
  unpaid_bills: number
  total_minimum_payment: string
  unread_alerts: number
  cards: Array<{
    id: string
    name: string
    last_four_digits: string | null
    card_network: string | null
    credit_limit: string | null
    is_active: boolean
    color: string | null
  }>
}

export interface ListCardsResponse {
  cards: CardListItem[]
  total: number
}

export interface UtilizationHistoryResponse {
  credit_card_id: string
  current: CardUtilization
  history: Array<{
    month: string
    spent: string
    credit_limit: string
    utilization_pct: string
    status: UtilizationStatus
  }>
  months: number
}

export interface SpendingByCategoryResponse {
  credit_card_id: string
  period_start: string | null
  period_end: string | null
  total_spent: string
  categories: Array<{
    category_id: string | null
    total: string
    transaction_count: number
  }>
}

// ================================================================
// Card Bills
// ================================================================

export interface CreateBillRequest {
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment?: string | null
  interest_charged?: string | null
  notes?: string | null
}

export interface UpdateBillRequest {
  total_amount?: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_status?: BillPaymentStatus
  notes?: string | null
}

export interface PayBillRequest {
  amount: number
  payment_method?: CardPaymentMethod
}

export interface BillResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  payment_status: BillPaymentStatus
  amount_paid: string
  paid_at: string | null
  transaction_count: number
  notes: string | null
  created_at: string | null
  updated_at?: string | null
}

export interface PayBillResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  amount_paid: string
  payment_status: BillPaymentStatus
  paid_at: string | null
  payment_amount: string
  payment_method: CardPaymentMethod
}

export interface ListBillsResponse {
  bills: BillResponse[]
  total: number
  credit_card_id: string
}

// ================================================================
// Card Spending Limits
// ================================================================

export interface CreateSpendingLimitRequest {
  limit_type: CardLimitType
  limit_amount: string
  category_id?: string | null
  alert_threshold?: number
  alert_enabled?: boolean
  description?: string | null
}

export interface UpdateSpendingLimitRequest {
  limit_amount?: string
  alert_threshold?: number
  alert_enabled?: boolean
  description?: string | null
  is_active?: boolean
}

export interface SpendingLimitResponse {
  id: string
  credit_card_id: string
  limit_type: CardLimitType
  limit_amount: string
  spent_amount: string
  remaining?: string
  pct_used?: number
  status?: SpendLimitStatus
  category_id: string | null
  alert_threshold: number
  alert_enabled: boolean
  description: string | null
  is_active: boolean
  period_start?: string | null
  period_end?: string | null
  created_at: string | null
  updated_at?: string | null
}

export interface ListSpendingLimitsResponse {
  limits: SpendingLimitResponse[]
  total: number
}

// ================================================================
// Card Alerts
// ================================================================

export interface CardAlertResponse {
  id: string
  credit_card_id: string
  credit_card_bill_id: string | null
  alert_type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  threshold_percentage: number | null
  current_amount: string | null
  limit_amount: string | null
  is_read: boolean
  is_dismissed: boolean
  triggered_at: string | null
}

export interface ListCardAlertsResponse {
  alerts: CardAlertResponse[]
  total: number
}

export interface MarkAlertReadRequest {
  alert_id?: string
  mark_all?: boolean
}

export interface CheckAlertsResponse {
  new_alerts: number
  unread_alerts: number
  alerts_created: Array<{
    id: string
    alert_type: string
    severity: string
    title: string
  }>
}

export interface CardAlertsFilters {
  credit_card_id?: string
  is_read?: boolean
  alert_type?: AlertType
  severity?: AlertSeverity
}

// ================================================================
// Card Statement
// ================================================================

export interface GenerateStatementResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  transaction_count: number
  payment_status: 'pending'
}

// ================================================================
// Card Quick Automation
// ================================================================

export interface QuickCardPaymentRequest {
  card_id: string
  payment_account_id: string
  payment_type?: 'full' | 'partial'
  days_before_due?: number
  name?: string | null
}
```

Crear `src/types/loans.ts`:

```typescript
// ================================================================
// Loan Enums
// ================================================================

export const LOAN_TYPES = {
  personal: 'Prestamo Personal',
  mortgage: 'Hipotecario',
  auto: 'Auto',
  student: 'Estudiantil',
  business: 'Empresarial',
  personal_line: 'Linea de Credito',
  payday: 'Prestamo de Nomina',
  microloan: 'Microcredito',
  consolidation: 'Consolidacion de Deuda',
} as const

export type LoanType = keyof typeof LOAN_TYPES

export const INTEREST_TYPES = {
  fixed: 'Fijo',
  variable: 'Variable',
  mixed: 'Mixto',
} as const

export type InterestType = keyof typeof INTEREST_TYPES

export const PAYMENT_FREQUENCIES = {
  monthly: 'Mensual',
  bi_weekly: 'Quincenal',
  weekly: 'Semanal',
} as const

export type PaymentFrequency = keyof typeof PAYMENT_FREQUENCIES

export const LOAN_STATUSES = {
  pending: 'Pendiente',
  active: 'Activo',
  paid_off: 'Pagado',
  defaulted: 'Incumplimiento',
  refinanced: 'Refinanciado',
  suspended: 'Suspendido',
  cancelled: 'Cancelado',
} as const

export type LoanStatus = keyof typeof LOAN_STATUSES

export const LOAN_PAYMENT_METHODS = {
  bank_transfer: 'Transferencia Bancaria',
  cash: 'Efectivo',
  auto_debit: 'Debito Automatico',
  check: 'Cheque',
  online: 'En Linea',
  mobile: 'Movil',
} as const

export type LoanPaymentMethod = keyof typeof LOAN_PAYMENT_METHODS

export const LOAN_PAYMENT_STATUSES = {
  pending: 'Pendiente',
  completed: 'Completado',
  failed: 'Fallido',
  reversed: 'Revertido',
} as const

export type LoanPaymentStatus = keyof typeof LOAN_PAYMENT_STATUSES

// ================================================================
// Loan
// ================================================================

export interface CreateLoanRequest {
  name: string
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  loan_type?: LoanType
  interest_type?: InterestType
  payment_frequency?: PaymentFrequency
  account_id?: string | null
  lender_name?: string | null
  account_number?: string | null
  disbursement_date?: string | null
  grace_period_days?: number
  early_payoff_allowed?: boolean
  early_payoff_penalty_pct?: number | null
  penalty_rate_monthly?: number | null
  notes?: string | null
}

export interface UpdateLoanRequest {
  name?: string
  description?: string | null
  lender_name?: string | null
  account_number?: string | null
  notes?: string | null
  grace_period_days?: number
  early_payoff_allowed?: boolean
  early_payoff_penalty_pct?: number | null
  penalty_rate_monthly?: number | null
}

export interface UpdateLoanStatusRequest {
  status: LoanStatus
}

export interface LoanListItem {
  id: string
  name: string
  loan_type: LoanType
  principal_amount: number
  current_balance: number
  annual_interest_rate: number
  monthly_payment: number
  total_paid: number
  status: LoanStatus
  next_payment_date: string | null
  progress_pct: number
  created_at: string | null
}

export interface LoanDetailResponse {
  id: string
  name: string
  description: string | null
  loan_type: LoanType
  lender_name: string | null
  account_number: string | null
  principal_amount: number
  current_balance: number
  annual_interest_rate: number
  interest_type: InterestType
  term_months: number
  payment_frequency: PaymentFrequency
  monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_interest_expected: number
  disbursement_date: string | null
  first_payment_date: string | null
  next_payment_date: string | null
  final_payment_date: string | null
  paid_off_date: string | null
  status: LoanStatus
  grace_period_days: number
  early_payoff_allowed: boolean
  early_payoff_penalty_pct: number | null
  penalty_rate_monthly: number | null
  progress_pct: number
  payments_summary: {
    total_paid: number
    total_interest: number
    total_principal: number
    total_penalties: number
    payment_count: number
  }
  upcoming_payment: {
    next_payment_date: string
    monthly_payment: number
    days_until_payment: number
  } | null
  notes: string | null
  created_at: string | null
}

export interface ListLoansResponse {
  loans: LoanListItem[]
  total: number
}

export interface LoanSummaryResponse {
  total_balance: number
  total_monthly_payment: number
  total_paid: number
  total_interest_paid: number
  total_loans: number
  by_status: Record<string, number>
  upcoming_payments_30d: Array<{
    loan_id: string
    loan_name: string
    next_payment_date: string | null
    monthly_payment: number
    current_balance: number
  }>
  upcoming_count: number
}

// ================================================================
// Amortization
// ================================================================

export interface AmortizationEntry {
  entry_number: number
  due_date: string
  payment_amount: number
  principal_portion: number
  interest_portion: number
  balance_after: number
  total_interest_to_date: number
  total_principal_to_date: number
  is_paid: boolean
}

export interface AmortizationResponse {
  loan_id: string
  loan_name: string
  total_entries: number
  entries: AmortizationEntry[]
}

export interface AmortizationSummaryResponse {
  loan_id: string
  total_entries: number
  entries_paid: number
  entries_remaining: number
  progress_pct: number
  total_interest_scheduled: number
  total_principal_scheduled: number
  monthly_payment: number
  current_balance: number
}

// ================================================================
// Loan Payments
// ================================================================

export interface MakePaymentRequest {
  amount: number
  payment_date?: string | null
  payment_method?: LoanPaymentMethod
  reference_number?: string | null
  is_extra_payment?: boolean
  notes?: string | null
}

export interface PaymentResponse {
  id: string
  amount: number
  principal_portion: number
  interest_portion: number
  penalty_portion: number
  payment_date: string
  payment_method: string
  reference_number: string | null
  status: LoanPaymentStatus
  balance_after: number
  is_extra_payment: boolean
  notes: string | null
  created_at: string | null
}

export interface MakePaymentResponse {
  payment_id: string
  loan_id: string
  amount: number
  principal_portion: number
  interest_portion: number
  penalty_portion: number
  payment_date: string
  payment_method: string
  balance_after: number
  is_extra_payment: boolean
  loan_status: LoanStatus
  current_balance: number
  total_paid: number
  total_interest_paid: number
}

export interface ListPaymentsResponse {
  loan_id: string
  payments: PaymentResponse[]
  total: number
  summary: {
    total_paid: number
    total_interest: number
    total_principal: number
    total_penalties: number
    payment_count: number
  }
}

// ================================================================
// Early Payoff
// ================================================================

export interface EarlyPayoffResponse {
  loan_id: string
  loan_name: string
  current_balance: number
  payoff_date: string
  remaining_months_scheduled: number
  outstanding_principal: number
  pro_rata_interest: number
  early_payoff_penalty: number
  total_payoff_amount: number
  interest_saved: number
  monthly_payment_current: number
  total_paid_so_far: number
}

// ================================================================
// Loan Simulator (stateless)
// ================================================================

export interface SimulateLoanRequest {
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  start_date?: string | null
  extra_monthly_payment?: number
}

export interface SimulateLoanResponse {
  principal_amount: number
  annual_interest_rate: number
  term_months: number
  monthly_payment: number
  extra_monthly_payment: number
  total_paid: number
  total_interest: number
  total_cost: number
  interest_to_principal_ratio: number
  actual_months: number
  early_payoff_months: number
  interest_saved_with_extra: number
  schedule_preview: Array<{
    entry_number: number
    due_date: string
    payment_amount: number
    principal_portion: number
    interest_portion: number
    balance_after: number
  }>
}
```

---

## 5. API Client

Crear `src/features/cards/api/cards.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateCardRequest,
  UpdateCardRequest,
  CardResponse,
  ListCardsResponse,
  CardSummaryResponse,
  UtilizationHistoryResponse,
  SpendingByCategoryResponse,
} from '@/types/cards'

export const cardsApi = {
  list: (params?: { is_active?: boolean }) =>
    api.get<ListCardsResponse>('/cards', { params }).then((r) => r.data),

  summary: () =>
    api.get<CardSummaryResponse>('/cards/summary').then((r) => r.data),

  get: (id: string) =>
    api.get<CardResponse>(`/cards/${id}`).then((r) => r.data),

  create: (data: CreateCardRequest) =>
    api.post<CardResponse>('/cards', data).then((r) => r.data),

  update: (id: string, data: UpdateCardRequest) =>
    api.patch<CardResponse>(`/cards/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/cards/${id}`).then((r) => r.data),

  utilization: (id: string) =>
    api.get(`/cards/${id}/utilization`).then((r) => r.data),

  utilizationHistory: (id: string, months = 6) =>
    api.get<UtilizationHistoryResponse>(`/cards/${id}/utilization/history`, {
      params: { months },
    }).then((r) => r.data),

  spendingByCategory: (id: string, period_start?: string, period_end?: string) =>
    api.get<SpendingByCategoryResponse>(`/cards/${id}/spending`, {
      params: { period_start, period_end },
    }).then((r) => r.data),
}
```

Crear `src/features/cards/api/bills.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateBillRequest,
  UpdateBillRequest,
  PayBillRequest,
  BillResponse,
  PayBillResponse,
  ListBillsResponse,
} from '@/types/cards'

export const billsApi = {
  list: (cardId: string) =>
    api.get<ListBillsResponse>(`/cards/${cardId}/bills`).then((r) => r.data),

  create: (cardId: string, data: CreateBillRequest) =>
    api.post<BillResponse>(`/cards/${cardId}/bills`, data).then((r) => r.data),

  update: (cardId: string, billId: string, data: UpdateBillRequest) =>
    api.patch<BillResponse>(`/cards/${cardId}/bills/${billId}`, data).then((r) => r.data),

  delete: (cardId: string, billId: string) =>
    api.delete(`/cards/${cardId}/bills/${billId}`).then((r) => r.data),

  pay: (cardId: string, billId: string, data: PayBillRequest) =>
    api.post<PayBillResponse>(`/cards/${cardId}/bills/${billId}/pay`, data).then((r) => r.data),

  generateStatement: (cardId: string) =>
    api.post(`/cards/${cardId}/statements/generate`).then((r) => r.data),
}
```

Crear `src/features/cards/api/limits.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateSpendingLimitRequest,
  UpdateSpendingLimitRequest,
  SpendingLimitResponse,
  ListSpendingLimitsResponse,
} from '@/types/cards'

export const limitsApi = {
  list: (cardId: string) =>
    api.get<ListSpendingLimitsResponse>(`/cards/${cardId}/limits`).then((r) => r.data),

  create: (cardId: string, data: CreateSpendingLimitRequest) =>
    api.post<SpendingLimitResponse>(`/cards/${cardId}/limits`, data).then((r) => r.data),

  update: (cardId: string, limitId: string, data: UpdateSpendingLimitRequest) =>
    api.patch<SpendingLimitResponse>(`/cards/${cardId}/limits/${limitId}`, data).then((r) => r.data),

  delete: (cardId: string, limitId: string) =>
    api.delete(`/cards/${cardId}/limits/${limitId}`).then((r) => r.data),
}
```

Crear `src/features/cards/api/alerts.ts`:

```typescript
import api from '@/lib/api'
import type {
  CardAlertResponse,
  ListCardAlertsResponse,
  MarkAlertReadRequest,
  CheckAlertsResponse,
  CardAlertsFilters,
} from '@/types/cards'

export const alertsApi = {
  list: (filters?: CardAlertsFilters) =>
    api.get<ListCardAlertsResponse>('/cards/alerts/all', { params: filters }).then((r) => r.data),

  markRead: (data: MarkAlertReadRequest) =>
    api.post('/cards/alerts/read', data).then((r) => r.data),

  dismiss: (alertId: string) =>
    api.post(`/cards/alerts/${alertId}/dismiss`).then((r) => r.data),

  check: () =>
    api.post<CheckAlertsResponse>('/cards/alerts/check').then((r) => r.data),
}
```

Crear `src/features/loans/api/loans.ts`:

```typescript
import api from '@/lib/api'
import type {
  CreateLoanRequest,
  UpdateLoanRequest,
  UpdateLoanStatusRequest,
  LoanDetailResponse,
  LoanListItem,
  ListLoansResponse,
  LoanSummaryResponse,
  SimulateLoanRequest,
  SimulateLoanResponse,
} from '@/types/loans'

export const loansApi = {
  list: (params?: { status?: string; loan_type?: string }) =>
    api.get<ListLoansResponse>('/loans', { params }).then((r) => r.data),

  summary: () =>
    api.get<LoanSummaryResponse>('/loans/summary').then((r) => r.data),

  get: (id: string) =>
    api.get<LoanDetailResponse>(`/loans/${id}`).then((r) => r.data),

  create: (data: CreateLoanRequest) =>
    api.post<LoanDetailResponse>('/loans', data).then((r) => r.data),

  update: (id: string, data: UpdateLoanRequest) =>
    api.patch(`/loans/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/loans/${id}`).then((r) => r.data),

  updateStatus: (id: string, data: UpdateLoanStatusRequest) =>
    api.patch(`/loans/${id}/status`, data).then((r) => r.data),

  simulate: (data: SimulateLoanRequest) =>
    api.post<SimulateLoanResponse>('/loans/simulate', data).then((r) => r.data),
}
```

Crear `src/features/loans/api/amortization.ts`:

```typescript
import api from '@/lib/api'
import type { AmortizationResponse, AmortizationSummaryResponse } from '@/types/loans'

export const amortizationApi = {
  get: (loanId: string, paidOnly = false) =>
    api.get<AmortizationResponse>(`/loans/${loanId}/amortization`, {
      params: { paid_only: paidOnly },
    }).then((r) => r.data),

  summary: (loanId: string) =>
    api.get<AmortizationSummaryResponse>(`/loans/${loanId}/amortization/summary`).then((r) => r.data),
}
```

Crear `src/features/loans/api/payments.ts`:

```typescript
import api from '@/lib/api'
import type {
  MakePaymentRequest,
  MakePaymentResponse,
  ListPaymentsResponse,
  EarlyPayoffResponse,
} from '@/types/loans'

export const paymentsApi = {
  list: (loanId: string, params?: { limit?: number; offset?: number }) =>
    api.get<ListPaymentsResponse>(`/loans/${loanId}/payments`, { params }).then((r) => r.data),

  make: (loanId: string, data: MakePaymentRequest) =>
    api.post<MakePaymentResponse>(`/loans/${loanId}/payments`, data).then((r) => r.data),

  earlyPayoff: (loanId: string, payoffDate?: string) =>
    api.get<EarlyPayoffResponse>(`/loans/${loanId}/early-payoff`, {
      params: { payoff_date: payoffDate },
    }).then((r) => r.data),
}
```

---

## 6. Hooks de TanStack Query

Crear `src/features/cards/hooks/useCards.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '../api/cards'
import type { CreateCardRequest, UpdateCardRequest } from '@/types/cards'

const keys = {
  all: ['cards'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
  summaries: () => [...keys.all, 'summary'] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
  utilization: (id: string) => [...keys.all, 'utilization', id] as const,
  utilizationHistory: (id: string, months?: number) =>
    [...keys.all, 'utilizationHistory', id, months] as const,
  spending: (id: string, periodStart?: string, periodEnd?: string) =>
    [...keys.all, 'spending', id, periodStart, periodEnd] as const,
}

export function useCardList(filters?: { is_active?: boolean }) {
  return useQuery({
    queryKey: keys.list(filters),
    queryFn: () => cardsApi.list(filters),
  })
}

export function useCardSummary() {
  return useQuery({
    queryKey: keys.summaries(),
    queryFn: () => cardsApi.summary(),
  })
}

export function useCard(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => cardsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useUpdateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardRequest }) =>
      cardsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useDeleteCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useCardUtilization(id: string) {
  return useQuery({
    queryKey: keys.utilization(id),
    queryFn: () => cardsApi.utilization(id),
    enabled: !!id,
  })
}

export function useUtilizationHistory(id: string, months = 6) {
  return useQuery({
    queryKey: keys.utilizationHistory(id, months),
    queryFn: () => cardsApi.utilizationHistory(id, months),
    enabled: !!id,
  })
}

export function useSpendingByCategory(id: string, periodStart?: string, periodEnd?: string) {
  return useQuery({
    queryKey: keys.spending(id, periodStart, periodEnd),
    queryFn: () => cardsApi.spendingByCategory(id, periodStart, periodEnd),
    enabled: !!id,
  })
}
```

Crear `src/features/cards/hooks/useBills.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billsApi } from '../api/bills'
import type { CreateBillRequest, UpdateBillRequest, PayBillRequest } from '@/types/cards'

const keys = {
  all: (cardId: string) => ['cards', cardId, 'bills'] as const,
  list: (cardId: string) => [...keys.all(cardId), 'list'] as const,
}

export function useBillList(cardId: string) {
  return useQuery({
    queryKey: keys.list(cardId),
    queryFn: () => billsApi.list(cardId),
    enabled: !!cardId,
  })
}

export function useCreateBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBillRequest) => billsApi.create(cardId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}

export function useUpdateBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: UpdateBillRequest }) =>
      billsApi.update(cardId, billId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}

export function useDeleteBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (billId: string) => billsApi.delete(cardId, billId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}

export function usePayBill(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: PayBillRequest }) =>
      billsApi.pay(cardId, billId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all(cardId) })
      qc.invalidateQueries({ queryKey: ['cards', cardId] })
    },
  })
}

export function useGenerateStatement(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => billsApi.generateStatement(cardId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}
```

Crear `src/features/cards/hooks/useLimits.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { limitsApi } from '../api/limits'
import type { CreateSpendingLimitRequest, UpdateSpendingLimitRequest } from '@/types/cards'

const keys = {
  all: (cardId: string) => ['cards', cardId, 'limits'] as const,
  list: (cardId: string) => [...keys.all(cardId), 'list'] as const,
}

export function useSpendingLimitList(cardId: string) {
  return useQuery({
    queryKey: keys.list(cardId),
    queryFn: () => limitsApi.list(cardId),
    enabled: !!cardId,
  })
}

export function useCreateSpendingLimit(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSpendingLimitRequest) => limitsApi.create(cardId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}

export function useUpdateSpendingLimit(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ limitId, data }: { limitId: string; data: UpdateSpendingLimitRequest }) =>
      limitsApi.update(cardId, limitId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}

export function useDeleteSpendingLimit(cardId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (limitId: string) => limitsApi.delete(cardId, limitId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all(cardId) }),
  })
}
```

Crear `src/features/cards/hooks/useAlerts.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '../api/alerts'
import type { CardAlertsFilters, MarkAlertReadRequest } from '@/types/cards'

const keys = {
  all: ['cardAlerts'] as const,
  list: (filters?: CardAlertsFilters) => [...keys.all, 'list', filters] as const,
}

export function useCardAlerts(filters?: CardAlertsFilters) {
  return useQuery({
    queryKey: keys.list(filters),
    queryFn: () => alertsApi.list(filters),
  })
}

export function useMarkAlertRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MarkAlertReadRequest) => alertsApi.markRead(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDismissAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => alertsApi.dismiss(alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useCheckAlerts() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => alertsApi.check(),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}
```

Crear `src/features/loans/hooks/useLoans.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loansApi } from '../api/loans'
import type {
  CreateLoanRequest,
  UpdateLoanRequest,
  SimulateLoanRequest,
} from '@/types/loans'

const keys = {
  all: ['loans'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
  summaries: () => [...keys.all, 'summary'] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
}

export function useLoanList(filters?: { status?: string; loan_type?: string }) {
  return useQuery({
    queryKey: keys.list(filters),
    queryFn: () => loansApi.list(filters),
  })
}

export function useLoanSummary() {
  return useQuery({
    queryKey: keys.summaries(),
    queryFn: () => loansApi.summary(),
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => loansApi.get(id),
    enabled: !!id,
  })
}

export function useCreateLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLoanRequest) => loansApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useUpdateLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoanRequest }) =>
      loansApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useDeleteLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => loansApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useUpdateLoanStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      loansApi.updateStatus(id, { status } as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useSimulateLoan() {
  return useMutation({
    mutationFn: (data: SimulateLoanRequest) => loansApi.simulate(data),
  })
}
```

Crear `src/features/loans/hooks/useAmortization.ts`:

```typescript
import { useQuery } from '@tanstack/react-query'
import { amortizationApi } from '../api/amortization'

export function useAmortizationSchedule(loanId: string, paidOnly = false) {
  return useQuery({
    queryKey: ['loans', loanId, 'amortization', { paidOnly }],
    queryFn: () => amortizationApi.get(loanId, paidOnly),
    enabled: !!loanId,
  })
}

export function useAmortizationSummary(loanId: string) {
  return useQuery({
    queryKey: ['loans', loanId, 'amortization', 'summary'],
    queryFn: () => amortizationApi.summary(loanId),
    enabled: !!loanId,
  })
}
```

Crear `src/features/loans/hooks/usePayments.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '../api/payments'
import type { MakePaymentRequest } from '@/types/loans'

export function usePaymentList(loanId: string, params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['loans', loanId, 'payments', params],
    queryFn: () => paymentsApi.list(loanId, params),
    enabled: !!loanId,
  })
}

export function useMakePayment(loanId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MakePaymentRequest) => paymentsApi.make(loanId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans', loanId] })
      qc.invalidateQueries({ queryKey: ['loans', loanId, 'payments'] })
      qc.invalidateQueries({ queryKey: ['loans', loanId, 'amortization'] })
    },
  })
}

export function useEarlyPayoff(loanId: string, payoffDate?: string) {
  return useQuery({
    queryKey: ['loans', loanId, 'earlyPayoff', payoffDate],
    queryFn: () => paymentsApi.earlyPayoff(loanId, payoffDate),
    enabled: !!loanId,
  })
}
```

---

## 7. Constantes y Configuracion

Crear `src/features/cards/constants.ts`:

```typescript
export const CARD_NETWORK_COLORS = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#2E77BC',
} as const

export const CARD_NETWORK_ICONS = {
  visa: 'CreditCard',
  mastercard: 'CreditCard',
  amex: 'CreditCard',
} as const

export const BILL_STATUS_COLORS = {
  pending: 'yellow',
  partial: 'blue',
  paid: 'green',
  overdue: 'red',
  waived: 'gray',
} as const

export const UTILIZATION_STATUS_COLORS = {
  healthy: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
} as const

export const ALERT_SEVERITY_COLORS = {
  warning: '#eab308',
  critical: '#ef4444',
} as const

export const SPEND_LIMIT_STATUS_COLORS = {
  ok: '#22c55e',
  warning: '#eab308',
  exceeded: '#ef4444',
} as const
```

Crear `src/features/loans/constants.ts`:

```typescript
export const LOAN_TYPE_ICONS: Record<string, string> = {
  personal: 'User',
  mortgage: 'Home',
  auto: 'Car',
  student: 'GraduationCap',
  business: 'Building2',
  personal_line: 'CreditCard',
  payday: 'CalendarCheck',
  microloan: 'Coins',
  consolidation: 'PiggyBank',
}

export const LOAN_TYPE_COLORS: Record<string, string> = {
  personal: '#6366f1',
  mortgage: '#f59e0b',
  auto: '#ef4444',
  student: '#8b5cf6',
  business: '#3b82f6',
  personal_line: '#14b8a6',
  payday: '#f97316',
  microloan: '#84cc16',
  consolidation: '#06b6d4',
}

export const LOAN_STATUS_COLORS = {
  pending: 'yellow',
  active: 'green',
  paid_off: 'blue',
  defaulted: 'red',
  refinanced: 'purple',
  suspended: 'orange',
  cancelled: 'gray',
} as const

export const INTEREST_TYPE_COLORS = {
  fixed: '#22c55e',
  variable: '#eab308',
  mixed: '#3b82f6',
} as const
```

---

## 8. Componentes Compartidos

### 8.1 UtilizationGauge

Gauge semicircular que muestra el porcentaje de utilizacion.

**Props:**
```typescript
interface UtilizationGaugeProps {
  percentage: number         // 0-100
  size?: number              // default 200
  status: 'healthy' | 'warning' | 'danger'
  creditLimit?: string
  usedCredit?: string
}
```

**Implementacion:** Usar Recharts `PieChart` con dos sectores (arco relleno + fondo) para simular gauge semicircular. O alternativamente usar SVG nativo con `path` arc.

**Colores:**
- healthy: `#22c55e` (verde) para < 30%
- warning: `#eab308` (amarillo) para 30-69%
- danger: `#ef4444` (rojo) para >= 70%

**Layout:** Centrado con etiqueta de porcentaje en el centro, subtexto con limite/used.

### 8.2 CardNetworkBadge

Badge pequeno con el nombre de la red y color corporativo.

**Props:**
```typescript
interface CardNetworkBadgeProps {
  network: string | null     // visa | mastercard | amex
}
```

**Comportamiento:**
- `visa` -> fondo azul marino `#1A1F71`, texto blanco "Visa"
- `mastercard` -> fondo rojo `#EB001B`, texto blanco "Mastercard"
- `amex` -> fondo azul `#2E77BC`, texto blanco "Amex"
- `null` -> badge gris "—"

### 8.3 CardStatusBadge

**Props:**
```typescript
interface CardStatusBadgeProps {
  isActive: boolean
}
```

**Estados:**
- `true`: verde "Activa"
- `false`: rojo "Inactiva"

### 8.4 BillStatusBadge

**Props:**
```typescript
interface BillStatusBadgeProps {
  status: string    // pending | partial | paid | overdue | waived
}
```

**Colores por status:**
- `pending`: yellow
- `partial`: blue
- `paid`: green
- `overdue`: red
- `waived`: gray

### 8.5 LoanTypeBadge

**Props:**
```typescript
interface LoanTypeBadgeProps {
  type: string
}
```

Muestra icono + texto con color segun `LOAN_TYPE_COLORS`.

### 8.6 LoanStatusBadge

**Props:**
```typescript
interface LoanStatusBadgeProps {
  status: string
}
```

**Colores:** ver `constants.ts` de loans.

### 8.7 AmortizationTable

Tabla completa del schedule de amortizacion.

**Props:**
```typescript
interface AmortizationTableProps {
  entries: AmortizationEntry[]
  loading?: boolean
}
```

**Columnas:**
| # | Fecha | Pago | Principal | Interes | Balance | Pagado |
|---|-------|------|-----------|---------|---------|--------|

**Responsive:** En mobile mostrar menos columnas (entry, fecha, pago, balance). En desktop full.

**Features:**
- Resaltar filas pagadas con opacidad reducida o check
- Alternar colores de fondo en filas
- Scroll horizontal en mobile si es necesario
- Formatear montos con `formatCurrency`

### 8.8 AmortizationChart

Grafico de barras apiladas de principal vs interest por periodo.

**Props:**
```typescript
interface AmortizationChartProps {
  entries: AmortizationEntry[]
}
```

**Implementacion:** Usar Recharts `BarChart` con `Bar` para principal (verde) e interest (naranja/rojo) apilados.

**Features:**
- X-axis: entry_number o due_date
- Y-axis: monto
- Tooltip: entry, principal, interest, balance
- Legend: Principal, Interes
- Altura responsive, min 300px

### 8.9 CardCard (Card List Item)

**Props:**
```typescript
interface CardCardProps {
  card: CardListItem
  onClick?: () => void
}
```

**Layout:**
- Left: network badge + last 4 digits
- Center: card name + status badge
- Right: credit limit + utilization mini gauge
- Hover: shadow elevation + subtle border highlight

### 8.10 LoanCard (Loan List Item)

**Props:**
```typescript
interface LoanCardProps {
  loan: LoanListItem
  onClick?: () => void
}
```

**Layout:**
- Left: loan type badge
- Center: name + lender + status badge
- Right: balance + interest rate
- Bottom: progress bar showing `progress_pct` (0-100)
- Hover: elevation

### 8.11 SpendingLimitCard

**Props:**
```typescript
interface SpendingLimitCardProps {
  limit: SpendingLimitResponse
  onEdit?: () => void
  onDelete?: () => void
}
```

**Layout:**
- Header: limit type icon + name (description)
- Progress bar con `pct_used` y color segun status
- bottom: spent_amount / limit_amount
- Badge de status (ok/warning/exceeded)
- Acciones: editar (pencil), eliminar (trash)

### 8.12 CardAlertItem

**Props:**
```typescript
interface CardAlertItemProps {
  alert: CardAlertResponse
  onMarkRead?: () => void
  onDismiss?: () => void
}
```

**Layout:**
- Icono segun severity (warning: AlertTriangle, critical: AlertOctagon)
- Title + message
- Badge de severity
- Timestamp
- Botones: Mark Read (si no leido), Dismiss
- Opacidad reducida si `is_read`

### 8.13 BillCard

**Props:**
```typescript
interface BillCardProps {
  bill: BillResponse
  onPay?: () => void
  onEdit?: () => void
  onDelete?: () => void
}
```

**Layout:**
- Statement date + due date
- Total amount + minimum payment
- Payment status badge + amount paid / total
- Progress bar de pago (amount_paid / total_amount)
- Boton "Pagar" si status != paid

### 8.14 PaymentForm

Formulario compartido para pagar factura de tarjeta o prestamo.

**Props:**
```typescript
interface PaymentFormProps {
  maxAmount: number
  onSubmit: (data: PaymentFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
  mode: 'card' | 'loan'
}
```

**Campos:**
- Amount: input numerico, validado > 0 y <= maxAmount
- Payment date: date picker, default hoy
- Payment method: selector (manual/auto/transfer/cash para cards; bank_transfer/cash/auto_debit/check/online/mobile para loans)
- Reference number: opcional (solo loans)
- Is extra payment: checkbox (solo loans)
- Notes: textarea opcional

**Zod schema:**
```typescript
const paymentSchema = z.object({
  amount: z.number().positive('Monto debe ser positivo').max(maxAmount),
  payment_date: z.string().optional(),
  payment_method: z.string().default('manual'),
  reference_number: z.string().max(100).optional(),
  is_extra_payment: z.boolean().default(false),
  notes: z.string().max(500).optional(),
})
```

### 8.15 LoanSimulatorForm

**Props:**
```typescript
interface LoanSimulatorFormProps {
  onSimulate: (data: SimulateLoanRequest) => Promise<void>
  loading?: boolean
  result?: SimulateLoanResponse | null
}
```

**Campos:**
- Principal amount: input numerico
- Annual interest rate: input numerico (%)
- Term months: input numerico
- Start date: date picker opcional
- Extra monthly payment: input numerico opcional

**Layout:** Formulario a la izquierda, resultados a la derecha (o arriba/abajo en mobile).

### 8.16 EarlyPayoffResult

**Props:**
```typescript
interface EarlyPayoffResultProps {
  data: EarlyPayoffResponse
}
```

**Layout tipo "recibo":**
- Card principal con monto total de liquidacion (grande, destacado)
- Desglose: outstanding principal, pro-rata interest, penalty
- Ahorro: interest_saved (verde, con icono de ahorro)
- Detalles: remaining months, monthly payment, total paid so far

---

## 9. Pages (Layouts y Comportamiento)

### 9.1 CardListPage

**Ruta:** `/cards`

**Objetivo:** Dashboard de tarjetas con resumen portfolio + lista de tarjetas.

**Comportamiento:**
1. Cargar `useCardSummary()` y `useCardList()`
2. Mostrar stats bar arriba: Total tarjetas, Limite total, Utilization promedio, Alertas no leidas
3. Cada tarjeta es un `CardCard` que navega a `/cards/:id`
4. Boton "+ Nueva Tarjeta" que navega a `/cards/new`
5. Filtros: activas/inactivas (toggle)
6. Empty state si no hay tarjetas con CTA a crear

**Layout:**
```
[Summary Stats Bar]  [New Card Button]
[CardGrid/Filters]
  CardCard x N
```

### 9.2 CardCreatePage

**Ruta:** `/cards/new`

**Objetivo:** Formulario de creacion de tarjeta.

**Campos del formulario (Zod):**
```typescript
const cardSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  account_id: z.string().uuid('Cuenta requerida'),
  last_four_digits: z.string().max(4).optional().or(z.literal('')),
  card_network: z.enum(['visa', 'mastercard', 'amex']).optional(),
  credit_limit: z.string().optional(),
  available_credit: z.string().optional(),
  statement_day: z.coerce.number().min(1).max(28).optional(),
  payment_due_day: z.coerce.number().min(1).max(28).optional(),
  interest_rate: z.string().optional(),
  color: z.string().optional(),
})
```

**Account Selector:** Usar `useAccountList()` para mostrar cuentas disponibles.

**Comportamiento:**
- On success: toast "Tarjeta creada" + navigate a `/cards/:id`
- On error: toast con mensaje de error + field errors

### 9.3 CardEditPage

**Ruta:** `/cards/:id/edit`

**Objetivo:** Editar tarjeta existente.

**Mismo schema que create pero todos opcionales.**
Cargar datos actuales con `useCard(id)` y pre-rellenar form.

### 9.4 CardDetailPage

**Ruta:** `/cards/:id`

**Objetivo:** Pagina principal de detalle de tarjeta con tabs.

**Tabs:**
1. **Overview** (por defecto)
   - Utilization gauge grande
   - Card info: network, last 4, credit limit, available, statement day, payment due day, interest rate
   - Acciones: Editar, Eliminar, Generar Statement
   - "Proximos vencimientos" si hay bills pendientes
2. **Bills** (facturas)
   - Lista de facturas con `BillCard`
   - Boton "+ Nueva Factura"
3. **Spending Limits**
   - Lista de limites con `SpendingLimitCard`
   - Boton "+ Nuevo Limite"
4. **Utilization History**
   - Line chart de utilization % por mes
   - Selector de meses (3, 6, 12, 24)
5. **Spending by Category**
   - Doughnut/pie chart de gastos por categoria
   - Date range selector
6. **Alerts**
   - Lista de alertas con `CardAlertItem`
   - Boton "Check Now" (generar nuevas alertas)
   - Filtros: tipo, severity, leido/no leido

**Layout:**
```
[Header: name + network badge + status]
[Actions Bar: Editar | Eliminar | Generar Statement | Pagar Factura]
[Tabs: Overview | Bills | Limits | History | Category | Alerts]
[Tab Content]
```

### 9.5 CardBillListPage

**Ruta:** `/cards/:cardId/bills`

**Objetivo:** Lista de facturas de una tarjeta especifica.

**Comportamiento:**
- Cargar `useBillList(cardId)`
- Cada factura es un `BillCard`
- Boton "+ Nueva Factura" -> Modal/form inline
- Ordenar por statement_date descendente
- Badge de vencimiento: si due_date < hoy -> "Vencida"

### 9.6 CardBillPayPage

**Ruta:** `/cards/:cardId/bills/:billId/pay`

**Objetivo:** Pagar una factura especifica.

**Comportamiento:**
- Cargar bill detail de la lista (o re-fetch)
- Mostrar resumen: total, minimum payment, due date
- `PaymentForm` con `maxAmount = total_amount`
- On success: toast "Pago registrado" + navigate back
- Boton de pago rapido: "Pagar minimo" que setea amount = minimum_payment

### 9.7 CardSpendingLimitsPage

**Ruta:** `/cards/:cardId/limits`

**Objetivo:** Gestion de limites de gasto.

**Comportamiento:**
- Cargar `useSpendingLimitList(cardId)`
- Mostrar grilla de `SpendingLimitCard`
- Modal para crear/editar limite
- Boton "+ Nuevo Limite"

**Modal create:**
- limit_type: selector (daily/weekly/monthly/category)
- limit_amount: input
- category_id: category selector (solo si limit_type = category)
- alert_threshold: slider 1-100
- alert_enabled: toggle

### 9.8 CardAlertsPage

**Ruta:** `/cards/alerts`

**Objetivo:** Centro de alertas de todas las tarjetas.

**Comportamiento:**
- Cargar `useCardAlerts(filters)`
- Filtros: credit_card_id, is_read, alert_type, severity
- Boton "Check Now" -> `useCheckAlerts()`
- Boton "Mark All Read" -> `useMarkAlertRead({ mark_all: true })`
- Lista de `CardAlertItem`

### 9.9 LoanListPage

**Ruta:** `/loans`

**Objetivo:** Dashboard de prestamos con resumen portfolio + lista.

**Comportamiento:**
1. Cargar `useLoanSummary()` y `useLoanList()`
2. Stats bar: Total prestamos, Balance total, Pago mensual total, Proximos vencimientos
3. `LoanSummaryCards` con desglose por tipo y status
4. Lista de `LoanCard` que navega a `/loans/:id`
5. Filtros: status, loan_type
6. Boton "+ Nuevo Prestamo" -> `/loans/new`
7. Boton "Simulador" -> `/loans/simulator`

### 9.10 LoanCreatePage

**Ruta:** `/loans/new`

**Objetivo:** Formulario de creacion de prestamo.

**Campos (Zod):**
```typescript
const loanSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(150),
  principal_amount: z.coerce.number().positive('Monto debe ser > 0'),
  annual_interest_rate: z.coerce.number().min(0, 'Tasa no negativa'),
  term_months: z.coerce.number().int().min(1).max(600),
  loan_type: z.string().default('personal'),
  interest_type: z.string().default('fixed'),
  payment_frequency: z.string().default('monthly'),
  account_id: z.string().uuid().optional().or(z.literal('')),
  lender_name: z.string().max(200).optional().or(z.literal('')),
  account_number: z.string().max(100).optional().or(z.literal('')),
  disbursement_date: z.string().optional().or(z.literal('')),
  grace_period_days: z.coerce.number().min(0).default(0),
  early_payoff_allowed: z.boolean().default(true),
  early_payoff_penalty_pct: z.coerce.number().min(0).optional(),
  penalty_rate_monthly: z.coerce.number().min(0).optional(),
  notes: z.string().max(1000).optional().or(z.literal('')),
})
```

**Comportamiento:**
- On success: toast + navigate a `/loans/:id`
- Los campos `loan_type`, `interest_type`, `payment_frequency` son selectores con opciones de los enums
- Mostrar estimacion de pago mensual despues de llenar principal, rate, term (se puede calcular frontend con formula francesa `M = P * [r(1+r)^n] / [(1+r)^n - 1]`)

### 9.11 LoanDetailPage

**Ruta:** `/loans/:id`

**Objetivo:** Pagina principal de detalle de prestamo con tabs.

**Tabs:**
1. **Overview** (por defecto)
   - Loan info: name, type, lender, account #
   - Financial summary: principal, balance, rate, monthly payment, progress pct
   - Progress bar grande
   - Payments summary: total paid, interest paid, payment count
   - Upcoming payment destacado
   - Actions: Editar, Cambiar Status, Eliminar
2. **Amortization**
   - `AmortizationChart` + `AmortizationTable`
   - Boton "Ver todo" / scroll infinito para tabla
3. **Payments**
   - `PaymentCard` list (link a historial completo)
   - Boton "Hacer Pago" -> `/loans/:id/pay`
4. **Early Payoff**
   - `EarlyPayoffResult` (cargado automaticamente)
   - Input de fecha opcional
   - Boton "Procesar Liquidacion" (redirect a make payment con monto calculado)

**Layout:**
```
[Header: name + type badge + status badge]
[Actions Bar: Editar | Cambiar Status | Hacer Pago | Liquidar]
[Tabs: Overview | Amortization | Payments | Early Payoff]
[Tab Content]
```

### 9.12 LoanAmortizationPage

**Ruta:** `/loans/:id/amortization`

**Objetivo:** Vista detallada de la tabla de amortizacion + grafico.

**Comportamiento:**
- Cargar `useAmortizationSchedule(loanId)`
- `AmortizationChart` arriba (primeros 24 meses o full)
- `AmortizationTable` abajo con scroll
- Toggle "Solo pagados"
- Summary: total entries, entries paid, remaining, progress pct

### 9.13 LoanPaymentPage

**Ruta:** `/loans/:id/pay`

**Objetivo:** Hacer un pago al prestamo.

**Comportamiento:**
- Cargar `useLoan(loanId)` para obtener current_balance
- `PaymentForm` con `maxAmount = current_balance`
- Mostrar warning: "El pago debe exceder el interes mensual para reducir capital"
- Mostrar interes mensual estimado (current_balance * monthly_rate)
- On success: toast + navigate to `/loans/:id`

### 9.14 LoanPaymentHistoryPage

**Ruta:** `/loans/:id/payments`

**Objetivo:** Historial completo de pagos.

**Comportamiento:**
- Cargar `usePaymentList(loanId)` con paginacion
- Tabla/responsive card list de pagos
- Summary arriba: total paid, total interest, total principal, total penalties, count
- Columnas: fecha, monto, principal, interest, method, is_extra, status

### 9.15 LoanEarlyPayoffPage

**Ruta:** `/loans/:id/early-payoff`

**Objetivo:** Calcular y mostrar liquidacion anticipada.

**Comportamiento:**
- Cargar `useEarlyPayoff(loanId, payoffDate)`
- Input de fecha opcional (default hoy)
- `EarlyPayoffResult` con desglose
- Boton "Pagar $X" (navega a `/loans/:id/pay` con monto pre-cargado)

### 9.16 NewLoanSimulatorPage

**Ruta:** `/loans/simulator`

**Objetivo:** Simular un prestamo antes de crearlo (stateless).

**Comportamiento:**
- `LoanSimulatorForm` a la izquierda
- `SimulateLoanResponse` a la derecha:
  - Monthly payment (grande)
  - Total interest + total cost
  - Interest to principal ratio
  - Early payoff months (si hay extra payment)
  - Interest saved with extra
  - Schedule preview (primeros 12 meses)
- Boton "Crear Prestamo con estos datos" -> navigate a `/loans/new` con datos pre-cargados (via query params o store)
- Chart de barras principal vs interest (reutilizar `AmortizationChart` con datos de `schedule_preview`)

---

## 10. Actualizacion de Routing

### En `src/routes/lazy.ts`

Agregar lazy imports:

```typescript
// Cards
export const CardListPage = lazy(() => import('@/features/cards/pages/CardListPage'))
export const CardCreatePage = lazy(() => import('@/features/cards/pages/CardCreatePage'))
export const CardEditPage = lazy(() => import('@/features/cards/pages/CardEditPage'))
export const CardDetailPage = lazy(() => import('@/features/cards/pages/CardDetailPage'))
export const CardBillListPage = lazy(() => import('@/features/cards/pages/CardBillListPage'))
export const CardBillPayPage = lazy(() => import('@/features/cards/pages/CardBillPayPage'))
export const CardSpendingLimitsPage = lazy(() => import('@/features/cards/pages/CardSpendingLimitsPage'))
export const CardAlertsPage = lazy(() => import('@/features/cards/pages/CardAlertsPage'))

// Loans
export const LoanListPage = lazy(() => import('@/features/loans/pages/LoanListPage'))
export const LoanCreatePage = lazy(() => import('@/features/loans/pages/LoanCreatePage'))
export const LoanEditPage = lazy(() => import('@/features/loans/pages/LoanEditPage'))
export const LoanDetailPage = lazy(() => import('@/features/loans/pages/LoanDetailPage'))
export const LoanAmortizationPage = lazy(() => import('@/features/loans/pages/LoanAmortizationPage'))
export const LoanPaymentPage = lazy(() => import('@/features/loans/pages/LoanPaymentPage'))
export const LoanPaymentHistoryPage = lazy(() => import('@/features/loans/pages/LoanPaymentHistoryPage'))
export const LoanEarlyPayoffPage = lazy(() => import('@/features/loans/pages/LoanEarlyPayoffPage'))
export const NewLoanSimulatorPage = lazy(() => import('@/features/loans/pages/NewLoanSimulatorPage'))
```

### En `src/routes/index.tsx`

Reemplazar los `PlaceholderPage` de cards/loans con los componentes reales:

```typescript
// Cards
{
  path: '/cards',
  element: (<SuspenseWrapper><CardListPage /></SuspenseWrapper>),
},
{
  path: '/cards/new',
  element: (<SuspenseWrapper><CardCreatePage /></SuspenseWrapper>),
},
{
  path: '/cards/:id',
  element: (<SuspenseWrapper><CardDetailPage /></SuspenseWrapper>),
},
{
  path: '/cards/:id/edit',
  element: (<SuspenseWrapper><CardEditPage /></SuspenseWrapper>),
},
{
  path: '/cards/:id/bills',
  element: (<SuspenseWrapper><CardBillListPage /></SuspenseWrapper>),
},
{
  path: '/cards/:id/bills/:billId/pay',
  element: (<SuspenseWrapper><CardBillPayPage /></SuspenseWrapper>),
},
{
  path: '/cards/:id/limits',
  element: (<SuspenseWrapper><CardSpendingLimitsPage /></SuspenseWrapper>),
},
{
  path: '/cards/alerts',
  element: (<SuspenseWrapper><CardAlertsPage /></SuspenseWrapper>),
},

// Loans
{
  path: '/loans',
  element: (<SuspenseWrapper><LoanListPage /></SuspenseWrapper>),
},
{
  path: '/loans/new',
  element: (<SuspenseWrapper><LoanCreatePage /></SuspenseWrapper>),
},
{
  path: '/loans/:id',
  element: (<SuspenseWrapper><LoanDetailPage /></SuspenseWrapper>),
},
{
  path: '/loans/:id/edit',
  element: (<SuspenseWrapper><LoanEditPage /></SuspenseWrapper>),
},
{
  path: '/loans/:id/amortization',
  element: (<SuspenseWrapper><LoanAmortizationPage /></SuspenseWrapper>),
},
{
  path: '/loans/:id/pay',
  element: (<SuspenseWrapper><LoanPaymentPage /></SuspenseWrapper>),
},
{
  path: '/loans/:id/payments',
  element: (<SuspenseWrapper><LoanPaymentHistoryPage /></SuspenseWrapper>),
},
{
  path: '/loans/:id/early-payoff',
  element: (<SuspenseWrapper><LoanEarlyPayoffPage /></SuspenseWrapper>),
},
{
  path: '/loans/simulator',
  element: (<SuspenseWrapper><NewLoanSimulatorPage /></SuspenseWrapper>),
},
```

---

## 11. Actualizacion de Sidebar

En el componente de sidebar (probablemente `src/components/layout/Sidebar.tsx` o similar), agregar entradas de navegacion para Cards y Loans si no existen ya.

Buscar seccion "Finanzas" o crear una nueva seccion:

```typescript
// En la seccion de navegacion, agregar:
{
  label: 'Tarjetas de Credito',
  path: '/cards',
  icon: CreditCard,
  badge: summary?.unread_alerts,  // desde useCardSummary
},
{
  label: 'Prestamos',
  path: '/loans',
  icon: Landmark,
  badge: summary?.total_loans,    // desde useLoanSummary
},
```

Si el sidebar esta en un archivo separado, localizarlo y seguir el patron existente de iconos + labels.

---

## 12. Estrategias y Mejores Practicas

### Patrones Clave

1. **Query Key Convention:** Usar arrays jerarquicos para facilitar invalidacion.
2. **Error Handling:** Usar `react-hot-toast` para errores de mutation y `ErrorBoundary` para errores de render.
3. **Responsive Design:** Card layout en mobile (< md), tabla/layout horizontal en desktop.
4. **Loading States:** Skeletons que coinciden con la forma final del contenido.
5. **Empty States:** Ilustracion + mensaje + CTA para crear primer elemento.

### Orden de Implementacion Sugerido

1. **Types** (`src/types/cards.ts`, `src/types/loans.ts`) — base de todo
2. **API clients** (5 archivos api/) — sin dependencias de UI
3. **Hooks** (8 archivos hooks/) — dependen solo de api/
4. **Constants** (2 archivos constants.ts)
5. **Shared Components** (componentes UI reutilizables):
   - UtilizationGauge, CardNetworkBadge, CardStatusBadge, BillStatusBadge
   - LoanTypeBadge, LoanStatusBadge
   - CardCard, BillCard, SpendingLimitCard, CardAlertItem, LoanCard
   - AmortizationTable, AmortizationChart
   - PaymentForm, LoanSimulatorForm, EarlyPayoffResult
6. **Pages** (16 paginas):
   - Cards: CardListPage -> CardCreatePage -> CardDetailPage (con tabs) -> CardBillListPage -> CardBillPayPage -> CardSpendingLimitsPage -> CardAlertsPage -> CardEditPage
   - Loans: LoanListPage -> LoanCreatePage -> LoanDetailPage (con tabs) -> LoanAmortizationPage -> LoanPaymentPage -> LoanPaymentHistoryPage -> LoanEarlyPayoffPage -> NewLoanSimulatorPage -> LoanEditPage
7. **Routing** — actualizar lazy.ts e index.tsx
8. **Sidebar** — agregar entradas de navegacion

### CardDetailPage Tabs Strategy

Para los tabs del detalle de tarjeta, usar search params para persistir el tab activo:

```typescript
const [searchParams, setSearchParams] = useSearchParams()
const activeTab = searchParams.get('tab') || 'overview'

const setTab = (tab: string) => {
  setSearchParams({ tab })
}
```

Tabs del CardDetailPage: `overview`, `bills`, `limits`, `history`, `spending`, `alerts`

### LoanDetailPage Tabs Strategy

Tabs del LoanDetailPage: `overview`, `amortization`, `payments`, `early-payoff`

### Gauge Chart Implementation

Usar SVG nativo para el gauge de utilization:

```typescript
function UtilizationGauge({ percentage, size = 200, status }: UtilizationGaugeProps) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const filledLength = (percentage / 100) * circumference

  const color = {
    healthy: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
  }[status]

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth="12"
          transform="rotate(-90 100 100)"
        />
        {/* Filled arc */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${filledLength} ${circumference - filledLength}`}
          transform="rotate(-90 100 100)"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {percentage.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">Utilizado</span>
      </div>
    </div>
  )
}
```

### Amortization Chart Implementation

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function AmortizationChart({ entries }: AmortizationChartProps) {
  const data = entries.map(e => ({
    month: `#${e.entry_number}`,
    Principal: e.principal_portion,
    Interes: e.interest_portion,
    Balance: e.balance_after,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="month" fontSize={11} />
        <YAxis fontSize={11} tickFormatter={(v) => `$${v.toLocaleString()}`} />
        <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="Interes" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Principal" fill="#22c55e" stackId="a" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

### Currency Formatting

Usar siempre `formatCurrency` de `lib/utils.ts`. Para valores numericos (loans API devuelve numbers):

```typescript
formatCurrency(loan.monthly_payment, currency_code)
```

Para valores string (cards API devuelve strings):

```typescript
formatCurrency(parseFloat(card.credit_limit || '0'), currency_code)
```

### Payment Flow Patterns

**Card Bill Payment:**
1. Cargar bill detail
2. Mostrar: total, minimum payment, due date
3. Input: amount (default = minimum)
4. Select: payment method
5. Submit -> POST `/cards/{cardId}/bills/{billId}/pay`
6. Success: toast + redirect to bills list

**Loan Payment:**
1. Cargar loan detail (current_balance)
2. Mostrar: current balance, monthly payment, next payment date
3. Input: amount
4. Select: payment method
5. Checkbox: is extra payment
6. Input: reference number, notes (opcional)
7. Submit -> POST `/loans/{loanId}/payments`
8. Success: toast + redirect to loan detail

### Early Payoff Flow

1. GET `/loans/{loanId}/early-payoff` (carga automatica en la pagina)
2. Mostrar desglose completo
3. Boton "Pagar Ahora" abre modal/make payment form con `amount = total_payoff_amount`
4. Submit payment -> POST `/loans/{loanId}/payments`
5. Success: toast + loan detail actualizado

### New Loan Simulator Flow

1. Formulario con sliders/inputs para principal, rate, term, extra payment
2. Calcular en frontend (opcional) o hacer POST `/loans/simulate` al cambiar inputs (debounced)
3. Mostrar resultados inline: monthly payment grande, total interest, total cost
4. Bar chart de schedule preview (primeros 12 meses)
5. Boton "Crear Prestamo" -> navega a `/loans/new` con datos pre-cargados via `useSearchParams` o state

---

## 13. Verificacion Final

Antes de dar por completada la fase, ejecutar:

```bash
# TypeScript type checking
npx tsc --noEmit

# Linter
pnpm lint

# Build production
pnpm build

# (Opcional) Tests
pnpm test
```

### Checklist de Verificacion

**Cards:**
- [ ] CardListPage: muestra resumen + lista de tarjetas con utilization mini-gauges
- [ ] CardCreatePage: formulario completo con validacion Zod, account selector
- [ ] CardEditPage: pre-carga datos existentes, partial update
- [ ] CardDetailPage: 6 tabs funcionales (overview, bills, limits, history, spending, alerts)
- [ ] CardBillListPage: lista de facturas con status badges
- [ ] CardBillPayPage: payment form con monto minimo y metodo
- [ ] CardSpendingLimitsPage: CRUD completo de limites con progress bars
- [ ] CardAlertsPage: filtros, mark read, dismiss, check now
- [ ] Utilization gauge SVG funcional con colores healthy/warning/danger
- [ ] Network badges con colores corporativos
- [ ] Bill status badges con colores correctos
- [ ] Spending limit cards con progress indicators
- [ ] Generate statement funcional
- [ ] Responsive: cards en mobile, layout completo en desktop
- [ ] Empty states para cada lista
- [ ] Loading skeletons en todas las pages
- [ ] Error handling con toasts y error boundaries

**Loans:**
- [ ] LoanListPage: summary bar + loans list con progress bars
- [ ] LoanCreatePage: formulario completo con selectores de tipo, interes, frecuencia
- [ ] LoanEditPage: pre-carga datos, partial update
- [ ] LoanDetailPage: 4 tabs funcionales (overview, amortization, payments, early-payoff)
- [ ] LoanAmortizationPage: tabla completa + stacked bar chart
- [ ] LoanPaymentPage: payment form con validacion de monto
- [ ] LoanPaymentHistoryPage: historial paginado con summary
- [ ] LoanEarlyPayoffPage: resultado con desglose + boton de pago
- [ ] NewLoanSimulatorPage: formulario + schedule preview + chart
- [ ] Loan type badges con iconos y colores
- [ ] Loan status badges con colores correctos
- [ ] Amortization chart funcional (principal vs interest apilados)
- [ ] Amortization table con scroll y formateo
- [ ] Status transitions validas (pending->active, active->paid_off, etc.)
- [ ] Responsive: cards en mobile, layout completo en desktop
- [ ] Empty states para cada lista
- [ ] Loading skeletons en todas las pages
- [ ] Error handling con toasts y error boundaries

**Routing:**
- [ ] Todas las rutas agregadas a `lazy.ts` con React.lazy
- [ ] Todas las rutas agregadas a `index.tsx` con SuspenseWrapper
- [ ] Sidebar actualizado con enlaces a /cards y /loans
- [ ] PlaceholderPages reemplazadas por componentes reales

**General:**
- [ ] `npx tsc --noEmit` sin errores
- [ ] `pnpm lint` sin errores
- [ ] `pnpm build` exitoso
- [ ] Sin console.logs de debug en produccion
- [ ] Todos los textos en espanol (segun locale del proyecto)
- [ ] Toasts en espanol
- [ ] Formatos de moneda con simbolo $ y separadores de miles
