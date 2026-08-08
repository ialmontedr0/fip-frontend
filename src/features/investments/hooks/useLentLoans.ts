import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { lentLoansApi } from '../api/lentLoans'
import type {
  CreateLentLoanRequest,
  RecordLentLoanPaymentRequest,
  SimulateLentLoanRequest,
} from '@/types/lentLoan'

const keys = {
  all: ['lent-loans'] as const,
  list: () => [...keys.all, 'list'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
  summary: () => [...keys.all, 'summary'] as const,
  receivables: () => [...keys.all, 'receivables'] as const,
}

export function useLentLoans(status?: string) {
  return useQuery({
    queryKey: [...keys.list(), status],
    queryFn: () => lentLoansApi.list({ status }),
  })
}

export function useLentLoan(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => lentLoansApi.get(id),
    enabled: !!id,
  })
}

export function useLentLoanSummary() {
  return useQuery({
    queryKey: keys.summary(),
    queryFn: () => lentLoansApi.summary(),
  })
}

export function useLentLoanReceivables() {
  return useQuery({
    queryKey: keys.receivables(),
    queryFn: () => lentLoansApi.receivables(),
  })
}

export function useSimulateLentLoan() {
  return useMutation({
    mutationFn: (data: SimulateLentLoanRequest) => lentLoansApi.simulate(data),
  })
}

export function useCreateLentLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLentLoanRequest) => lentLoansApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.list() })
      qc.invalidateQueries({ queryKey: keys.summary() })
      qc.invalidateQueries({ queryKey: keys.receivables() })
      qc.invalidateQueries({ queryKey: ['investments', 'summary'] })
      toast.success('Préstamo otorgado creado')
    },
    onError: () => toast.error('Error al crear el préstamo'),
  })
}

export function useRecordLentLoanPayment(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RecordLentLoanPaymentRequest) => lentLoansApi.recordPayment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.list() })
      qc.invalidateQueries({ queryKey: keys.summary() })
      qc.invalidateQueries({ queryKey: keys.receivables() })
      qc.invalidateQueries({ queryKey: ['investments', 'summary'] })
      toast.success('Pago recibido registrado')
    },
    onError: () => toast.error('Error al registrar el pago'),
  })
}

export function useDeleteLentLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lentLoansApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.list() })
      qc.invalidateQueries({ queryKey: keys.summary() })
      qc.invalidateQueries({ queryKey: keys.receivables() })
      qc.invalidateQueries({ queryKey: ['investments', 'summary'] })
      toast.success('Préstamo eliminado')
    },
    onError: () => toast.error('Error al eliminar el préstamo'),
  })
}
