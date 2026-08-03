import api from '@/lib/api'
import type {
  CreateTaxCategoryRequest,
  CreateTaxDeductionRequest,
  ListTaxCategoriesResponse,
  ListTaxDeductionsResponse,
  TaxCategory,
  TaxDeduction,
  TaxSummaryResponse,
  UpdateTaxDeductionRequest,
} from '@/types/taxes'

export const taxesApi = {
  listCategories: (params?: { tax_year?: number }) =>
    api.get<ListTaxCategoriesResponse>('/taxes/categories', { params }).then((r) => r.data),

  createCategory: (data: CreateTaxCategoryRequest) =>
    api.post<TaxCategory>('/taxes/categories', data).then((r) => r.data),

  deleteCategory: (id: string) =>
    api.delete(`/taxes/categories/${id}`).then((r) => r.data),

  listDeductions: (params?: { tax_year?: number; category_id?: string }) =>
    api.get<ListTaxDeductionsResponse>('/taxes/deductions', { params }).then((r) => r.data),

  getDeduction: (id: string) =>
    api.get<TaxDeduction>(`/taxes/deductions/${id}`).then((r) => r.data),

  createDeduction: (data: CreateTaxDeductionRequest) =>
    api.post<TaxDeduction>('/taxes/deductions', data).then((r) => r.data),

  updateDeduction: (id: string, data: UpdateTaxDeductionRequest) =>
    api.patch<TaxDeduction>(`/taxes/deductions/${id}`, data).then((r) => r.data),

  deleteDeduction: (id: string) =>
    api.delete(`/taxes/deductions/${id}`).then((r) => r.data),

  summary: (year: number) =>
    api.get<TaxSummaryResponse>(`/taxes/summary/${year}`).then((r) => r.data),
}
