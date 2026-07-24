import api from '@/lib/api'
import type {
  RecurringResponse, ListRecurringResponse,
  DeleteRecurringResponse, ProcessRecurringResponse,
  CreateRecurringRequest, UpdateRecurringRequest,
} from '@/types/transactions'

export function createRecurring(data: CreateRecurringRequest) {
  return api.post<RecurringResponse>('/transactions/recurring', data)
}

export function listRecurring(params?: { is_active?: boolean }) {
  return api.get<ListRecurringResponse>('/transactions/recurring', { params })
}

export function getRecurring(id: string) {
  return api.get<RecurringResponse>(`/transactions/recurring/${id}`)
}

export function updateRecurring(id: string, data: UpdateRecurringRequest) {
  return api.patch<RecurringResponse>(`/transactions/recurring/${id}`, data)
}

export function deleteRecurring(id: string) {
  return api.delete<DeleteRecurringResponse>(`/transactions/recurring/${id}`)
}

export function processRecurring() {
  return api.post<ProcessRecurringResponse>('/transactions/recurring/process')
}
