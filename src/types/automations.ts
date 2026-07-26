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
