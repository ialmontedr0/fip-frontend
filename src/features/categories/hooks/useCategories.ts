import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as categoriesApi from '../api/categories'
import type { CreateCategoryRequest, UpdateCategoryRequest, AICategorizeRequest, CreateSubcategoryRequest, UpdateSubcategoryRequest } from '@/types/categories'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  stats: () => [...categoryKeys.all, 'stats'] as const,
}

export function useCategories(params?: { category_type?: string; include_inactive?: boolean }) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesApi.listCategories(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => categoriesApi.getCategory(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCategoryStats() {
  return useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: () => categoriesApi.getCategoryStats().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() })
      toast.success('Categoria creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (
        error as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message
      toast.error(message || 'Error al crear la categoria')
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
      toast.success('Categoria actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la categoria'),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() })
      toast.success('Categoria eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la categoria'),
  })
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateSubcategoryRequest }) =>
      categoriesApi.createSubcategory(categoryId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.categoryId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Subcategoria creada exitosamente')
    },
    onError: () => toast.error('Error al crear la subcategoria'),
  })
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ subcategoryId, data }: { subcategoryId: string; data: UpdateSubcategoryRequest }) =>
      categoriesApi.updateSubcategory(subcategoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.details() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Subcategoria actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la subcategoria'),
  })
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subcategoryId: string) => categoriesApi.deleteSubcategory(subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.details() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Subcategoria eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la subcategoria'),
  })
}

export function useAICategorization() {
  return useMutation({
    mutationFn: (data: AICategorizeRequest) =>
      categoriesApi.categorizeDescription(data).then((r) => r.data),
  })
}
