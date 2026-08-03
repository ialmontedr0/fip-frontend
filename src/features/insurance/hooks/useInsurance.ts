import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { insuranceApi } from '../api/insurance'
import type {
  CreateInsurancePolicyRequest,
  CreateInsurancePremiumRequest,
  CreateInsuranceRequest,
  MarkPremiumPaidRequest,
  UpdateInsuranceRequest,
  UpdateInsuranceStatusRequest,
} from '@/types/insurance'

const keys = {
  all: ['insurance'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
  dashboards: () => [...keys.all, 'dashboard'] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
  policies: (id: string) => [...keys.detail(id), 'policies'] as const,
  premiums: (id: string) => [...keys.detail(id), 'premiums'] as const,
}

export function useInsuranceList(filters?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: keys.list(filters as Record<string, unknown> | undefined),
    queryFn: () => insuranceApi.list(filters),
  })
}

export function useInsuranceDashboard() {
  return useQuery({
    queryKey: keys.dashboards(),
    queryFn: () => insuranceApi.dashboard(),
  })
}

export function useInsurance(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => insuranceApi.get(id),
    enabled: !!id,
  })
}

export function useCreateInsurance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInsuranceRequest) => insuranceApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.dashboards() })
    },
  })
}

export function useUpdateInsurance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsuranceRequest }) =>
      insuranceApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.lists() })
      qc.invalidateQueries({ queryKey: keys.dashboards() })
    },
  })
}

export function useDeleteInsurance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => insuranceApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
      qc.invalidateQueries({ queryKey: keys.dashboards() })
    },
  })
}

export function useUpdateInsuranceStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsuranceStatusRequest }) =>
      insuranceApi.updateStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useInsurancePolicies(id: string) {
  return useQuery({
    queryKey: keys.policies(id),
    queryFn: () => insuranceApi.listPolicies(id),
    enabled: !!id,
  })
}

export function useCreateInsurancePolicy(insuranceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInsurancePolicyRequest) => insuranceApi.createPolicy(insuranceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.policies(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.detail(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useDeleteInsurancePolicy(insuranceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (policyId: string) => insuranceApi.deletePolicy(insuranceId, policyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.policies(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.detail(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.lists() })
    },
  })
}

export function useInsurancePremiums(id: string, params?: { status?: string }) {
  return useQuery({
    queryKey: keys.premiums(id),
    queryFn: () => insuranceApi.listPremiums(id, params),
    enabled: !!id,
  })
}

export function useCreateInsurancePremium(insuranceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInsurancePremiumRequest) => insuranceApi.createPremium(insuranceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.premiums(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.detail(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.dashboards() })
    },
  })
}

export function useMarkPremiumPaid(insuranceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ premiumId, data }: { premiumId: string; data: MarkPremiumPaidRequest }) =>
      insuranceApi.markPremiumPaid(insuranceId, premiumId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.premiums(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.detail(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.dashboards() })
    },
  })
}

export function useDeleteInsurancePremium(insuranceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (premiumId: string) => insuranceApi.deletePremium(insuranceId, premiumId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.premiums(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.detail(insuranceId) })
      qc.invalidateQueries({ queryKey: keys.dashboards() })
    },
  })
}
