export const CATEGORY_TYPES = {
  expense: 'Gasto',
  income: 'Ingreso',
  transfer: 'Transferencia',
  adjustment: 'Ajuste',
} as const

export type CategoryType = keyof typeof CATEGORY_TYPES

export interface CreateCategoryRequest {
  name: string
  category_type: CategoryType
  icon?: string | null
  color?: string | null
  description?: string | null
  sort_order?: number
  keywords?: string | null
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string | null
  category_type?: string
  icon?: string | null
  color?: string | null
  sort_order?: number
  keywords?: string | null
  is_active?: boolean
}

export interface SubcategoryListItem {
  id: string
  name: string
  icon: string | null
  color: string | null
  sort_order: number
}

export interface SubcategoryDetail {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number
  keywords: string | null
}

export interface SubcategoryResponse {
  id: string
  name: string
  description: string | null
  category_id: string
  icon: string | null
  color: string | null
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

export interface CreateSubcategoryRequest {
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  sort_order?: number
  keywords?: string | null
}

export interface UpdateSubcategoryRequest {
  name?: string
  description?: string | null
  icon?: string | null
  color?: string | null
  sort_order?: number
  keywords?: string | null
  is_active?: boolean
}

export interface CategoryListItem {
  id: string
  name: string
  description: string | null
  category_type: string
  is_system: boolean
  is_active: boolean
  icon: string | null
  color: string | null
  sort_order: number
  subcategories: SubcategoryListItem[]
  created_at: string | null
}

export interface CategoryDetailResponse {
  id: string
  name: string
  description: string | null
  category_type: string
  is_system: boolean
  is_active: boolean
  icon: string | null
  color: string | null
  sort_order: number
  keywords: string | null
  subcategories: SubcategoryDetail[]
  created_at: string | null
  updated_at: string | null
}

export interface ListCategoriesResponse {
  categories: CategoryListItem[]
  total: number
}

export interface CategoryStatsResponse {
  total_categories: number
  system_categories: number
  user_categories: number
  by_type: Record<string, number>
}

export interface DeleteCategoryResponse {
  message: string
  category_id: string
}

export interface AICategorizeRequest {
  description: string
  amount?: number | null
  merchant_name?: string | null
}

export interface AICategorizeResponse {
  category_id: string | null
  subcategory_id: string | null
  method: string
  confidence: number
  rule_id: string | null
  rule_name: string | null
}
