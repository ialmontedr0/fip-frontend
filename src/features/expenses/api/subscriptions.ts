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
