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

export function listExecutionLogs(params?: { rule_id?: string; limit?: number }) {
  return api.get<ListExecutionLogsResponse>('/automations/execution-log', { params })
}

export function getExecutionLog(id: string) {
  return api.get<ExecutionLogDetailResponse>(`/automations/execution-log/${id}`)
}

export function getTemplates() {
  return api.get<TemplatesResponse>('/automations/templates')
}

export function getSummary() {
  return api.get<AutomationSummary>('/automations/summary')
}

export function quickSavingsTransfer(data: QuickSavingsTransferRequest) {
  return api.post<QuickSetupResponse>('/automations/quick/savings-transfer', data)
}

export function quickCardPayment(data: QuickCardPaymentRequest) {
  return api.post<QuickSetupResponse>('/automations/quick/card-payment', data)
}

export function quickBalanceTransfer(data: QuickBalanceTransferRequest) {
  return api.post<QuickSetupResponse>('/automations/quick/balance-transfer', data)
}
