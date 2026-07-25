import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as servicesApi from '../api/services'
import { expenseKeys } from './useExpenses'
import type { CreateServiceRequest, MarkServicePaidRequest } from '@/types/expenses'

export const serviceKeys = {
  all: ['expense-services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...serviceKeys.lists(), filters] as const,
  upcoming: () => [...serviceKeys.all, 'upcoming'] as const,
}

export function useServices(params?: { service_type?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: serviceKeys.list(params as Record<string, unknown>),
    queryFn: () => servicesApi.listServices(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useUpcomingServices(daysAhead = 30) {
  return useQuery({
    queryKey: serviceKeys.upcoming(),
    queryFn: () => servicesApi.getUpcomingServices(daysAhead).then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Servicio creado exitosamente')
    },
    onError: () => toast.error('Error al crear el servicio'),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateServiceRequest> }) =>
      servicesApi.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Servicio actualizado')
    },
    onError: () => toast.error('Error al actualizar el servicio'),
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Servicio eliminado')
    },
    onError: () => toast.error('Error al eliminar el servicio'),
  })
}

export function useMarkServicePaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkServicePaidRequest }) =>
      servicesApi.markServicePaid(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.upcoming() })
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Servicio marcado como pagado')
    },
    onError: () => toast.error('Error al marcar como pagado'),
  })
}
