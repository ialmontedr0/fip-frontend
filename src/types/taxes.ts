export const TAX_YEAR_MIN = 1900
export const TAX_YEAR_MAX = 2200

export const TAX_CATEGORY_COLORS: string[] = [
  '#6366f1',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#3b82f6',
  '#14b8a6',
  '#f97316',
  '#84cc16',
  '#06b6d4',
  '#ec4899',
]

export function taxCategoryColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % TAX_CATEGORY_COLORS.length
  return TAX_CATEGORY_COLORS[index]
}

export interface TaxCategory {
  id: string
  name: string
  tax_year: number
  description: string | null
  deduction_count: number
  created_at: string | null
}

export interface CreateTaxCategoryRequest {
  name: string
  tax_year: number
  description?: string | null
}

export interface ListTaxCategoriesResponse {
  categories: TaxCategory[]
  total: number
}

export interface TaxDeduction {
  id: string
  category_id: string | null
  category_name: string | null
  description: string
  amount: number
  date: string
  deductible: number | null
  tax_year: number
  receipt_url: string | null
  created_at: string | null
}

export interface CreateTaxDeductionRequest {
  description: string
  amount: number
  date: string
  tax_year: number
  category_id?: string | null
  deductible?: number | null
  receipt_url?: string | null
}

export interface UpdateTaxDeductionRequest {
  description?: string
  amount?: number
  date?: string
  tax_year?: number
  category_id?: string | null
  deductible?: number | null
  receipt_url?: string | null
}

export interface ListTaxDeductionsResponse {
  deductions: TaxDeduction[]
  total: number
}

export interface TaxSummaryByCategory {
  category: string
  total: number
}

export interface TaxSummaryResponse {
  year: number
  total_deductions: number
  total_deductible: number
  deduction_count: number
  by_category: TaxSummaryByCategory[]
}
