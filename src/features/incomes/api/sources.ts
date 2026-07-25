import api from '@/lib/api'
import type {
  CreateSourceRequest,
  UpdateSourceRequest,
  SourceResponse,
  ListSourcesResponse,
  IncomeResponse,
} from '@/types/incomes'

export function createSource(data: CreateSourceRequest) {
  return api.post<SourceResponse>('/incomes/sources', data)
}

export function listSources(params?: { is_active?: boolean; income_type?: string }) {
  return api.get<ListSourcesResponse>('/incomes/sources', { params })
}

export function getSource(id: string) {
  return api.get<SourceResponse>(`/incomes/sources/${id}`)
}

export function updateSource(id: string, data: UpdateSourceRequest) {
  return api.patch<SourceResponse>(`/incomes/sources/${id}`, data)
}

export function deleteSource(id: string) {
  return api.delete<{ message: string }>(`/incomes/sources/${id}`)
}

export function createIncomeFromSource(sourceId: string, data: { received_date?: string; amount?: string | null; notes?: string | null }) {
  return api.post<IncomeResponse>(`/incomes/sources/${sourceId}/create-income`, data)
}
