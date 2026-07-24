import api from '@/lib/api'
import type {
  CategoryDetailResponse, ListCategoriesResponse,
  CategoryStatsResponse, DeleteCategoryResponse,
  AICategorizeRequest, AICategorizeResponse,
  CreateCategoryRequest, UpdateCategoryRequest,
  CreateSubcategoryRequest, UpdateSubcategoryRequest,
  SubcategoryResponse,
} from '@/types/categories'

export function createCategory(data: CreateCategoryRequest) {
  return api.post<CategoryDetailResponse>('/categories', data)
}

export function listCategories(params?: { category_type?: string; include_inactive?: boolean }) {
  return api.get<ListCategoriesResponse>('/categories', { params })
}

export function getCategory(id: string) {
  return api.get<CategoryDetailResponse>(`/categories/${id}`)
}

export function updateCategory(id: string, data: UpdateCategoryRequest) {
  return api.patch<CategoryDetailResponse>(`/categories/${id}`, data)
}

export function deleteCategory(id: string) {
  return api.delete<DeleteCategoryResponse>(`/categories/${id}`)
}

export function getCategoryStats() {
  return api.get<CategoryStatsResponse>('/categories/stats/overview')
}

export function categorizeDescription(data: AICategorizeRequest) {
  return api.post<AICategorizeResponse>('/categories/categorize', data)
}

export function createSubcategory(categoryId: string, data: CreateSubcategoryRequest) {
  return api.post<SubcategoryResponse>(`/categories/${categoryId}/subcategories`, data)
}

export function updateSubcategory(subcategoryId: string, data: UpdateSubcategoryRequest) {
  return api.patch<SubcategoryResponse>(`/categories/subcategories/${subcategoryId}`, data)
}

export function deleteSubcategory(subcategoryId: string) {
  return api.delete<DeleteCategoryResponse>(`/categories/subcategories/${subcategoryId}`)
}
