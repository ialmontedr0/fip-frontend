import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as simulationsApi from '../api/simulations'
import type { CreateSimulationRequest } from '@/types/goals'

export const simulationKeys = {
  all: (goalId: string) => ['goal-simulations', goalId] as const,
  list: (goalId: string) => [...simulationKeys.all(goalId), 'list'] as const,
  detail: (goalId: string, simId: string) => [...simulationKeys.all(goalId), 'detail', simId] as const,
}

export function useSimulation(goalId: string | undefined, simulationId: string | undefined) {
  return useQuery({
    queryKey: simulationKeys.detail(goalId!, simulationId!),
    queryFn: () => simulationsApi.getSimulation(goalId!, simulationId!).then((r) => r.data),
    enabled: !!goalId && !!simulationId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSimulations(goalId: string | undefined) {
  return useQuery({
    queryKey: simulationKeys.list(goalId!),
    queryFn: () => simulationsApi.listSimulations(goalId!).then((r) => r.data),
    enabled: !!goalId,
    staleTime: 1000 * 60,
  })
}

export function useCreateSimulation(goalId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSimulationRequest) =>
      simulationsApi.createSimulation(goalId, data),
    onSuccess: (_data, variables) => {
      if (variables.preview) return
      queryClient.invalidateQueries({ queryKey: simulationKeys.list(goalId) })
      toast.success('Simulacion creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la simulacion')
    },
  })
}

export function useDeleteSimulation(goalId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (simulationId: string) =>
      simulationsApi.deleteSimulation(goalId, simulationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simulationKeys.list(goalId) })
      toast.success('Simulacion eliminada')
    },
    onError: () => toast.error('Error al eliminar la simulacion'),
  })
}
