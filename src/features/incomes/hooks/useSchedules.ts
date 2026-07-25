import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as schedulesApi from '../api/schedules'
import { incomeKeys } from './useIncomes'
import { sourceKeys } from './useSources'
import type { CreateScheduleRequest, UpdateScheduleRequest, ReceiveScheduleRequest } from '@/types/incomes'

export const scheduleKeys = {
  all: ['income-schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...scheduleKeys.lists(), filters] as const,
  projected: () => [...scheduleKeys.all, 'projected'] as const,
}

export function useSchedules(params?: { status?: string; date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: scheduleKeys.list(params as Record<string, unknown>),
    queryFn: () => schedulesApi.listSchedules(params).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useProjectedIncome(months = 6) {
  return useQuery({
    queryKey: scheduleKeys.projected(),
    queryFn: () => schedulesApi.getProjectedIncome(months).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => schedulesApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: scheduleKeys.projected() })
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sourceKeys.details() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Programacion creada exitosamente')
    },
    onError: () => toast.error('Error al crear la programacion'),
  })
}

export function useReceiveScheduled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: ReceiveScheduleRequest }) =>
      schedulesApi.receiveScheduled(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: scheduleKeys.projected() })
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sourceKeys.details() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Ingreso recibido exitosamente')
    },
    onError: () => toast.error('Error al marcar como recibido'),
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
      schedulesApi.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      toast.success('Programacion actualizada')
    },
    onError: () => toast.error('Error al actualizar'),
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => schedulesApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      toast.success('Programacion eliminada')
    },
    onError: () => toast.error('Error al eliminar'),
  })
}
