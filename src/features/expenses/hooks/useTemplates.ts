import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as templatesApi from '../api/templates'
import { expenseKeys } from './useExpenses'
import type { CreateTemplateRequest, CreateFromTemplateRequest } from '@/types/expenses'

export const templateKeys = {
  all: ['expense-templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
}

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => templatesApi.listTemplates().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templatesApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      toast.success('Plantilla creada exitosamente')
    },
    onError: () => toast.error('Error al crear la plantilla'),
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => templatesApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      toast.success('Plantilla eliminada')
    },
    onError: () => toast.error('Error al eliminar la plantilla'),
  })
}

export function useCreateExpenseFromTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: CreateFromTemplateRequest }) =>
      templatesApi.createExpenseFromTemplate(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Gasto creado desde plantilla')
    },
    onError: () => toast.error('Error al crear gasto desde plantilla'),
  })
}
