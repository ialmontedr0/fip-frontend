import api from '@/lib/api'
import type {
  CreateInsurancePolicyRequest,
  CreateInsurancePremiumRequest,
  CreateInsuranceRequest,
  InsuranceDashboardResponse,
  InsuranceDetail,
  InsurancePolicy,
  InsurancePremium,
  ListInsurancesResponse,
  ListPoliciesResponse,
  ListPremiumsResponse,
  MarkPremiumPaidRequest,
  UpdateInsuranceRequest,
  UpdateInsuranceStatusRequest,
} from '@/types/insurance'

export const insuranceApi = {
  list: (params?: { status?: string; type?: string }) =>
    api.get<ListInsurancesResponse>('/insurance', { params }).then((r) => r.data),

  dashboard: () =>
    api.get<InsuranceDashboardResponse>('/insurance/dashboard').then((r) => r.data),

  get: (id: string) =>
    api.get<InsuranceDetail>(`/insurance/${id}`).then((r) => r.data),

  create: (data: CreateInsuranceRequest) =>
    api.post<InsuranceDetail>('/insurance', data).then((r) => r.data),

  update: (id: string, data: UpdateInsuranceRequest) =>
    api.patch<InsuranceDetail>(`/insurance/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/insurance/${id}`).then((r) => r.data),

  updateStatus: (id: string, data: UpdateInsuranceStatusRequest) =>
    api.patch(`/insurance/${id}/status`, data).then((r) => r.data),

  listPolicies: (id: string) =>
    api.get<ListPoliciesResponse>(`/insurance/${id}/policies`).then((r) => r.data),

  createPolicy: (id: string, data: CreateInsurancePolicyRequest) =>
    api.post<InsurancePolicy>(`/insurance/${id}/policies`, data).then((r) => r.data),

  deletePolicy: (insuranceId: string, policyId: string) =>
    api.delete(`/insurance/${insuranceId}/policies/${policyId}`).then((r) => r.data),

  listPremiums: (id: string, params?: { status?: string }) =>
    api.get<ListPremiumsResponse>(`/insurance/${id}/premiums`, { params }).then((r) => r.data),

  createPremium: (id: string, data: CreateInsurancePremiumRequest) =>
    api.post<InsurancePremium>(`/insurance/${id}/premiums`, data).then((r) => r.data),

  markPremiumPaid: (insuranceId: string, premiumId: string, data: MarkPremiumPaidRequest = {}) =>
    api.patch<InsurancePremium>(`/insurance/${insuranceId}/premiums/${premiumId}`, data).then((r) => r.data),

  deletePremium: (insuranceId: string, premiumId: string) =>
    api.delete(`/insurance/${insuranceId}/premiums/${premiumId}`).then((r) => r.data),
}
