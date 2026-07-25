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
