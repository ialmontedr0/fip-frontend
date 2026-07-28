# Fase 13: Automations - Guia de Implementacion

## Arquitectura

### Estructura de archivos a crear

```
src/
  types/
    automations.ts                    # Tipos TypeScript
  features/
    automations/
      api//
        automations.ts                # Funciones API
      hooks/
        useAutomations.ts             # TanStack Query hooks
      components/
        AutomationNav.tsx             # Sub-navegacion (como AINav)
        AutomationSummaryCards.tsx     # Tarjetas de resumen (total, activas, ejecuciones)
        AutomationListTable.tsx        # Tabla de reglas con toggle
        AutomationFilters.tsx          # Filtros (activo/inactivo, tipo trigger)
        AutomationEmptyState.tsx       # Estado vacio con CTA
        AutomationCard.tsx            # Una tarjeta de regla (vista mobile)
        CreateWizard/
          AutomationCreateWizard.tsx   # Wizard principal
          StepIndicator.tsx            # Indicador de progreso
          StepTriggerType.tsx          # Paso 1: seleccionar trigger type
          StepTriggerConditions.tsx    # Paso 2: configurar condiciones (dinamico)
          StepActionType.tsx           # Paso 3: seleccionar action type
          StepActionParams.tsx         # Paso 4: configurar params (dinamico)
          StepReview.tsx              # Paso 5: revision y crear
          ConditionBuilder/
            IncomeReceivedCondition.tsx
            BalanceThresholdCondition.tsx
            DateScheduledCondition.tsx
            BillDueSoonCondition.tsx
            BudgetExceededCondition.tsx
            GoalCompletedCondition.tsx
          ActionParamBuilder/
            TransferActionParams.tsx
            PayCreditCardActionParams.tsx
            CreateTransactionActionParams.tsx
            NotifyActionParams.tsx
            AdjustBudgetActionParams.tsx
        AutomationDetailPanel.tsx     # Panel de detalle de regla
        ExecutionLogViewer.tsx         # Visor de logs de ejecucion
        ManualExecuteButton.tsx        # Boton de ejecucion manual
        ActiveToggle.tsx              # Toggle activo/inactivo
        TemplatesList.tsx             # Lista de plantillas
        QuickSetupModal.tsx           # Modal de configuracion rapida
      pages/
        AutomationListPage.tsx         # Listado principal
        AutomationCreatePage.tsx       # Pagina del wizard
        AutomationDetailPage.tsx       # Detalle de regla + logs
      constants.ts                    # Configuraciones, labels, estilos
```

## 1. Tipos TypeScript (`src/types/automations.ts`)

```typescript
// ============================================================
// AUTOMATION TYPES
// ============================================================

export type TriggerType =
  | 'income_received'
  | 'balance_threshold'
  | 'date_scheduled'
  | 'bill_due_soon'
  | 'budget_exceeded'
  | 'goal_completed'

export type ActionType =
  | 'transfer'
  | 'pay_credit_card'
  | 'create_transaction'
  | 'notify'
  | 'adjust_budget'

export type ExecutionStatus = 'success' | 'failed' | 'dry_run' | 'skipped' | 'error'
export type Direction = 'above' | 'below'
export type AmountType = 'fixed' | 'percent_of_balance' | 'percent_of_surplus'
export type PaymentType = 'minimum' | 'full' | 'custom'
export type AdjustmentType = 'set' | 'increase' | 'decrease' | 'percentage'

// ============================================================
// TRIGGER CONDITION TYPES
// ============================================================

export interface IncomeReceivedConditions {
  min_amount?: number
  category_id?: string
}

export interface BalanceThresholdConditions {
  account_id: string
  threshold: number
  direction: Direction
}

export interface DateScheduledConditions {
  day_of_month: number
  months: number[]
}

export interface BillDueSoonConditions {
  card_id: string
  days_before_due: number
}

export interface BudgetExceededConditions {
  budget_id: string
  threshold_pct: number
}

export interface GoalCompletedConditions {
  goal_id: string
}

export type TriggerConditions =
  | IncomeReceivedConditions
  | BalanceThresholdConditions
  | DateScheduledConditions
  | BillDueSoonConditions
  | BudgetExceededConditions
  | GoalCompletedConditions

// ============================================================
// ACTION PARAM TYPES
// ============================================================

export interface TransferActionParams {
  source_account_id: string
  target_account_id: string
  amount: number
  amount_type: AmountType
}

export interface PayCreditCardActionParams {
  card_id: string
  payment_account_id: string
  payment_type: PaymentType
  custom_amount?: number
}

export interface CreateTransactionActionParams {
  account_id: string
  category_id?: string
  amount: number
  description: string
  transaction_type: 'expense' | 'income'
}

export interface NotifyActionParams {
  message: string
  title?: string
  channel?: string
}

export interface AdjustBudgetActionParams {
  budget_id: string
  adjustment_type: AdjustmentType
  target_amount: number
}

export type ActionParams =
  | TransferActionParams
  | PayCreditCardActionParams
  | CreateTransactionActionParams
  | NotifyActionParams
  | AdjustBudgetActionParams

// ============================================================
// RULE TYPES
// ============================================================

export interface AutomationRule {
  id: string
  name: string
  description: string | null
  trigger_type: TriggerType
  trigger_conditions: TriggerConditions | null
  action_type: ActionType
  action_params: ActionParams | null
  is_active: boolean
  execution_count: number
  last_executed_at: string | null
  last_execution_status: ExecutionStatus | null
  max_executions_per_month: number | null
  min_balance_required: number | null
  created_at: string | null
}

export interface CreateRuleRequest {
  name: string
  description?: string
  trigger_type: TriggerType
  trigger_conditions?: TriggerConditions
  action_type: ActionType
  action_params?: ActionParams
  max_executions_per_month?: number
  min_balance_required?: number
}

export interface UpdateRuleRequest {
  name?: string
  description?: string
  trigger_type?: TriggerType
  trigger_conditions?: TriggerConditions
  action_type?: ActionType
  action_params?: ActionParams
  max_executions_per_month?: number
  min_balance_required?: number
}

export interface ListRulesResponse {
  rules: AutomationRule[]
  total: number
}

export interface RuleDetailResponse extends AutomationRule {}

export interface CreateRuleResponse {
  id: string
  name: string
  trigger_type: TriggerType
  action_type: ActionType
  is_active: boolean
  message: string
}

export interface ToggleRuleResponse {
  id: string
  name: string
  is_active: boolean
  message: string
}

// ============================================================
// EXECUTION LOG TYPES
// ============================================================

export interface ExecutionLog {
  id: string
  rule_id: string
  status: ExecutionStatus
  trigger_snapshot: TriggerConditions | null
  action_result: Record<string, unknown> | null
  error_message: string | null
  amount_involved: number | null
  source_account_id: string | null
  target_account_id: string | null
  is_dry_run: boolean
  executed_at: string | null
}

export interface ListExecutionLogsResponse {
  logs: ExecutionLog[]
  total: number
}

export interface ExecutionLogDetailResponse extends ExecutionLog {}

// ============================================================
// TEMPLATE TYPES
// ============================================================

export interface TriggerTemplate {
  type: TriggerType
  name: string
  description: string
  params: Record<string, string>
}

export interface ActionTemplate {
  type: ActionType
  name: string
  description: string
  params: Record<string, string>
}

export interface TemplatesResponse {
  triggers: TriggerTemplate[]
  actions: ActionTemplate[]
}

// ============================================================
// SUMMARY TYPES
// ============================================================

export interface AutomationSummary {
  total_rules: number
  active_rules: number
  total_executions: number
  recent_logs: {
    success: number
    failed: number
  }
  rules_by_trigger: Record<string, number>
  recent_executions: Array<{
    id: string
    rule_id: string
    status: ExecutionStatus
    amount_involved: number | null
    executed_at: string | null
  }>
}

// ============================================================
// EXECUTION RESULT TYPES
// ============================================================

export interface ExecuteRuleResponse {
  rule_id: string
  rule_name: string
  status: 'executed' | 'dry_run' | 'skipped' | 'failed'
  result?: Record<string, unknown>
  error?: string
  reason?: string
}

export interface EvaluateAllResponse {
  total_rules: number
  executed: number
  skipped: number
  failed: number
  results: ExecuteRuleResponse[]
}

// ============================================================
// QUICK SETUP TYPES
// ============================================================

export interface QuickSavingsTransferRequest {
  source_account_id: string
  target_account_id: string
  amount: number
  amount_type?: AmountType
  trigger_type?: TriggerType
  trigger_conditions?: TriggerConditions
  name?: string
}

export interface QuickCardPaymentRequest {
  card_id: string
  payment_account_id: string
  payment_type?: PaymentType
  days_before_due?: number
  name?: string
}

export interface QuickBalanceTransferRequest {
  source_account_id: string
  target_account_id: string
  threshold: number
  direction?: Direction
  percent_to_transfer?: number
  name?: string
}

export interface QuickSetupResponse {
  id: string
  name: string
  message: string
}
```

## 2. API Layer (`src/features/automations/api/automations.ts`)

```typescript
import api from '@/lib/api'
import type {
  ListRulesResponse, RuleDetailResponse, CreateRuleResponse,
  CreateRuleRequest, UpdateRuleRequest, ToggleRuleResponse,
  ListExecutionLogsResponse, ExecutionLogDetailResponse,
  TemplatesResponse, AutomationSummary,
  ExecuteRuleResponse, EvaluateAllResponse,
  QuickSavingsTransferRequest, QuickCardPaymentRequest,
  QuickBalanceTransferRequest, QuickSetupResponse,
} from '@/types/automations'

// ---- CRUD ----
export function listRules(params?: { is_active?: boolean; trigger_type?: string }) {
  return api.get<ListRulesResponse>('/automations', { params })
}

export function createRule(data: CreateRuleRequest) {
  return api.post<CreateRuleResponse>('/automations', data)
}

export function getRule(id: string) {
  return api.get<RuleDetailResponse>(`/automations/${id}`)
}

export function updateRule(id: string, data: UpdateRuleRequest) {
  return api.put<{ id: string; name: string; message: string }>(`/automations/${id}`, data)
}

export function deleteRule(id: string) {
  return api.delete<{ message: string }>(`/automations/${id}`)
}

// ---- Execution ----
export function toggleRule(id: string) {
  return api.post<ToggleRuleResponse>(`/automations/${id}/toggle`)
}

export function executeRule(id: string, dryRun?: boolean) {
  return api.post<ExecuteRuleResponse>(`/automations/${id}/execute`, null, {
    params: { dry_run: dryRun },
  })
}

export function evaluateAll(dryRun?: boolean) {
  return api.post<EvaluateAllResponse>('/automations/evaluate', null, {
    params: { dry_run: dryRun },
  })
}

// ---- Logs ----
export function listExecutionLogs(params?: { rule_id?: string; limit?: number }) {
  return api.get<ListExecutionLogsResponse>('/automations/execution-log', { params })
}

export function getExecutionLog(id: string) {
  return api.get<ExecutionLogDetailResponse>(`/automations/execution-log/${id}`)
}

// ---- Templates & Summary ----
export function getTemplates() {
  return api.get<TemplatesResponse>('/automations/templates')
}

export function getSummary() {
  return api.get<AutomationSummary>('/automations/summary')
}

// ---- Quick Setup ----
export function quickSavingsTransfer(data: QuickSavingsTransferRequest) {
  return api.post<QuickSetupResponse>('/automations/quick/savings-transfer', data)
}

export function quickCardPayment(data: QuickCardPaymentRequest) {
  return api.post<QuickSetupResponse>('/automations/quick/card-payment', data)
}

export function quickBalanceTransfer(data: QuickBalanceTransferRequest) {
  return api.post<QuickSetupResponse>('/automations/quick/balance-transfer', data)
}
```

## 3. Hooks (`src/features/automations/hooks/useAutomations.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as automationsApi from '../api/automations'
import type {
  CreateRuleRequest, UpdateRuleRequest,
} from '@/types/automations'

export const automationKeys = {
  all: ['automations'] as const,
  lists: () => [...automationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...automationKeys.lists(), filters] as const,
  details: () => [...automationKeys.all, 'detail'] as const,
  detail: (id: string) => [...automationKeys.details(), id] as const,
  summary: () => [...automationKeys.all, 'summary'] as const,
  templates: () => [...automationKeys.all, 'templates'] as const,
  logs: () => [...automationKeys.all, 'logs'] as const,
  logsList: (params?: Record<string, unknown>) => [...automationKeys.logs(), params] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

// ---- Queries ----
export function useAutomations(params?: { is_active?: boolean; trigger_type?: string }) {
  return useQuery({
    queryKey: automationKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => automationsApi.listRules(params).then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

export function useAutomation(id: string | undefined) {
  return useQuery({
    queryKey: automationKeys.detail(id!),
    queryFn: () => automationsApi.getRule(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
}

export function useAutomationSummary() {
  return useQuery({
    queryKey: automationKeys.summary(),
    queryFn: () => automationsApi.getSummary().then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useTemplates() {
  return useQuery({
    queryKey: automationKeys.templates(),
    queryFn: () => automationsApi.getTemplates().then((r) => r.data),
    staleTime: Infinity,
  })
}

export function useExecutionLogs(params?: { rule_id?: string; limit?: number }) {
  return useQuery({
    queryKey: automationKeys.logsList(cleanParams(params as Record<string, unknown>)),
    queryFn: () => automationsApi.listExecutionLogs(params).then((r) => r.data),
    staleTime: 1000 * 15,
  })
}

export function useExecutionLog(id: string | undefined) {
  return useQuery({
    queryKey: [...automationKeys.logs(), id],
    queryFn: () => automationsApi.getExecutionLog(id!).then((r) => r.data),
    enabled: !!id,
  })
}

// ---- Mutations ----
export function useCreateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRuleRequest) => automationsApi.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Regla creada exitosamente')
    },
    onError: () => toast.error('Error al crear la regla'),
  })
}

export function useUpdateRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRuleRequest }) =>
      automationsApi.updateRule(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Regla actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la regla'),
  })
}

export function useDeleteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => automationsApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Regla eliminada')
    },
    onError: () => toast.error('Error al eliminar la regla'),
  })
}

export function useToggleRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => automationsApi.toggleRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.detail() })
      toast.success('Estado actualizado')
    },
  })
}

export function useExecuteRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dryRun }: { id: string; dryRun?: boolean }) =>
      automationsApi.executeRule(id, dryRun),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.logs() })
      const data = res.data
      if (data.status === 'executed') toast.success('Regla ejecutada exitosamente')
      else if (data.status === 'skipped') toast(data.reason || 'Regla saltada', { icon: '⏭️' })
      else if (data.status === 'failed') toast.error(data.error || 'Error en ejecucion')
    },
    onError: () => toast.error('Error al ejecutar la regla'),
  })
}

export function useEvaluateAll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dryRun?: boolean) => automationsApi.evaluateAll(dryRun),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.logs() })
      const data = res.data
      toast.success(`${data.executed} reglas ejecutadas, ${data.skipped} saltadas, ${data.failed} fallidas`)
    },
    onError: () => toast.error('Error al evaluar reglas'),
  })
}

// ---- Quick Setup ----
export function useQuickSavingsTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof automationsApi.quickSavingsTransfer>[0]) =>
      automationsApi.quickSavingsTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: automationKeys.summary() })
      toast.success('Ahorro automatico configurado')
    },
  })
}

export function useQuickCardPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof automationsApi.quickCardPayment>[0]) =>
      automationsApi.quickCardPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      toast.success('Pago automatico configurado')
    },
  })
}

export function useQuickBalanceTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof automationsApi.quickBalanceTransfer>[0]) =>
      automationsApi.quickBalanceTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.lists() })
      toast.success('Transferencia por saldo configurada')
    },
  })
}
```

## 4. Constants (`src/features/automations/constants.ts`)

```typescript
import {
  Wallet, ArrowLeftRight, CreditCard, FileText, Bell, SlidersHorizontal,
  TrendingUp, Calendar, CreditCard as CreditCardIcon, Goal, PiggyBank,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TriggerType, ActionType, ExecutionStatus } from '@/types/automations'

export const TRIGGER_CONFIG: Record<TriggerType, {
  label: string
  icon: LucideIcon
  color: string
  gradient: string
  description: string
  params: Record<string, string>
}> = {
  income_received: {
    label: 'Ingreso recibido', icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-400 to-green-500',
    description: 'Se activa cuando se registra un ingreso',
    params: { min_amount: 'Monto minimo (opcional)', category_id: 'Categoria (opcional)' },
  },
  balance_threshold: {
    label: 'Umbral de saldo', icon: Wallet,
    color: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-400 to-cyan-500',
    description: 'Se activa cuando un saldo cruza un limite',
    params: { account_id: 'Cuenta', threshold: 'Umbral', direction: 'Direccion (above/below)' },
  },
  date_scheduled: {
    label: 'Fecha programada', icon: Calendar,
    color: 'text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-400 to-purple-500',
    description: 'Se activa en una fecha especifica del mes',
    params: { day_of_month: 'Dia del mes (1-28)', months: 'Meses (1-12)' },
  },
  bill_due_soon: {
    label: 'Factura proxima a vencer', icon: CreditCardIcon,
    color: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-400 to-red-500',
    description: 'Se activa cuando una factura esta por vencer',
    params: { card_id: 'Tarjeta de credito', days_before_due: 'Dias antes del vencimiento' },
  },
  budget_exceeded: {
    label: 'Presupuesto excedido', icon: SlidersHorizontal,
    color: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-400 to-orange-500',
    description: 'Se activa cuando un presupuesto supera un umbral',
    params: { budget_id: 'Presupuesto', threshold_pct: 'Porcentaje umbral (0-100)' },
  },
  goal_completed: {
    label: 'Meta completada', icon: Goal,
    color: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-400 to-teal-500',
    description: 'Se activa cuando una meta financiera se alcanza',
    params: { goal_id: 'Meta' },
  },
}

export const ACTION_CONFIG: Record<ActionType, {
  label: string
  icon: LucideIcon
  color: string
  gradient: string
  description: string
  params: Record<string, string>
}> = {
  transfer: {
    label: 'Transferencia', icon: ArrowLeftRight,
    color: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-400 to-indigo-500',
    description: 'Mover dinero entre cuentas',
    params: { source_account_id: 'Cuenta origen', target_account_id: 'Cuenta destino', amount: 'Monto', amount_type: 'Tipo (fixed/percent_of_balance/percent_of_surplus)' },
  },
  pay_credit_card: {
    label: 'Pago de tarjeta', icon: CreditCard,
    color: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-400 to-pink-500',
    description: 'Pagar factura de tarjeta de credito',
    params: { card_id: 'Tarjeta', payment_account_id: 'Cuenta de pago', payment_type: 'Tipo (minimum/full/custom)', custom_amount: 'Monto personalizado' },
  },
  create_transaction: {
    label: 'Crear transaccion', icon: FileText,
    color: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-400 to-yellow-500',
    description: 'Crear una transaccion automaticamente',
    params: { account_id: 'Cuenta', category_id: 'Categoria', amount: 'Monto', description: 'Descripcion', transaction_type: 'Tipo (expense/income)' },
  },
  notify: {
    label: 'Notificacion', icon: Bell,
    color: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-400 to-violet-500',
    description: 'Enviar una notificacion',
    params: { message: 'Mensaje', title: 'Titulo', channel: 'Canal (opcional)' },
  },
  adjust_budget: {
    label: 'Ajustar presupuesto', icon: SlidersHorizontal,
    color: 'text-cyan-600 dark:text-cyan-400',
    gradient: 'from-cyan-400 to-teal-500',
    description: 'Ajustar automaticamente un presupuesto',
    params: { budget_id: 'Presupuesto', adjustment_type: 'Tipo (set/increase/decrease/percentage)', target_amount: 'Monto objetivo' },
  },
}

export const EXECUTION_STATUS_CONFIG: Record<ExecutionStatus, {
  label: string
  color: string
  bgColor: string
  dotColor: string
}> = {
  success: { label: 'Exito', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', dotColor: 'bg-emerald-500' },
  failed: { label: 'Fallido', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10', dotColor: 'bg-red-500' },
  dry_run: { label: 'Simulacion', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10', dotColor: 'bg-blue-500' },
  skipped: { label: 'Saltado', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10', dotColor: 'bg-amber-500' },
  error: { label: 'Error', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10', dotColor: 'bg-red-500' },
}

export const AMOUNT_TYPE_OPTIONS = [
  { value: 'fixed', label: 'Monto fijo', description: 'Transfiere siempre el mismo monto' },
  { value: 'percent_of_balance', label: '% del saldo', description: 'Transfiere un porcentaje del saldo actual' },
  { value: 'percent_of_surplus', label: '% del excedente', description: 'Transfiere un % del saldo por encima del minimo' },
]

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'full', label: 'Pago completo', description: 'Paga el total de la factura' },
  { value: 'minimum', label: 'Pago minimo', description: 'Paga solo el minimo requerido' },
  { value: 'custom', label: 'Monto personalizado', description: 'Paga un monto especifico' },
]

export const ADJUSTMENT_TYPE_OPTIONS = [
  { value: 'set', label: 'Establecer', description: 'Fija el presupuesto a un monto especifico' },
  { value: 'increase', label: 'Incrementar', description: 'Aumenta el presupuesto en un monto' },
  { value: 'decrease', label: 'Reducir', description: 'Reduce el presupuesto en un monto' },
  { value: 'percentage', label: 'Porcentaje', description: 'Ajusta el presupuesto en un porcentaje' },
]

export const WIZARD_STEPS = [
  { id: 1, label: 'Disparador', title: 'Selecciona el tipo de disparador' },
  { id: 2, label: 'Condiciones', title: 'Configura las condiciones' },
  { id: 3, label: 'Accion', title: 'Selecciona el tipo de accion' },
  { id: 4, label: 'Parametros', title: 'Configura los parametros' },
  { id: 5, label: 'Revision', title: 'Revisa y crea la regla' },
]

export const TRIGGER_TYPE_OPTIONS = Object.entries(TRIGGER_CONFIG).map(([value, config]) => ({
  value: value as TriggerType,
  label: config.label,
  icon: config.icon,
  gradient: config.gradient,
  color: config.color,
  description: config.description,
}))

export const ACTION_TYPE_OPTIONS = Object.entries(ACTION_CONFIG).map(([value, config]) => ({
  value: value as ActionType,
  label: config.label,
  icon: config.icon,
  gradient: config.gradient,
  color: config.color,
  description: config.description,
}))
```

## 5. Componentes

### 5.1 AutomationNav.tsx

Mismo patron que AINav.tsx (ver `src/features/ai/components/AINav.tsx`). Navegacion con enlaces a `/automations`, `/automations/new`, `/automations/logs`. Usar iconos: `Bot, PlusCircle, ClipboardList`. Mismo diseno glassmorphism con pill activo.

### 5.2 AutomationSummaryCards.tsx

4 tarjetas estilo dashboard:
- **Total reglas** (icono Bot, gradiente purple)
- **Reglas activas** (icono CheckCircle, gradiente green)
- **Ejecuciones totales** (icono Play, gradiente blue)
- **Ratio exito/fallo** (icono Activity, gradiente amber)

Cada tarjeta formato:
```tsx
<div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
  <div className="flex items-center gap-2 mb-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
      <Icon className="h-4 w-4 text-white" />
    </div>
    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
  </div>
  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
</div>
```

### 5.3 AutomationFilters.tsx

```tsx
interface Props {
  activeFilter: string | undefined
  onFilterChange: (filter: string | undefined) => void
  triggerTypeFilter: string | undefined
  onTriggerTypeChange: (type: string | undefined) => void
  className?: string
}
```

Barra de filtros con:
- Botones: Todas / Activas / Inactivas (mismo estilo que RecommendationsFeed)
- Select de trigger type (filtro opcional)
- Boton "Evaluar todas" que ejecuta `useEvaluateAll`

### 5.4 AutomationListTable.tsx

Tabla de reglas con columnas:
1. **Nombre** + descripcion (truncada)
2. **Disparador** → badge con icono y label de TRIGGER_CONFIG
3. **Accion** → badge con icono y label de ACTION_CONFIG
4. **Ejecuciones** → contador + ultima ejecucion (fecha relativa)
5. **Estado** → ActiveToggle (switch)
6. **Acciones** → botones de ejecutar, ver detalle, eliminar

```tsx
interface Props {
  rules: AutomationRule[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onExecute: (id: string) => void
  className?: string
}
```

Cada fila estilo glassmorphism con hover effect. En mobile convertir a tarjetas (AutomationCard).

### 5.5 AutomationCard.tsx

Version mobile de la fila:
```tsx
interface Props {
  rule: AutomationRule
  onToggle: (id: string) => void
  onExecute: (id: string) => void
  onSelect: (id: string) => void
}
```

### 5.6 ActiveToggle.tsx

Switch animado:
```tsx
interface Props {
  isActive: boolean
  onChange: () => void
  disabled?: boolean
}
```

### 5.7 ManualExecuteButton.tsx

```tsx
interface Props {
  ruleId: string
  onExecute: (id: string) => void
  isPending: boolean
  result?: ExecuteRuleResponse | null
  className?: string
}
```

Boton con icono Play, muestra feedback del resultado (toast ya manejado en hook, pero aqui mostrar check/X inline).

### 5.8 AutomationDetailPanel.tsx

Panel de detalle de una regla (lado derecho en desktop, pantalla completa en mobile):

```tsx
interface Props {
  ruleId: string
  onClose: () => void
  onEdit?: (id: string) => void
}
```

Secciones:
- **Header**: nombre, descripcion, estado badge, toggle
- **Disparador**: tipo + condiciones formateadas
- **Accion**: tipo + parametros formateados
- **Safeguards**: max_executions_per_month, min_balance_required
- **Estadisticas**: execution_count, last_executed_at, last_execution_status
- **Botones**: ejecutar ahora, editar, eliminar (con confirmacion)
- **Logs recientes**: tabla pequena de ExecutionLogViewer filtrada por rule_id

### 5.9 ExecutionLogViewer.tsx

```tsx
interface Props {
  logs: ExecutionLog[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  ruleId?: string // si se pasa, muestra solo logs de esa regla
  className?: string
}
```

Lista de logs con:
- Timestamp (formateado con date-fns: "hace 2 horas")
- Status badge (colores de EXECUTION_STATUS_CONFIG)
- Amount involucrado (si existe, formateado)
- Boton "Ver detalle" que abre modal/drawer con info completa (trigger_snapshot, action_result, error_message)
- Indicador de dry_run si aplica

### 5.10 AutomationEmptyState.tsx

```tsx
interface Props {
  onCreate: () => void
  className?: string
}
```

Estado vacio con icono Bot, mensaje "No hay reglas de automatizacion", CTA "Crear primera regla" y botones de configuracion rapida.

### 5.11 QuickSetupModal.tsx

Modal con 3 pestañas de configuracion rapida:
1. **Ahorro automatico** → form: cuenta origen, cuenta destino, monto, tipo
2. **Pago de tarjeta** → form: tarjeta, cuenta pago, tipo pago, dias antes
3. **Transferencia por saldo** → form: cuenta origen, destino, umbral, direccion, %

```tsx
interface Props {
  open: boolean
  onClose: () => void
}
```

### 5.12 TemplatesList.tsx

```tsx
interface Props {
  onSelect: (triggerType: TriggerType, actionType: ActionType) => void
  className?: string
}
```

Mosaico de tarjetas de plantillas pre-construidas. Data hardcodeada:
- "Ahorro al recibir ingreso" → income_received + transfer
- "Pago automatico de tarjeta" → bill_due_soon + pay_credit_card
- "Proteger saldo minimo" → balance_threshold + transfer
- "Notificar presupuesto excedido" → budget_exceeded + notify
- "Celebrar meta completada" → goal_completed + notify

Cada tarjeta con icono, titulo, descripcion, boton "Usar plantilla".

## 6. Wizard de Creacion (`AutomationCreateWizard.tsx`)

### 6.1 Estructura

```tsx
export default function AutomationCreateWizard() {
  const [step, setStep] = useState(1)
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null)
  const [triggerConditions, setTriggerConditions] = useState<TriggerConditions | null>(null)
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [actionParams, setActionParams] = useState<ActionParams | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxExecutions, setMaxExecutions] = useState<number | undefined>()
  const [minBalance, setMinBalance] = useState<number | undefined>()

  const createMutation = useCreateRule()

  const handleCreate = () => {
    if (!selectedTrigger || !selectedAction) return
    createMutation.mutate({
      name,
      description: description || undefined,
      trigger_type: selectedTrigger,
      trigger_conditions: triggerConditions ?? undefined,
      action_type: selectedAction,
      action_params: actionParams ?? undefined,
      max_executions_per_month: maxExecutions,
      min_balance_required: minBalance,
    })
  }

  // renderizado condicional de pasos
}
```

### 6.2 StepIndicator.tsx

Idem GoalCreateWizard.StepIndicator (circulos numerados con check, lineas conectoras, animaciones). Mismo patron visual.

### 6.3 StepTriggerType.tsx

Selector visual de trigger type (mosaico de 6 tarjetas):
- Cada tarjeta muestra icono grande + label + descripcion
- Gradiente de fondo segun TRIGGER_CONFIG
- Seleccion con ring animado (ring-2 ring-purple-500)
- Boton siguiente

### 6.4 StepTriggerConditions.tsx

Renderiza condicionalmente segun `selectedTrigger`:

```
income_received  → IncomeReceivedCondition
balance_threshold → BalanceThresholdCondition
date_scheduled   → DateScheduledCondition
bill_due_soon    → BillDueSoonCondition
budget_exceeded  → BudgetExceededCondition
goal_completed   → GoalCompletedCondition
```

Cada condition component es un mini-formulario con los campos necesarios.

**IncomeReceivedCondition.tsx:**
```tsx
interface Props {
  value: IncomeReceivedConditions | null
  onChange: (conditions: IncomeReceivedConditions) => void
}
```
Campos: monto minimo (number input), categoria (CategoryPicker opcional)

**BalanceThresholdCondition.tsx:**
Campos: cuenta (AccountSelector), umbral (number), direccion (select: above/below)

**DateScheduledCondition.tsx:**
Campos: dia del mes (number input 1-28), meses (multi-select con checkboxes de Ene-Dic)

**BillDueSoonCondition.tsx:**
Campos: tarjeta (CreditCardSelector), dias antes (number input)

**BudgetExceededCondition.tsx:**
Campos: presupuesto (BudgetSelector), porcentaje umbral (slider 0-100 con label)

**GoalCompletedCondition.tsx:**
Campos: meta (GoalSelector)

### 6.5 StepActionType.tsx

Mismo patron que StepTriggerType pero con acciones (5 tarjetas).

### 6.6 StepActionParams.tsx

Renderiza condicionalmente segun `selectedAction`:

```
transfer          → TransferActionParams
pay_credit_card   → PayCreditCardActionParams
create_transaction → CreateTransactionActionParams
notify            → NotifyActionParams
adjust_budget     → AdjustBudgetActionParams
```

**TransferActionParams.tsx:**
Cuenta origen (AccountSelector), cuenta destino (AccountSelector), monto (number), tipo monto (select con AMOUNT_TYPE_OPTIONS)

**PayCreditCardActionParams.tsx:**
Tarjeta (CreditCardSelector), cuenta pago (AccountSelector), tipo pago (select con PAYMENT_TYPE_OPTIONS), monto custom (number, solo si payment_type='custom')

**CreateTransactionActionParams.tsx:**
Cuenta (AccountSelector), categoria (CategoryPicker opcional), monto (number), descripcion (text), tipo (expense/income)

**NotifyActionParams.tsx:**
Mensaje (textarea), titulo (input opcional), canal (select opcional: push/email/telegram/discord)

**AdjustBudgetActionParams.tsx:**
Presupuesto (BudgetSelector), tipo ajuste (select con ADJUSTMENT_TYPE_OPTIONS), monto objetivo (number)

### 6.7 StepReview.tsx

Resumen visual de toda la regla antes de crear:
- Nombre (input editable)
- Descripcion (textarea editable)
- Disparador: tipo + condiciones formateadas como bullet points
- Accion: tipo + parametros formateados como bullet points
- Safeguards: max_executions_per_month (input), min_balance_required (input)
- Boton "Crear regla"

### 6.8 Nota importante sobre los selectores

Necesitas crear componentes selector ligeros que consulten sus respectivos hooks. Ya existen hooks como:
- `useAccounts()` → `AccountSelector` (puedes crear uno simple en automations o reutilizar)
- `useCards()` en `@/features/cards/hooks/useCards`
- `useBudgets()` en `@/features/budgets/hooks/useBudgets`
- `useGoals()` en `@/features/goals/hooks/useGoals`
- `useCategories()` en `@/features/categories/hooks/useCategories`

Crea wrappers simples inline en los condition/param builders usando esos hooks.

## 7. Construir los Selectores

Para evitar imports pesados, crea small selectors within the same folder or use this pattern in each builder:

```tsx
// Ejemplo para AccountSelector inline:
import { useAccounts } from '@/features/accounts/hooks/useAccounts'

function AccountSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const { data } = useAccounts()
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
      >
        <option value="">Seleccionar...</option>
        {data?.accounts?.map((a: { id: string; name: string }) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </div>
  )
}
```

## 8. Paginas

### 8.1 AutomationListPage.tsx

```tsx
function AutomationListPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useAutomations()
  const { data: summary } = useAutomationSummary()
  const [filter, setFilter] = useState<string | undefined>()
  const [triggerFilter, setTriggerFilter] = useState<string | undefined>()
  const deleteMutation = useDeleteRule()
  const toggleMutation = useToggleRule()
  const executeMutation = useExecuteRule()
  const evaluateMutation = useEvaluateAll()

  const filteredData = useMemo(() => { /* apply client-side filters */ }, [data, filter, triggerFilter])

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      {/* Background orbs (purple/indigo/violet theme) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/dashboard" />
        <AIPageHeader title="Automatizaciones" subtitle="Reglas IF/THEN para automatizar tus finanzas" className="flex-1">
          <button onClick={() => navigate('/automations/new')} className="...">
            <PlusCircle className="h-4 w-4" /> Nueva regla
          </button>
          <button onClick={() => evaluateMutation.mutate()} className="...">
            <Play className="h-4 w-4" /> Evaluar todas
          </button>
        </AIPageHeader>
      </div>

      <AutomationNav />
      <AutomationSummaryCards summary={summary} />
      <AutomationFilters ... />
      <AutomationListTable ... />
    </div>
  )
}
```

### 8.2 AutomationCreatePage.tsx

Wrapper minimal que renderiza `AutomationCreateWizard`.

### 8.3 AutomationDetailPage.tsx

```tsx
function AutomationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: rule, isLoading, isError, refetch } = useAutomation(id)
  const { data: logs } = useExecutionLogs({ rule_id: id, limit: 20 })

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      {/* Background orbs */}
      ...
      <div className="flex items-center gap-2">
        <BackButton to="/automations" />
        <AIPageHeader title={rule?.name || 'Detalle'} subtitle="Regla de automatizacion" className="flex-1" />
      </div>
      <AutomationNav />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AutomationDetailPanel ruleId={id!} onClose={() => navigate('/automations')} />
        </div>
        <div>
          <h3 className="...">Logs de ejecucion</h3>
          <ExecutionLogViewer logs={logs?.logs} ... />
        </div>
      </div>
    </div>
  )
}
```

## 9. Rutas a actualizar

### 9.1 `src/routes/lazy.ts` — Agregar:

```typescript
export const AutomationListPage = lazy(() => import('@/features/automations/pages/AutomationListPage'))
export const AutomationCreatePage = lazy(() => import('@/features/automations/pages/AutomationCreatePage'))
export const AutomationDetailPage = lazy(() => import('@/features/automations/pages/AutomationDetailPage'))
```

### 9.2 `src/routes/index.tsx` — Reemplazar PlaceholderPages:

```typescript
import { ..., AutomationListPage, AutomationCreatePage, AutomationDetailPage } from './lazy'

// En la seccion de rutas:
// Automations
{
  path: '/automations',
  element: (<SuspenseWrapper><AutomationListPage /></SuspenseWrapper>),
},
{
  path: '/automations/new',
  element: (<SuspenseWrapper><AutomationCreatePage /></SuspenseWrapper>),
},
{
  path: '/automations/:id',
  element: (<SuspenseWrapper><AutomationDetailPage /></SuspenseWrapper>),
},
```

## 10. Forma de los Endpoints (resumen)

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | /automations | query: is_active, trigger_type | { rules: [...], total: N } |
| POST | /automations | body: CreateRuleRequest | { id, name, trigger_type, action_type, is_active, message } |
| GET | /automations/templates | - | { triggers: [...], actions: [...] } |
| GET | /automations/summary | - | { total_rules, active_rules, total_executions, ... } |
| GET | /automations/execution-log | query: rule_id, limit | { logs: [...], total: N } |
| GET | /automations/execution-log/:id | - | ExecutionLog |
| GET | /automations/:id | - | AutomationRule |
| PUT | /automations/:id | body: fields parciales | { id, name, message } |
| DELETE | /automations/:id | - | { message } |
| POST | /automations/:id/toggle | - | { id, name, is_active, message } |
| POST | /automations/:id/execute | query: dry_run | { rule_id, rule_name, status, result/error } |
| POST | /automations/evaluate | query: dry_run | { total_rules, executed, skipped, failed, results: [...] } |
| POST | /automations/quick/savings-transfer | body | { id, name, message } |
| POST | /automations/quick/card-payment | body | { id, name, message } |
| POST | /automations/quick/balance-transfer | body | { id, name, message } |

## 11. Diseno UI (mismo patron que AI features)

- **Glassmorphism**: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-700/80`
- **Gradient icon boxes**: `h-9 w-9 rounded-xl bg-gradient-to-br shadow-lg`
- **Cards hover**: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- **Badges**: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold`
- **Animated backgrounds**: orbs with `animate-[pulse_Xs_ease-in-out_infinite]`
- **Typography**: `tracking-tight` para titulos, `tracking-wider uppercase text-xs` para labels de seccion
- **Colores**: purple/indigo/violet theme para automations (consistente con AI)

## 12. Consideraciones adicionales

### Wizard State Management
Usa `useState` en el wizard para cada paso. No necesitas React Hook Form ni Zod porque cada paso es independiente y submit es solo al final.

### Confirmacion de eliminacion
Usa el patron de confirmacion dialog del proyecto (window.confirm o un modal custom). Ejemplo:
```tsx
const confirmDelete = (id: string, name: string) => {
  if (window.confirm(`Eliminar la regla "${name}"?`)) {
    deleteMutation.mutate(id)
  }
}
```

### Manejo de errores
El backend devuelve errores en formato `{ error: "mensaje" }` cuando algo falla (trigger invalido, regla no encontrada, etc). Muestra estos errores con toast.

### Optimistic updates for toggle
Para el toggle activo/inactivo puedes usar `onMutate` para actualizar el cache optimistamente antes de la respuesta del servidor.

### Seguridad
- Safeguards: `max_executions_per_month` y `min_balance_required` son campos opcionales pero importantes. Asegurate de incluirlos en el wizard paso 5 (Review).
- No permitir eliminar reglas sin confirmacion.
- El boton "Ejecutar ahora" simula una ejecucion manual, no afecta saldos reales a menos que `dry_run=false`.

### Responsive
- Desktop: tabla + panel de detalle lateral
- Mobile: tarjetas (AutomationCard) + detalle en pagina completa

## 13. Checklist de implementacion

- [ ] `src/types/automations.ts` — todos los tipos
- [ ] `src/features/automations/api/automations.ts` — 15 funciones API
- [ ] `src/features/automations/hooks/useAutomations.ts` — 11 queries + 9 mutations
- [ ] `src/features/automations/constants.ts` — TRIGGER_CONFIG, ACTION_CONFIG, etc.
- [ ] `src/features/automations/components/AutomationNav.tsx`
- [ ] `src/features/automations/components/AutomationSummaryCards.tsx`
- [ ] `src/features/automations/components/AutomationFilters.tsx`
- [ ] `src/features/automations/components/AutomationListTable.tsx`
- [ ] `src/features/automations/components/AutomationCard.tsx`
- [ ] `src/features/automations/components/AutomationEmptyState.tsx`
- [ ] `src/features/automations/components/ActiveToggle.tsx`
- [ ] `src/features/automations/components/ManualExecuteButton.tsx`
- [ ] `src/features/automations/components/AutomationDetailPanel.tsx`
- [ ] `src/features/automations/components/ExecutionLogViewer.tsx`
- [ ] `src/features/automations/components/TemplatesList.tsx`
- [ ] `src/features/automations/components/QuickSetupModal.tsx`
- [ ] Wizard components (12 archivos en CreateWizard/)
- [ ] `src/features/automations/pages/AutomationListPage.tsx`
- [ ] `src/features/automations/pages/AutomationCreatePage.tsx`
- [ ] `src/features/automations/pages/AutomationDetailPage.tsx`
- [ ] Actualizar `src/routes/lazy.ts` (3 imports)
- [ ] Actualizar `src/routes/index.tsx` (3 rutas)
- [ ] Verificar `tsc --noEmit` pasa
- [ ] Verificar navegacion completa (list → create → detail → logs)
