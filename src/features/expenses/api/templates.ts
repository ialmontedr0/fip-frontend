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
