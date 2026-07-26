import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loansApi } from '../api/loans'
import type {
  CreateLoanRequest,
  UpdateLoanRequest,
  SimulateLoanRequest,
} from '@/types/loans'

const keys = {
  all: ['loans'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
  summaries: () => [...keys.all, 'summary'] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
}

export function useLoanList(filters?: { status?: string; loan_type?: string }) {
  return useQuery({
    queryKey: keys.list(filters as Record<string, unknown> | undefined),
    queryFn: () => loansApi.list(filters),
  })
}

export function useLoanSummary() {
  return useQuery({
    queryKey: keys.summaries(),
    queryFn: () => loansApi.summary(),
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => loansApi.get(id),
    enabled: !!id,
  })
}

export function useCreateLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLoanRequest) => loansApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.summaries() })
    },
  })
}

export function useUpdateLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoanRequest }) =>
      loansApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useDeleteLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => loansApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useUpdateLoanStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      loansApi.updateStatus(id, { status: status as any }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useSimulateLoan() {
  return useMutation({
    mutationFn: (data: SimulateLoanRequest) => loansApi.simulate(data),
  })
}
