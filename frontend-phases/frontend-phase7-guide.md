# Phase 7: Expenses — Full Implementation Guide

## Overview

This phase implements the complete Expenses module: CRUD, templates, services, subscriptions, credit cards, bills, dashboard, patterns, duplicates, recurring detection, and priority badges. The backend exposes ~58 endpoints across `/expenses`, `/cards`, `/transactions/recurring`, and `/automations/templates`.

---

## Architecture Decisions

### 1. Feature Structure (follow `features/expenses/`)

```
src/features/expenses/
  api/
    expenses.ts          # CRUD + bulk + split + dashboard + patterns + duplicates + recurring-candidates
    templates.ts         # Template CRUD + create-from-template
    services.ts          # Service CRUD + upcoming + pay
    subscriptions.ts     # Subscription CRUD + summary
    creditCards.ts       # Card CRUD + utilization + bills
  hooks/
    useExpenses.ts       # Query + mutation hooks for expenses
    useTemplates.ts      # Template hooks
    useServices.ts       # Service hooks
    useSubscriptions.ts  # Subscription hooks
    useCreditCards.ts    # Credit card + bill hooks
  components/
    # Expense components
    ExpenseNav.tsx           # Sub-navigation bar
    ExpenseCard.tsx          # List item card with priority badge
    ExpenseTable.tsx         # Desktop table view
    ExpenseForm.tsx          # Create/edit form
    ExpenseFilters.tsx       # Filter bar
    ExpenseSummaryWidget.tsx # Summary KPI strip
    EmptyExpenseState.tsx    # Empty state
    SplitExpenseCreator.tsx  # Multi-line split form
    PriorityBadge.tsx        # low/normal/high/critical
    # Template components
    TemplateCard.tsx
    TemplateForm.tsx
    # Service components
    ServiceCard.tsx
    ServiceForm.tsx
    # Subscription components
    SubscriptionCard.tsx
    SubscriptionSummary.tsx
    # Credit Card components
    CreditCardCard.tsx
    CreditCardForm.tsx
    UtilizationGauge.tsx
    CardBillList.tsx
    CardBillCard.tsx
    PayBillModal.tsx
    SpendingLimitForm.tsx
    # Dashboard components
    DailyTrendChart.tsx
    CategoryBreakdownChart.tsx
    SpendingPatternChart.tsx
    DuplicateCard.tsx
    RecurringCandidateCard.tsx
    # Shared
    EmptyState.tsx       # Generic empty state with illustration
  pages/
    ExpenseListPage.tsx
    ExpenseCreatePage.tsx
    ExpenseDetailPage.tsx
    ExpenseEditPage.tsx
    ExpenseDashboardPage.tsx
    TemplatesPage.tsx
    TemplatesCreatePage.tsx
    ServicesPage.tsx
    ServicesCreatePage.tsx
    SubscriptionsPage.tsx
    SubscriptionsCreatePage.tsx
    CreditCardsPage.tsx
    CreditCardsCreatePage.tsx
    CreditCardsDetailPage.tsx
    CardBillsPage.tsx
    SplitExpensePage.tsx
    DuplicatesPage.tsx
    RecurringCandidatesPage.tsx
  constants.ts         # Configs, priority colors, service types, etc.
```

### 2. Naming Conventions

- Enums: `PRIORITY_LEVELS`, `SERVICE_TYPES`, `BILLING_FREQUENCIES`, `CARD_NETWORKS`, `PAYMENT_STATUS`
- Query keys: `['expenses', filters]`, `['templates']`, `['services', filters]`, `['subscriptions', filters]`, `['credit-cards', id]`, `['card-bills', cardId]`
- Mutation prefix: `useCreate`, `useUpdate`, `useDelete`, `usePay`, `useMarkPaid`

### 3. Routing

```tsx
// In src/routes/index.tsx
// Under the /expenses path group:
<Route path="expenses" element={<ExpenseListPage />} />
<Route path="expenses/new" element={<ExpenseCreatePage />} />
<Route path="expenses/split" element={<SplitExpensePage />} />
<Route path="expenses/dashboard" element={<ExpenseDashboardPage />} />
<Route path="expenses/templates" element={<TemplatesPage />} />
<Route path="expenses/templates/new" element={<TemplatesCreatePage />} />
<Route path="expenses/services" element={<ServicesPage />} />
<Route path="expenses/services/new" element={<ServicesCreatePage />} />
<Route path="expenses/subscriptions" element={<SubscriptionsPage />} />
<Route path="expenses/subscriptions/new" element={<SubscriptionsCreatePage />} />
<Route path="expenses/credit-cards" element={<CreditCardsPage />} />
<Route path="expenses/credit-cards/new" element={<CreditCardsCreatePage />} />
<Route path="expenses/credit-cards/:id" element={<CreditCardsDetailPage />} />
<Route path="expenses/credit-cards/:id/bills" element={<CardBillsPage />} />
<Route path="expenses/duplicates" element={<DuplicatesPage />} />
<Route path="expenses/recurring-candidates" element={<RecurringCandidatesPage />} />
<Route path="expenses/:id" element={<ExpenseDetailPage />} />
<Route path="expenses/:id/edit" element={<ExpenseEditPage />} />
```

### 4. TypeScript Types

Create `src/types/expenses.ts` with interfaces matching the backend schemas exactly:

```typescript
// ======================================================================
// Expense Core
// ======================================================================

export type Priority = 'low' | 'normal' | 'high' | 'critical'
export type ServiceType = 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'cable' | 'other'
export type BillingFrequency = 'monthly' | 'quarterly' | 'bimonthly' | 'yearly'
export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial' | 'expired'
export type UtilizationStatus = 'healthy' | 'warning' | 'danger'
export type LimitType = 'daily' | 'weekly' | 'monthly' | 'category'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type CardAlertType = 'high_utilization' | 'limit_approaching' | 'due_date_approaching' | 'payment_overdue'

export interface CreateExpenseRequest {
  account_id: string
  amount: string
  currency_code?: string
  description: string
  effective_date: string
  category_id?: string | null
  subcategory_id?: string | null
  status?: string
  notes?: string | null
  source?: string
  tags?: string[] | null
  priority?: Priority
  template_id?: string | null
  service_id?: string | null
  subscription_id?: string | null
  credit_card_id?: string | null
}

export interface ExpenseResponse {
  id: string
  account_id: string
  category_id: string | null
  subcategory_id: string | null
  transaction_type: string
  status: string
  amount: string
  currency_code: string
  description: string
  notes: string | null
  effective_date: string | null
  source: string
  tags: string[]
  priority: Priority
  service_id: string | null
  subscription_id: string | null
  credit_card_id: string | null
  created_at: string | null
}

export interface ListExpensesResponse {
  expenses: ExpenseResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ExpenseFilters {
  status?: string
  category_id?: string
  subcategory_id?: string
  account_id?: string
  tag?: string
  min_amount?: number
  max_amount?: number
  date_from?: string
  date_to?: string
  source?: string
  search?: string
  sort_by?: string
  sort_order?: string
  page?: number
  page_size?: number
}

// ======================================================================
// Split Expense
// ======================================================================

export interface SplitItem {
  amount: string
  description: string
  account_id?: string | null
}

export interface CreateSplitExpenseRequest {
  account_id: string
  total_amount: string
  currency_code?: string
  description: string
  effective_date: string
  notes?: string | null
  tags?: string[] | null
  splits: SplitItem[]
}

// ======================================================================
// Expense Dashboard
// ======================================================================

export interface ExpenseDashboardResponse {
  period_start: string
  period_end: string
  total_expenses: string
  total_count: number
  daily_average: string
  monthly_subscriptions: string
  by_category: Array<{ category: string; total: string; count: number; percentage: string }>
  daily_trend: Array<{ date: string; total: string; count: number }>
}

// ======================================================================
// Spending Patterns
// ======================================================================

export interface SpendingPatternsResponse {
  top_categories: Array<{ category: string; total: string; count: number; percentage: string }>
  monthly_data: Array<{ month: string; total: string; count: number }>
  average_monthly_expense: string
  period: string
}

// ======================================================================
// Duplicates & Recurring
// ======================================================================

export interface DuplicatesResponse {
  duplicates: Array<{ id: string; description: string; amount: string; effective_date: string; count: number }>
  total: number
}

export interface RecurringCandidatesResponse {
  candidates: Array<{ id: string; description: string; amount: string; occurrences: number; avg_frequency_days: number; is_monthly_like: boolean }>
  total: number
}

// ======================================================================
// Expense Templates
// ======================================================================

export interface CreateTemplateRequest {
  name: string
  description: string
  default_amount?: string | null
  default_currency?: string
  default_account_id?: string | null
  default_category_id?: string | null
  default_subcategory_id?: string | null
  default_notes?: string | null
  default_frequency?: string | null
  icon?: string | null
  color?: string | null
  sort_order?: number
}

export interface TemplateResponse {
  id: string
  name: string
  description: string
  default_amount: string | null
  default_currency: string
  default_category_id: string | null
  default_subcategory_id: string | null
  default_notes: string | null
  default_frequency: string | null
  usage_count: number
  last_used_at: string | null
  icon: string | null
  color: string | null
  created_at: string | null
}

export interface CreateFromTemplateRequest {
  account_id?: string | null
  amount?: string | null
  effective_date: string
  notes?: string | null
  tags?: string[] | null
}

// ======================================================================
// Services
// ======================================================================

export interface CreateServiceRequest {
  name: string
  provider?: string | null
  service_type: ServiceType
  frequency?: string
  estimated_amount?: string | null
  account_number?: string | null
  billing_day?: number | null
  due_day?: number | null
  category_id?: string | null
  auto_create_expense?: boolean
  icon?: string | null
  color?: string | null
  notes?: string | null
}

export interface ServiceResponse {
  id: string
  name: string
  provider: string | null
  service_type: ServiceType
  frequency: string
  estimated_amount: string | null
  account_number: string | null
  billing_day: number | null
  due_day: number | null
  category_id: string | null
  last_paid_at: string | null
  last_paid_amount: string | null
  payment_status: string
  is_active: boolean
  auto_create_expense: boolean
  icon: string | null
  color: string | null
  notes: string | null
  created_at: string | null
}

export interface MarkServicePaidRequest {
  amount?: string | null
  paid_date?: string | null
  notes?: string | null
}

// ======================================================================
// Subscriptions
// ======================================================================

export interface CreateSubscriptionRequest {
  name: string
  description?: string | null
  provider?: string | null
  amount: string
  currency_code?: string
  billing_frequency: BillingFrequency
  account_id?: string | null
  category_id?: string | null
  start_date: string
  end_date?: string | null
  next_billing_date?: string | null
  website_url?: string | null
  logo_url?: string | null
  icon?: string | null
  color?: string | null
}

export interface SubscriptionResponse {
  id: string
  name: string
  description: string | null
  provider: string | null
  amount: string
  currency_code: string
  billing_frequency: BillingFrequency
  status: SubscriptionStatus
  start_date: string
  end_date: string | null
  next_billing_date: string | null
  cancelled_date: string | null
  cancellation_reason: string | null
  annual_cost: string | null
  auto_detected: boolean
  website_url: string | null
  logo_url: string | null
  created_at: string | null
}

export interface SubscriptionSummaryResponse {
  active_count: number
  monthly_total: string
  annual_total: string
  cost_per_day: string
  subscriptions: SubscriptionResponse[]
  recommendations: string[]
}

// ======================================================================
// Credit Cards
// ======================================================================

export interface CreateCreditCardRequest {
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

export interface CreditCardResponse {
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

export interface CardUtilizationResponse {
  credit_limit: string
  available_credit: string
  used_credit: string
  utilization_percentage: string
  status: UtilizationStatus
}

export interface UpdateCardRequest {
  name?: string
  last_four_digits?: string | null
  card_network?: string | null
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

// ======================================================================
// Card Bills
// ======================================================================

export interface CreateCardBillRequest {
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_due_day?: number | null
  notes?: string | null
}

export interface CardBillResponse {
  id: string
  credit_card_id: string
  statement_date: string
  due_date: string
  total_amount: string
  minimum_payment: string | null
  interest_charged: string | null
  payment_status: PaymentStatus
  amount_paid: string
  paid_at: string | null
  transaction_count: number
  notes: string | null
  created_at: string | null
}

export interface PayBillRequest {
  amount: number
  payment_method?: string
}

export interface UpdateBillRequest {
  total_amount?: string
  minimum_payment?: string | null
  interest_charged?: string | null
  payment_status?: PaymentStatus
  notes?: string | null
}

// ======================================================================
// Card Spending Limits
// ======================================================================

export interface CreateSpendingLimitRequest {
  limit_type: LimitType
  limit_amount: string
  category_id?: string | null
  alert_threshold?: number
  alert_enabled?: boolean
  description?: string | null
}

export interface SpendingLimitResponse {
  id: string
  limit_type: LimitType
  limit_amount: string
  spent_amount: string
  category_id: string | null
  alert_threshold: number
  alert_enabled: boolean
  description: string | null
  is_active: boolean
  created_at: string | null
}

// ======================================================================
// Card Alerts
// ======================================================================

export interface CardAlertResponse {
  id: string
  credit_card_id: string
  credit_card_bill_id: string | null
  alert_type: CardAlertType
  severity: AlertSeverity
  title: string
  message: string
  threshold_percentage: number | null
  current_amount: string | null
  limit_amount: string | null
  is_read: boolean
  is_dismissed: boolean
  triggered_at: string
}

// ======================================================================
// Recurring (reused from transactions)
// ======================================================================

export interface CreateRecurringRequest {
  account_id: string
  transaction_type: string
  amount: number
  currency_code?: string
  description: string
  frequency: string
  start_date: string
  interval?: number
  category_id?: string | null
  subcategory_id?: string | null
  notes?: string | null
  end_date?: string | null
  max_executions?: number | null
}

export interface RecurringResponse {
  id: string
  transaction_type: string
  amount: string
  currency_code: string
  description: string
  frequency: string
  interval: number
  start_date: string
  end_date: string | null
  next_execution_date: string
  max_executions: number | null
  execution_count: number
  is_active: boolean
  created_at: string | null
}

export interface ListRecurringResponse {
  recurring: RecurringResponse[]
  total: number
}
```

---

## Constants File

```typescript
// src/features/expenses/constants.ts

import { AlertTriangle, Flame, Flag, Circle } from 'lucide-react'
import type { Priority, ServiceType, BillingFrequency, CardNetwork, PaymentStatus } from '@/types/expenses'

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  low:    { label: 'Baja',    color: 'text-gray-600 dark:text-gray-400',     bgColor: 'bg-gray-100 dark:bg-gray-800',     icon: Circle },
  normal: { label: 'Normal',  color: 'text-blue-600 dark:text-blue-400',    bgColor: 'bg-blue-100 dark:bg-blue-500/10',  icon: Flag },
  high:   { label: 'Alta',    color: 'text-amber-600 dark:text-amber-400',  bgColor: 'bg-amber-100 dark:bg-amber-500/10', icon: AlertTriangle },
  critical: { label: 'Critica', color: 'text-red-600 dark:text-red-400',    bgColor: 'bg-red-100 dark:bg-red-500/10',    icon: Flame },
}

export const SERVICE_TYPE_CONFIG: Record<ServiceType, { label: string; icon: string; color: string }> = {
  electricity: { label: 'Electricidad', icon: 'Zap', color: '#f59e0b' },
  water:       { label: 'Agua',         icon: 'Droplets', color: '#3b82f6' },
  gas:         { label: 'Gas',          icon: 'Flame', color: '#ef4444' },
  internet:    { label: 'Internet',     icon: 'Wifi', color: '#8b5cf6' },
  phone:       { label: 'Telefono',     icon: 'Phone', color: '#10b981' },
  cable:       { label: 'Cable TV',     icon: 'Tv', color: '#ec4899' },
  other:       { label: 'Otro',         icon: 'MoreHorizontal', color: '#6b7280' },
}

export const BILLING_FREQUENCY_LABELS: Record<BillingFrequency, string> = {
  monthly:   'Mensual',
  quarterly: 'Trimestral',
  bimonthly: 'Bimestral',
  yearly:    'Anual',
}

export const CARD_NETWORK_CONFIG: Record<CardNetwork, { label: string; color: string }> = {
  visa:       { label: 'Visa',       color: '#1a1f71' },
  mastercard: { label: 'Mastercard', color: '#eb001b' },
  amex:       { label: 'Amex',       color: '#2e77bc' },
  discover:   { label: 'Discover',   color: '#ff6600' },
  other:      { label: 'Otra',       color: '#6b7280' },
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bgColor: string }> = {
  pending:  { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
  partial:  { label: 'Parcial',   color: 'text-blue-600 dark:text-blue-400',  bgColor: 'bg-blue-100 dark:bg-blue-500/10' },
  paid:     { label: 'Pagado',    color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-500/10' },
  overdue:  { label: 'Vencido',   color: 'text-red-600 dark:text-red-400',    bgColor: 'bg-red-100 dark:bg-red-500/10' },
  waived:   { label: 'Eximido',   color: 'text-gray-600 dark:text-gray-400',  bgColor: 'bg-gray-100 dark:bg-gray-800' },
}

export const CHART_COLORS = {
  expense: '#ef4444',
  income: '#22c55e',
  subscription: '#8b5cf6',
  service: '#f59e0b',
  template: '#3b82f6',
}
```

---

## API Layer

### `src/features/expenses/api/expenses.ts`

```typescript
import api from '@/lib/api'
import type {
  CreateExpenseRequest, ExpenseResponse, ListExpensesResponse,
  ExpenseFilters, CreateSplitExpenseRequest,
  ExpenseDashboardResponse, SpendingPatternsResponse,
  DuplicatesResponse, RecurringCandidatesResponse,
} from '@/types/expenses'

export function createExpense(data: CreateExpenseRequest) {
  return api.post<ExpenseResponse>('/expenses', data)
}

export function createBulkExpenses(data: { expenses: CreateExpenseRequest[] }) {
  return api.post<{ created: number; errors: number }>('/expenses/bulk', data)
}

export function createSplitExpense(data: CreateSplitExpenseRequest) {
  return api.post<ExpenseResponse>('/expenses/split', data)
}

export function listExpenses(params?: ExpenseFilters) {
  return api.get<ListExpensesResponse>('/expenses', { params })
}

export function getExpense(id: string) {
  return api.get<ExpenseResponse>(`/expenses/${id}`)
}

export function updateExpense(id: string, data: Partial<CreateExpenseRequest>) {
  return api.patch<ExpenseResponse>(`/expenses/${id}`, data)
}

export function deleteExpense(id: string) {
  return api.delete<{ message: string }>(`/expenses/${id}`)
}

export function getExpenseDashboard(dateFrom: string, dateTo: string) {
  return api.get<ExpenseDashboardResponse>('/expenses/dashboard', { params: { date_from: dateFrom, date_to: dateTo } })
}

export function getSpendingPatterns() {
  return api.get<SpendingPatternsResponse>('/expenses/patterns')
}

export function getDuplicates(days = 30) {
  return api.get<DuplicatesResponse>('/expenses/duplicates', { params: { days } })
}

export function getRecurringCandidates() {
  return api.get<RecurringCandidatesResponse>('/expenses/recurring-candidates')
}
```

### `src/features/expenses/api/templates.ts`

```typescript
import api from '@/lib/api'
import type { CreateTemplateRequest, TemplateResponse, CreateFromTemplateRequest, ExpenseResponse } from '@/types/expenses'

export function createTemplate(data: CreateTemplateRequest) {
  return api.post<TemplateResponse>('/expenses/templates', data)
}

export function listTemplates() {
  return api.get<{ templates: TemplateResponse[]; total: number }>('/expenses/templates')
}

export function deleteTemplate(id: string) {
  return api.delete<{ message: string }>(`/expenses/templates/${id}`)
}

export function createExpenseFromTemplate(templateId: string, data: CreateFromTemplateRequest) {
  return api.post<ExpenseResponse>(`/expenses/templates/${templateId}/create-expense`, data)
}
```

### `src/features/expenses/api/services.ts`

```typescript
import api from '@/lib/api'
import type { CreateServiceRequest, ServiceResponse, MarkServicePaidRequest } from '@/types/expenses'

export function createService(data: CreateServiceRequest) {
  return api.post<ServiceResponse>('/expenses/services', data)
}

export function listServices(params?: { service_type?: string; is_active?: boolean }) {
  return api.get<{ services: ServiceResponse[]; total: number }>('/expenses/services', { params })
}

export function getUpcomingServices(daysAhead = 30) {
  return api.get<{ services: ServiceResponse[] }>('/expenses/services/upcoming', { params: { days_ahead: daysAhead } })
}

export function updateService(id: string, data: Partial<CreateServiceRequest>) {
  return api.patch<ServiceResponse>(`/expenses/services/${id}`, data)
}

export function deleteService(id: string) {
  return api.delete<{ message: string }>(`/expenses/services/${id}`)
}

export function markServicePaid(id: string, data: MarkServicePaidRequest) {
  return api.post<ServiceResponse>(`/expenses/services/${id}/pay`, data)
}
```

### `src/features/expenses/api/subscriptions.ts`

```typescript
import api from '@/lib/api'
import type { CreateSubscriptionRequest, SubscriptionResponse, SubscriptionSummaryResponse } from '@/types/expenses'

export function createSubscription(data: CreateSubscriptionRequest) {
  return api.post<SubscriptionResponse>('/expenses/subscriptions', data)
}

export function listSubscriptions(params?: { status?: string }) {
  return api.get<{ subscriptions: SubscriptionResponse[]; total: number }>('/expenses/subscriptions', { params })
}

export function updateSubscription(id: string, data: Partial<CreateSubscriptionRequest>) {
  return api.patch<SubscriptionResponse>(`/expenses/subscriptions/${id}`, data)
}

export function deleteSubscription(id: string) {
  return api.delete<{ message: string }>(`/expenses/subscriptions/${id}`)
}

export function getSubscriptionSummary() {
  return api.get<SubscriptionSummaryResponse>('/expenses/subscriptions/summary')
}
```

### `src/features/expenses/api/creditCards.ts`

```typescript
import api from '@/lib/api'
import type {
  CreateCreditCardRequest, CreditCardResponse, CardUtilizationResponse,
  UpdateCardRequest, CreateCardBillRequest, CardBillResponse,
  PayBillRequest, UpdateBillRequest,
  CreateSpendingLimitRequest, SpendingLimitResponse,
  CardAlertResponse,
} from '@/types/expenses'

// Cards
export function createCard(data: CreateCreditCardRequest) {
  return api.post<CreditCardResponse>('/expenses/cards', data)
}

export function listCards() {
  return api.get<{ cards: CreditCardResponse[]; total: number }>('/expenses/cards')
}

export function getCardUtilization(cardId: string) {
  return api.get<CardUtilizationResponse>(`/expenses/cards/${cardId}/utilization`)
}

export function getCardsSummary() {
  return api.get<{ total_cards: number; total_credit_limit: string; total_available: string; total_used: string; overall_utilization: string }>('/cards/summary')
}

export function getCard(id: string) {
  return api.get<CreditCardResponse>(`/cards/${id}`)
}

export function updateCard(id: string, data: UpdateCardRequest) {
  return api.patch<CreditCardResponse>(`/cards/${id}`, data)
}

export function deleteCard(id: string) {
  return api.delete<{ message: string }>(`/cards/${id}`)
}

export function getUtilizationHistory(cardId: string, months = 6) {
  return api.get<{ history: Array<{ month: string; utilization: string }> }>(`/cards/${cardId}/utilization/history`, { params: { months } })
}

// Bills
export function createCardBill(cardId: string, data: CreateCardBillRequest) {
  return api.post<CardBillResponse>(`/expenses/cards/${cardId}/bills`, data)
}

export function listCardBills(cardId: string) {
  return api.get<{ bills: CardBillResponse[]; total: number }>(`/expenses/cards/${cardId}/bills`)
}

export function updateCardBill(cardId: string, billId: string, data: UpdateBillRequest) {
  return api.patch<CardBillResponse>(`/cards/${cardId}/bills/${billId}`, data)
}

export function deleteCardBill(cardId: string, billId: string) {
  return api.delete<{ message: string }>(`/cards/${cardId}/bills/${billId}`)
}

export function payCardBill(cardId: string, billId: string, data: PayBillRequest) {
  return api.post<CardBillResponse>(`/cards/${cardId}/bills/${billId}/pay`, data)
}

// Limits
export function listSpendingLimits(cardId: string) {
  return api.get<{ limits: SpendingLimitResponse[] }>(`/cards/${cardId}/limits`)
}

export function createSpendingLimit(cardId: string, data: CreateSpendingLimitRequest) {
  return api.post<SpendingLimitResponse>(`/cards/${cardId}/limits`, data)
}

export function updateSpendingLimit(cardId: string, limitId: string, data: Partial<CreateSpendingLimitRequest>) {
  return api.patch<SpendingLimitResponse>(`/cards/${cardId}/limits/${limitId}`, data)
}

export function deleteSpendingLimit(cardId: string, limitId: string) {
  return api.delete<{ message: string }>(`/cards/${cardId}/limits/${limitId}`)
}

// Alerts
export function listCardAlerts(params?: { credit_card_id?: string; is_read?: boolean; alert_type?: string; severity?: string }) {
  return api.get<{ alerts: CardAlertResponse[] }>('/cards/alerts/all', { params })
}

export function markAlertRead(alertId?: string, markAll = false) {
  return api.post<{ affected: number }>('/cards/alerts/read', { alert_id: alertId || null, mark_all: markAll })
}

export function dismissAlert(alertId: string) {
  return api.post<{ success: boolean }>(`/cards/alerts/${alertId}/dismiss`)
}

export function checkAlerts() {
  return api.post<{ alerts_created: number; alerts: CardAlertResponse[] }>('/cards/alerts/check')
}
```

### `src/features/expenses/api/recurring.ts`

```typescript
import api from '@/lib/api'
import type { CreateRecurringRequest, RecurringResponse, ListRecurringResponse } from '@/types/expenses'

export function createRecurring(data: CreateRecurringRequest) {
  return api.post<RecurringResponse>('/transactions/recurring', data)
}

export function listRecurring(params?: { is_active?: boolean }) {
  return api.get<ListRecurringResponse>('/transactions/recurring', { params })
}

export function getRecurring(id: string) {
  return api.get<RecurringResponse>(`/transactions/recurring/${id}`)
}

export function updateRecurring(id: string, data: Partial<CreateRecurringRequest>) {
  return api.patch<RecurringResponse>(`/transactions/recurring/${id}`, data)
}

export function deleteRecurring(id: string) {
  return api.delete<{ message: string }>(`/transactions/recurring/${id}`)
}
```

---

## Hooks

### `src/features/expenses/hooks/useExpenses.ts`

```typescript
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as expensesApi from '../api/expenses'
import type { CreateExpenseRequest, ExpenseFilters, CreateSplitExpenseRequest } from '@/types/expenses'

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...expenseKeys.lists(), filters] as const,
  infinite: (filters?: Record<string, unknown>) => [...expenseKeys.all, 'infinite', filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  dashboard: (dateFrom: string, dateTo: string) => [...expenseKeys.all, 'dashboard', dateFrom, dateTo] as const,
  patterns: () => [...expenseKeys.all, 'patterns'] as const,
  duplicates: () => [...expenseKeys.all, 'duplicates'] as const,
  recurringCandidates: () => [...expenseKeys.all, 'recurring-candidates'] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useExpenses(params?: ExpenseFilters) {
  return useQuery({
    queryKey: expenseKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => expensesApi.listExpenses(cleanParams(params as Record<string, unknown>)).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useExpenseInfinite(filters?: Omit<ExpenseFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: expenseKeys.infinite(cleanParams(filters as Record<string, unknown>)),
    queryFn: ({ pageParam = 1 }) =>
      expensesApi.listExpenses({ ...cleanParams(filters as Record<string, unknown>), page: pageParam as number, page_size: 20 }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
  })
}

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: expenseKeys.detail(id!),
    queryFn: () => expensesApi.getExpense(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto creado exitosamente')
    },
    onError: () => toast.error('Error al crear el gasto'),
  })
}

export function useCreateSplitExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSplitExpenseRequest) => expensesApi.createSplitExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto dividido creado exitosamente')
    },
    onError: () => toast.error('Error al crear el gasto dividido'),
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExpenseRequest> }) =>
      expensesApi.updateExpense(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto actualizado exitosamente')
    },
    onError: () => toast.error('Error al actualizar el gasto'),
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el gasto'),
  })
}

export function useExpenseDashboard(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: expenseKeys.dashboard(dateFrom, dateTo),
    queryFn: () => expensesApi.getExpenseDashboard(dateFrom, dateTo).then((r) => r.data),
    enabled: !!dateFrom && !!dateTo,
    staleTime: 1000 * 60 * 2,
  })
}

export function useSpendingPatterns() {
  return useQuery({
    queryKey: expenseKeys.patterns(),
    queryFn: () => expensesApi.getSpendingPatterns().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDuplicates(days = 30) {
  return useQuery({
    queryKey: [...expenseKeys.all, 'duplicates', days],
    queryFn: () => expensesApi.getDuplicates(days).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useRecurringCandidates() {
  return useQuery({
    queryKey: expenseKeys.recurringCandidates(),
    queryFn: () => expensesApi.getRecurringCandidates().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}
```

### `src/features/expenses/hooks/useTemplates.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as templatesApi from '../api/templates'
import { expenseKeys } from './useExpenses'
import type { CreateTemplateRequest, CreateFromTemplateRequest } from '@/types/expenses'

export const templateKeys = {
  all: ['expense-templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
}

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => templatesApi.listTemplates().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templatesApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      toast.success('Plantilla creada exitosamente')
    },
    onError: () => toast.error('Error al crear la plantilla'),
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => templatesApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      toast.success('Plantilla eliminada')
    },
    onError: () => toast.error('Error al eliminar la plantilla'),
  })
}

export function useCreateExpenseFromTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: CreateFromTemplateRequest }) =>
      templatesApi.createExpenseFromTemplate(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto creado desde plantilla')
    },
    onError: () => toast.error('Error al crear gasto desde plantilla'),
  })
}
```

### `src/features/expenses/hooks/useServices.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as servicesApi from '../api/services'
import { expenseKeys } from './useExpenses'
import type { CreateServiceRequest, MarkServicePaidRequest } from '@/types/expenses'

export const serviceKeys = {
  all: ['expense-services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...serviceKeys.lists(), filters] as const,
  upcoming: () => [...serviceKeys.all, 'upcoming'] as const,
}

export function useServices(params?: { service_type?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: serviceKeys.list(params as Record<string, unknown>),
    queryFn: () => servicesApi.listServices(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useUpcomingServices(daysAhead = 30) {
  return useQuery({
    queryKey: serviceKeys.upcoming(),
    queryFn: () => servicesApi.getUpcomingServices(daysAhead).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Servicio creado exitosamente')
    },
    onError: () => toast.error('Error al crear el servicio'),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateServiceRequest> }) =>
      servicesApi.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Servicio actualizado')
    },
    onError: () => toast.error('Error al actualizar el servicio'),
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Servicio eliminado')
    },
    onError: () => toast.error('Error al eliminar el servicio'),
  })
}

export function useMarkServicePaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkServicePaidRequest }) =>
      servicesApi.markServicePaid(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.upcoming() })
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Servicio marcado como pagado')
    },
    onError: () => toast.error('Error al marcar como pagado'),
  })
}
```

### `src/features/expenses/hooks/useSubscriptions.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as subscriptionsApi from '../api/subscriptions'
import { expenseKeys } from './useExpenses'
import type { CreateSubscriptionRequest } from '@/types/expenses'

export const subKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...subKeys.lists(), params] as const,
  summary: () => [...subKeys.all, 'summary'] as const,
}

export function useSubscriptions(params?: { status?: string }) {
  return useQuery({
    queryKey: subKeys.list(params as Record<string, unknown>),
    queryFn: () => subscriptionsApi.listSubscriptions(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useSubscriptionSummary() {
  return useQuery({
    queryKey: subKeys.summary(),
    queryFn: () => subscriptionsApi.getSubscriptionSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => subscriptionsApi.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subKeys.summary() })
      toast.success('Suscripcion creada exitosamente')
    },
    onError: () => toast.error('Error al crear la suscripcion'),
  })
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubscriptionRequest> }) =>
      subscriptionsApi.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subKeys.summary() })
      toast.success('Suscripcion actualizada')
    },
    onError: () => toast.error('Error al actualizar la suscripcion'),
  })
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subKeys.summary() })
      toast.success('Suscripcion eliminada')
    },
    onError: () => toast.error('Error al eliminar la suscripcion'),
  })
}
```

### `src/features/expenses/hooks/useCreditCards.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as cardsApi from '../api/creditCards'
import { expenseKeys } from './useExpenses'
import type { CreateCreditCardRequest, UpdateCardRequest, PayBillRequest } from '@/types/expenses'

export const cardKeys = {
  all: ['credit-cards'] as const,
  lists: () => [...cardKeys.all, 'list'] as const,
  details: () => [...cardKeys.all, 'detail'] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
  utilization: (id: string) => [...cardKeys.all, 'utilization', id] as const,
  utilizationHistory: (id: string) => [...cardKeys.all, 'utilization-history', id] as const,
  bills: (id: string) => [...cardKeys.all, 'bills', id] as const,
  summary: () => [...cardKeys.all, 'summary'] as const,
}

export function useCreditCards() {
  return useQuery({
    queryKey: cardKeys.lists(),
    queryFn: () => cardsApi.listCards().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreditCard(id: string | undefined) {
  return useQuery({
    queryKey: cardKeys.detail(id!),
    queryFn: () => cardsApi.getCard(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCardUtilization(cardId: string | undefined) {
  return useQuery({
    queryKey: cardKeys.utilization(cardId!),
    queryFn: () => cardsApi.getCardUtilization(cardId!).then((r) => r.data),
    enabled: !!cardId,
    staleTime: 1000 * 60,
  })
}

export function useUtilizationHistory(cardId: string | undefined, months = 6) {
  return useQuery({
    queryKey: [...cardKeys.utilizationHistory(cardId!), months],
    queryFn: () => cardsApi.getUtilizationHistory(cardId!, months).then((r) => r.data),
    enabled: !!cardId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCardsSummary() {
  return useQuery({
    queryKey: cardKeys.summary(),
    queryFn: () => cardsApi.getCardsSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCardBills(cardId: string | undefined) {
  return useQuery({
    queryKey: cardKeys.bills(cardId!),
    queryFn: () => cardsApi.listCardBills(cardId!).then((r) => r.data),
    enabled: !!cardId,
    staleTime: 1000 * 60,
  })
}

export function useCreateCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCreditCardRequest) => cardsApi.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() })
      toast.success('Tarjeta creada exitosamente')
    },
    onError: () => toast.error('Error al crear la tarjeta'),
  })
}

export function useUpdateCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardRequest }) =>
      cardsApi.updateCard(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() })
      toast.success('Tarjeta actualizada')
    },
    onError: () => toast.error('Error al actualizar la tarjeta'),
  })
}

export function useDeleteCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cardsApi.deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() })
      toast.success('Tarjeta eliminada')
    },
    onError: () => toast.error('Error al eliminar la tarjeta'),
  })
}

export function usePayCardBill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, billId, data }: { cardId: string; billId: string; data: PayBillRequest }) =>
      cardsApi.payCardBill(cardId, billId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: cardKeys.bills(variables.cardId) })
      queryClient.invalidateQueries({ queryKey: cardKeys.utilization(variables.cardId) })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Factura pagada exitosamente')
    },
    onError: () => toast.error('Error al pagar la factura'),
  })
}
```

---

## Key Components to Build

### 1. ExpenseNav

Reusable sub-navigation component (same pattern as IncomeNav):

```tsx
// Features: tabs for Lista, Dashboard, Templates, Servicios, Suscripciones, Tarjetas, Duplicados, Recurrentes
// Animated active indicator, smooth transitions
import { NavLink } from 'react-router-dom'

const TABS = [
  { path: '/expenses', label: 'Lista', icon: List },
  { path: '/expenses/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/expenses/templates', label: 'Plantillas', icon: FileText },
  { path: '/expenses/services', label: 'Servicios', icon: Zap },
  { path: '/expenses/subscriptions', label: 'Suscripciones', icon: Repeat },
  { path: '/expenses/credit-cards', label: 'Tarjetas', icon: CreditCard },
  { path: '/expenses/duplicates', label: 'Duplicados', icon: Copy },
  { path: '/expenses/recurring-candidates', label: 'Recurrentes', icon: RefreshCw },
]
```

### 2. PriorityBadge

Small badge displaying priority with icon, color, and label:

```tsx
// Uses PRIORITY_CONFIG from constants
// Props: priority: Priority, size?: 'sm' | 'md'
// Renders: icon + label with configured colors
```

### 3. ExpenseCard

List item card (for mobile), same pattern as IncomeCard:
- Left color strip from category color
- Description + date
- Category badge + priority badge
- Amount with color based on expense (red) 
- Service/subscription/template link indicators
- Tags count if any

### 4. ExpenseTable

Desktop table with columns: priority, description, category, account, amount, status, source, date, actions
- Sortable columns
- Priority icon in first column
- Category badge color-coded
- Amount in red

### 5. ExpenseForm

Full create/edit form:
- AccountPicker
- Amount input
- Description
- Effective date (defaults to today)
- CategoryPicker (category_id) + optional SubcategoryPicker
- Priority selector (4 buttons with icons)
- Source text (default "manual")
- Notes textarea
- Tags input
- Optional links: Template ID, Service ID, Subscription ID, Credit Card ID — these are hidden inputs that get set when navigating from a template/service/subscription context. Show as read-only badges if present.
- Validate with Zod schema mirroring CreateExpenseRequest

### 6. SplitExpenseCreator

Multi-line split form:
- Total amount input
- Splits array: each split has amount, description, optional account_id
- Add/remove split rows
- Split total must equal total_amount (validation)
- Auto-distribute: button to split total_amount equally among rows
- Submits via useCreateSplitExpense

### 7. UtilizationGauge

Semi-circular gauge for credit card utilization:
- Uses SVG for the arc
- Color zones: green (<30%), yellow (30-60%), amber (60-80%), red (>80%)
- Shows percentage in center
- Shows credit limit and used amount below
- Accepts utilization: number (0-100)

### 8. PayBillModal

Modal for paying a card bill:
- Shows bill info: due date, total amount, minimum payment
- Payment amount input (defaults to total_amount)
- Payment method selector: manual, auto, transfer, cash
- Confirm button
- Validates amount >= 0

### 9. CardBillCard

Card bill list item:
- Statement period dates
- Total amount
- Minimum payment
- Payment status badge (with PAYMENT_STATUS_CONFIG)
- Amount paid if partial
- Pay button if not paid
- Edit/delete buttons

### 10. DailyTrendChart

Line chart for daily expense trend (from dashboard):
- X-axis: date
- Y-axis: amount
- Uses data from ExpenseDashboardResponse.daily_trend

### 11. CategoryBreakdownChart

Pie/doughnut chart for expense categories (from dashboard):
- Slices from ExpenseDashboardResponse.by_category
- Category names + amounts + percentages
- Interactive legend

### 12. SpendingPatternChart

Bar chart for monthly spending (from patterns):
- X-axis: month
- Y-axis: amount
- Data from SpendingPatternsResponse.monthly_data

### 13. EmptyExpenseState

Empty state illustration for expenses:
- Icon: ShoppingCart or CreditCard
- Message based on context
- CTA: "Crear primer gasto"

---

## Pages Implementation Details

### ExpenseListPage (`/expenses`)
- Fetch: `useExpenseInfinite(filters)` or `useExpenses(filters)`
- Filters from URL search params (type, date range, category, account, search, priority, source)
- Sort by effective_date desc (default)
- Tab view: Card layout (mobile) / Table layout (desktop)
- FAB or header button: "Nuevo Gasto" → `/expenses/new`
- Infinite scroll if using infinite query
- Active filter count badge
- Each card/row navigates to `/expenses/:id` on click

### ExpenseCreatePage (`/expenses/new`)
- Uses ExpenseForm with mode="create"
- After submit, navigate to `/expenses`
- Optional `?template=id`, `?service=id`, `?subscription=id` query params to pre-link

### ExpenseDetailPage (`/expenses/:id`)
- Fetch: `useExpense(id)`
- Shows full detail: description, amount, date, category, account, priority, source
- Status badges, tags
- Related links (template/service/subscription link out)
- Edit button → `/expenses/:id/edit`
- Delete button with confirmation

### ExpenseEditPage (`/expenses/:id/edit`)
- Uses ExpenseForm with mode="edit"
- Pre-fills from existing expense data
- Submit calls `useUpdateExpense`

### ExpenseDashboardPage (`/expenses/dashboard`)
- Date range state (default: current month)
- Uses `useExpenseDashboard(date_from, date_to)`
- KPI strip: total, count, daily average, subscriptions total
- CategoryBreakdownChart
- DailyTrendChart
- SpendingPatternChart (separate card)
- Links to subscription summary

### TemplatesPage (`/expenses/templates`)
- List of TemplateCards
- "Nueva Plantilla" button → `/expenses/templates/new`
- Each card: name, description, default amount, usage count, last used
- "Crear Gasto" button on each → opens modal or navigates to `/expenses/new?template=id`
- Delete button with confirmation

### TemplatesCreatePage (`/expenses/templates/new`)
- TemplateForm with name, description, default amount, default account, default category, icon, color
- Submit calls `useCreateTemplate`
- Navigate to `/expenses/templates` on success

### ServicesPage (`/expenses/services`)
- List of ServiceCards with payment status
- Filter by service_type
- "Nuevo Servicio" button → `/expenses/services/new`
- Upcoming services section (from `useUpcomingServices`)
- Pay button per service → opens simple PayServiceModal (amount + date)
- Each card: name, provider, type icon, account number, estimated amount, due day, payment status
- Edit/delete buttons

### ServicesCreatePage (`/expenses/services/new`)
- ServiceForm with name, provider, service_type (radio/grid), estimated amount, account number, billing day, due day, category, auto_create toggle
- Submit calls `useCreateService`

### SubscriptionsPage (`/expenses/subscriptions`)
- Subscription summary strip at top (from `useSubscriptionSummary`): active count, monthly total, annual total, cost per day, recommendations
- List of SubscriptionCards
- Filter by status (active/paused/cancelled)
- "Nueva Suscripcion" button → `/expenses/subscriptions/new`
- Each card: name, provider, amount, billing_frequency, annual cost, next billing date, status badge
- Cancel button with reason input for active subs
- Recommendations section shown as info banners

### SubscriptionsCreatePage (`/expenses/subscriptions/new`)
- SubscriptionForm with name, provider, amount, currency, billing_frequency, account, category, start_date, end_date, next_billing_date, website_url, icon, color
- Submit calls `useCreateSubscription`

### CreditCardsPage (`/expenses/credit-cards`)
- Cards summary strip (from `useCardsSummary`): total cards, total limit, available, used, utilization %
- Grid of CreditCardCards
- "Nueva Tarjeta" button → `/expenses/credit-cards/new`
- Each card: name, network icon/color, last 4 digits, credit limit, available credit, utilization bar
- Click → `/expenses/credit-cards/:id`

### CreditCardsCreatePage (`/expenses/credit-cards/new`)
- CreditCardForm with name, account, last_four_digits, card_network (icons), credit_limit, available_credit, statement_day, payment_due_day, interest_rate, color, icon
- Submit calls `useCreateCard`

### CreditCardsDetailPage (`/expenses/credit-cards/:id`)
- Fetch: `useCreditCard(id)`, `useCardUtilization(id)`
- Header: name, network badge, last 4 digits
- UtilizationGauge
- Credit limit, available credit
- Statement day, payment due day
- Interest rate
- Edit button → opens edit modal/inline
- Bills section: `useCardBills(id)` → list of CardBillCards
- "Nueva Factura" button → opens CreateBillModal
- "Pagar" button per unpaid bill → opens PayBillModal

### CardBillsPage (`/expenses/credit-cards/:id/bills`)
- Full page bill management for a specific card
- List of all bills with status tracking
- Pay/Edit/Delete per bill

### SplitExpensePage (`/expenses/split`)
- Uses SplitExpenseCreator component
- Submit calls `useCreateSplitExpense`

### DuplicatesPage (`/expenses/duplicates`)
- Fetch: `useDuplicates()`
- Grouped duplicates by similarity
- Each group: description, amount, dates, count
- Actions: "Keep one, delete others" or "Ignore all"
- Uses `useDeleteExpense` for removals

### RecurringCandidatesPage (`/expenses/recurring-candidates`)
- Fetch: `useRecurringCandidates()`
- List of candidate cards: description, amount, occurrences, frequency
- "Convert to recurring" → opens modal to fill frequency, account, etc → calls `useCreateRecurring()` (from transactions recurring API)
- "Dismiss" button

---

## Route Registration

Update `src/routes/lazy.ts` and `src/routes/index.tsx`:

### In `lazy.ts`:
```typescript
export const ExpenseListPage = lazy(() => import('@/features/expenses/pages/ExpenseListPage'))
export const ExpenseCreatePage = lazy(() => import('@/features/expenses/pages/ExpenseCreatePage'))
export const ExpenseDetailPage = lazy(() => import('@/features/expenses/pages/ExpenseDetailPage'))
export const ExpenseEditPage = lazy(() => import('@/features/expenses/pages/ExpenseEditPage'))
export const ExpenseDashboardPage = lazy(() => import('@/features/expenses/pages/ExpenseDashboardPage'))
export const TemplatesPage = lazy(() => import('@/features/expenses/pages/TemplatesPage'))
export const TemplatesCreatePage = lazy(() => import('@/features/expenses/pages/TemplatesCreatePage'))
export const ServicesPage = lazy(() => import('@/features/expenses/pages/ServicesPage'))
export const ServicesCreatePage = lazy(() => import('@/features/expenses/pages/ServicesCreatePage'))
export const SubscriptionsPage = lazy(() => import('@/features/expenses/pages/SubscriptionsPage'))
export const SubscriptionsCreatePage = lazy(() => import('@/features/expenses/pages/SubscriptionsCreatePage'))
export const CreditCardsPage = lazy(() => import('@/features/expenses/pages/CreditCardsPage'))
export const CreditCardsCreatePage = lazy(() => import('@/features/expenses/pages/CreditCardsCreatePage'))
export const CreditCardsDetailPage = lazy(() => import('@/features/expenses/pages/CreditCardsDetailPage'))
export const CardBillsPage = lazy(() => import('@/features/expenses/pages/CardBillsPage'))
export const SplitExpensePage = lazy(() => import('@/features/expenses/pages/SplitExpensePage'))
export const DuplicatesPage = lazy(() => import('@/features/expenses/pages/DuplicatesPage'))
export const RecurringCandidatesPage = lazy(() => import('@/features/expenses/pages/RecurringCandidatesPage'))
```

### In `index.tsx` (add under the incomes routes):
```tsx
{/* Expenses */}
<Route path="expenses" element={<ExpenseListPage />} />
<Route path="expenses/new" element={<ExpenseCreatePage />} />
<Route path="expenses/split" element={<SplitExpensePage />} />
<Route path="expenses/dashboard" element={<ExpenseDashboardPage />} />
<Route path="expenses/templates" element={<TemplatesPage />} />
<Route path="expenses/templates/new" element={<TemplatesCreatePage />} />
<Route path="expenses/services" element={<ServicesPage />} />
<Route path="expenses/services/new" element={<ServicesCreatePage />} />
<Route path="expenses/subscriptions" element={<SubscriptionsPage />} />
<Route path="expenses/subscriptions/new" element={<SubscriptionsCreatePage />} />
<Route path="expenses/credit-cards" element={<CreditCardsPage />} />
<Route path="expenses/credit-cards/new" element={<CreditCardsCreatePage />} />
<Route path="expenses/credit-cards/:id" element={<CreditCardsDetailPage />} />
<Route path="expenses/credit-cards/:id/bills" element={<CardBillsPage />} />
<Route path="expenses/duplicates" element={<DuplicatesPage />} />
<Route path="expenses/recurring-candidates" element={<RecurringCandidatesPage />} />
<Route path="expenses/:id" element={<ExpenseDetailPage />} />
<Route path="expenses/:id/edit" element={<ExpenseEditPage />} />
```

Also add the sidebar link for expenses in `Sidebar.tsx`:
```tsx
{ label: 'Gastos', path: '/expenses', icon: ShoppingCart },
```

---

## Data Flow Summary

```
User Action            → API Call                    → Hook                     → Backend Endpoint
──────────────────────────────────────────────────────────────────────────────────────────────
Create expense         → createExpense()             → useCreateExpense()       → POST /expenses
Create split expense   → createSplitExpense()        → useCreateSplitExpense()  → POST /expenses/split
List expenses          → listExpenses()              → useExpenses()            → GET /expenses
Get expense            → getExpense()                → useExpense()             → GET /expenses/:id
Update expense         → updateExpense()             → useUpdateExpense()       → PATCH /expenses/:id
Delete expense         → deleteExpense()             → useDeleteExpense()       → DELETE /expenses/:id
View dashboard         → getExpenseDashboard()       → useExpenseDashboard()    → GET /expenses/dashboard
View patterns          → getSpendingPatterns()       → useSpendingPatterns()    → GET /expenses/patterns
View duplicates        → getDuplicates()             → useDuplicates()          → GET /expenses/duplicates
View recurring cands   → getRecurringCandidates()    → useRecurringCandidates() → GET /expenses/recurring-candidates
Create template        → createTemplate()            → useCreateTemplate()      → POST /expenses/templates
List templates         → listTemplates()             → useTemplates()           → GET /expenses/templates
Delete template        → deleteTemplate()            → useDeleteTemplate()      → DELETE /expenses/templates/:id
Create from template   → createExpenseFromTemplate() → useCreateExpenseFromTemplate() → POST /expenses/templates/:id/create-expense
Create service         → createService()             → useCreateService()       → POST /expenses/services
List services          → listServices()              → useServices()            → GET /expenses/services
Upcoming services      → getUpcomingServices()       → useUpcomingServices()    → GET /expenses/services/upcoming
Update service         → updateService()             → useUpdateService()       → PATCH /expenses/services/:id
Delete service         → deleteService()             → useDeleteService()       → DELETE /expenses/services/:id
Mark service paid      → markServicePaid()           → useMarkServicePaid()     → POST /expenses/services/:id/pay
Create subscription    → createSubscription()        → useCreateSubscription()  → POST /expenses/subscriptions
List subscriptions     → listSubscriptions()         → useSubscriptions()       → GET /expenses/subscriptions
Subscription summary   → getSubscriptionSummary()    → useSubscriptionSummary() → GET /expenses/subscriptions/summary
Update subscription    → updateSubscription()        → useUpdateSubscription()  → PATCH /expenses/subscriptions/:id
Delete subscription    → deleteSubscription()        → useDeleteSubscription()  → DELETE /expenses/subscriptions/:id
Create card            → createCard()                → useCreateCard()          → POST /expenses/cards
List cards             → listCards()                 → useCreditCards()         → GET /expenses/cards
Card utilization       → getCardUtilization()        → useCardUtilization()     → GET /expenses/cards/:id/utilization
Create card bill       → createCardBill()            → (mutation in page)       → POST /expenses/cards/:id/bills
List card bills        → listCardBills()             → useCardBills()           → GET /expenses/cards/:id/bills
Pay card bill          → payCardBill()               → usePayCardBill()         → POST /cards/:id/bills/:billId/pay
```

---

## Implementation Order (Recommended)

1. **Types** → `src/types/expenses.ts`
2. **Constants** → `src/features/expenses/constants.ts`
3. **API files** → 5 files in `api/`
4. **Hooks** → 5 files in `hooks/`
5. **PriorityBadge** component
6. **ExpenseNav** component
7. **ExpenseForm** + **ExpenseCard** + **ExpenseTable** + **ExpenseFilters** + **EmptyExpenseState**
8. **ExpenseListPage** (with infinite scroll)
9. **ExpenseCreatePage** + **ExpenseEditPage** + **ExpenseDetailPage**
10. **SplitExpenseCreator** component + **SplitExpensePage**
11. **TemplateCard** + **TemplateForm**
12. **TemplatesPage** + **TemplatesCreatePage**
13. **ServiceCard** + **ServiceForm**
14. **ServicesPage** + **ServicesCreatePage**
15. **SubscriptionCard** + **SubscriptionSummary**
16. **SubscriptionsPage** + **SubscriptionsCreatePage**
17. **CreditCardCard** + **CreditCardForm** + **UtilizationGauge**
18. **CreditCardsPage** + **CreditCardsCreatePage** + **CreditCardsDetailPage**
19. **CardBillCard** + **CardBillList** + **PayBillModal**
20. **CardBillsPage**
21. **DailyTrendChart** + **CategoryBreakdownChart** + **SpendingPatternChart**
22. **ExpenseDashboardPage**
23. **DuplicateCard** + **DuplicatesPage**
24. **RecurringCandidateCard** + **RecurringCandidatesPage**
25. **Lazy imports + Route registration**
26. **Sidebar link** in Sidebar.tsx
27. **`pnpm tsc --noEmit`** verification

---

## Verification

After completion, run:
```bash
cd fip-frontend
pnpm tsc --noEmit
```

Expected: zero TypeScript errors. Verify that:
- All imports resolve correctly
- All API paths match backend endpoints
- All type fields match API responses
- All hooks return proper types
- React.lazy imports for all pages
- All routes are registered in lazy.ts and index.tsx
- All data invalidations cover the correct query keys
