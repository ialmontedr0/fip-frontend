import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taxesApi } from '../api/taxes'
import type {
  CreateTaxCategoryRequest,
  CreateTaxDeductionRequest,
  UpdateTaxDeductionRequest,
} from '@/types/taxes'

const keys = {
  all: ['taxes'] as const,
  categoryLists: () => [...keys.all, 'categories'] as const,
  categoryList: (filters?: Record<string, unknown>) =>
    [...keys.categoryLists(), filters] as const,
  deductionLists: () => [...keys.all, 'deductions'] as const,
  deductionList: (filters?: Record<string, unknown>) =>
    [...keys.deductionLists(), filters] as const,
  deductionDetail: (id: string) => [...keys.all, 'deductions', id] as const,
  summaries: () => [...keys.all, 'summary'] as const,
  summary: (year?: number) => [...keys.summaries(), year] as const,
}

export function useTaxCategories(taxYear?: number) {
  return useQuery({
    queryKey: keys.categoryList(taxYear ? { tax_year: taxYear } : undefined),
    queryFn: () => taxesApi.listCategories(taxYear ? { tax_year: taxYear } : undefined),
  })
}

export function useCreateTaxCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaxCategoryRequest) => taxesApi.createCategory(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.categoryLists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useDeleteTaxCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => taxesApi.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.categoryLists() })
      qc.invalidateQueries({ queryKey: keys.deductionLists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useTaxDeductions(filters?: { tax_year?: number; category_id?: string }) {
  return useQuery({
    queryKey: keys.deductionList(filters as Record<string, unknown> | undefined),
    queryFn: () => taxesApi.listDeductions(filters),
  })
}

export function useTaxDeduction(id: string) {
  return useQuery({
    queryKey: keys.deductionDetail(id),
    queryFn: () => taxesApi.getDeduction(id),
    enabled: !!id,
  })
}

export function useCreateTaxDeduction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaxDeductionRequest) => taxesApi.createDeduction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.deductionLists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useUpdateTaxDeduction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaxDeductionRequest }) =>
      taxesApi.updateDeduction(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.deductionDetail(id) })
      qc.invalidateQueries({ queryKey: keys.deductionLists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useDeleteTaxDeduction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => taxesApi.deleteDeduction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.deductionLists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useTaxSummary(year: number) {
  return useQuery({
    queryKey: keys.summary(year),
    queryFn: () => taxesApi.summary(year),
    enabled: !!year,
  })
}
