import api from '@/lib/api'
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleResponse,
  ListScheduleResponse,
  ReceiveScheduleRequest,
  ProjectedIncomeResponse,
  IncomeResponse,
} from '@/types/incomes'

export function createSchedule(data: CreateScheduleRequest) {
  return api.post<ScheduleResponse>('/incomes/schedule', data)
}

export function listSchedules(params?: { status?: string; date_from?: string; date_to?: string }) {
  return api.get<ListScheduleResponse>('/incomes/schedule', { params })
}

export function getProjectedIncome(months = 6) {
  return api.get<ProjectedIncomeResponse>('/incomes/schedule/projected', { params: { months } })
}

export function receiveScheduled(scheduleId: string, data: ReceiveScheduleRequest) {
  return api.post<IncomeResponse>(`/incomes/schedule/${scheduleId}/receive`, data)
}

export function updateSchedule(id: string, data: UpdateScheduleRequest) {
  return api.patch<ScheduleResponse>(`/incomes/schedule/${id}`, data)
}

export function deleteSchedule(id: string) {
  return api.delete<{ message: string }>(`/incomes/schedule/${id}`)
}
