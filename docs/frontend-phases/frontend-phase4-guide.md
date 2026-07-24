# Fase 4: Categories — Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Backend API Reference](#2-backend-api-reference)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Tipos de TypeScript](#4-tipos-de-typescript)
5. [API Client](#5-api-client)
6. [Hooks de TanStack Query](#6-hooks-de-tanstack-query)
7. [Constantes y Configuracion](#7-constantes-y-configuracion)
8. [Componentes Compartidos](#8-componentes-compartidos)
   - 8.1 [CategoryBadge (chip color-coded)](#81-categorybadge)
   - 8.2 [CategoryTypeBadge](#82-categorytypebadge)
   - 8.3 [IconPicker](#83-iconpicker-componente-reutilizable)
   - 8.4 [CategoryPicker (jerarquico + searchable)](#84-categorypicker)
   - 8.5 [DeleteCategoryModal](#85-deletecategorymodal)
   - 8.6 [CategoryForm](#86-categoryform)
9. [CategoryTree (componente de arbol expandible)](#9-categorytree)
10. [CategoryListPage](#10-categorylistpage)
11. [CategoryCreatePage](#11-categorycreatepage)
12. [CategoryDetailPage](#12-categorydetailpage)
13. [CategoryStatsWidget](#13-categorystatswidget)
14. [AICategorizationTool](#14-aicategorizationtool)
15. [Actualizacion de Routing](#15-actualizacion-de-routing)
16. [Actualizacion de Sidebar](#16-actualizacion-de-sidebar)
17. [Estrategias y Mejores Practicas](#17-estrategias-y-mejores-practicas)
18. [Verificacion Final](#18-verificacion-final)

---

## 1. Resumen de la Fase

**Estado actual:** Fase 3 completada (Accounts & Wallets CRUD, balance, liquidez, drag & drop).

**Objetivos de Fase 4:**

| Area | Descripcion |
|------|-------------|
| **Category CRUD** | Listar (arbol expandible), crear, detalle, editar, eliminar categorias |
| **Subcategory CRUD inline** | Crear, editar, eliminar subcategorias desde el detalle de la categoria padre |
| **Arbol Expandible** | Visualizacion jerarquica de categorias con expand/collapse |
| **Category Type System** | Tipos: expense, income, transfer, adjustment (con codigos de color) |
| **Color Picker + Icon Selector** | Selector visual de color e icono Lucide para categorias |
| **System vs User distinction** | Diferencia visual entre categorias del sistema y creadas por usuario |
| **CategoryPicker Component** | Selector jerarquico reutilizable con busqueda |
| **AI Categorization Test Tool** | Input de descripcion, ver prediccion de categoria |
| **CategoryStatsWidget** | Resumen de categorias (cantidad por tipo, totales) |

### Convenciones a Seguir

- **Patron existente**: Seguir exactamente la misma estructura que Fase 3 (Accounts/Wallets)
- **API Client**: Todos los llamados van por `lib/api.ts`
- **Server State**: TanStack Query para todos los datos del API
- **Forms**: React Hook Form + Zod para validacion
- **Toasts**: `react-hot-toast` para feedback
- **Estilo**: TailwindCSS con glass morphism `bg-white/80 backdrop-blur-xl`
- **Animaciones**: `animate-fade-in` con `animationDelay` escalonado
- **Componentes UI**: Usar los existentes en `components/ui/` (Card, Button, Input, Badge, Skeleton, Modal, etc.)
- **Iconos de categoria**: Lucide React. Mapa completo de ~40 iconos financieros
- **Gradientes por tipo**: expense=rojo, income=verde, transfer=azul, adjustment=ambar

---

## 2. Backend API Reference

### 2.1 Categories API (`/api/v1/categories/`)

Base path: `/api/v1/categories`

#### GET /categories — Listar categorias (arbol)

**Query params:** `?type=expense&include_system=true`

**Response (200):**
```typescript
{
  categories: Array<{
    id: string
    name: string
    type: 'expense' | 'income' | 'transfer' | 'adjustment'
    icon: string | null         // nombre del icono Lucide
    color: string | null        // hex #RRGGBB
    is_system: boolean          // true = creada por sistema
    is_active: boolean
    sort_order: number
    parent_id: string | null    // null = categoria padre
    description: string | null
    created_at: string | null
    transaction_count: number
    children: Array<CategoryNode>  // subcategorias (misma estructura)
  }>,
  total: number
}
```

#### POST /categories — Crear categoria

**Request:**
```typescript
{
  name: string                    // min 1, max 100
  type: 'expense' | 'income' | 'transfer' | 'adjustment'
  icon?: string | null            // nombre del icono Lucide, max 50
  color?: string | null           // hex #RRGGBB, max 7
  parent_id?: string | null       // UUID de categoria padre (para subcategoria)
  description?: string | null     // max 500
  sort_order?: number             // default 0
}
```

**Response (201):**
```typescript
{
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
  is_system: boolean
  is_active: boolean
  sort_order: number
  parent_id: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
}
```

#### GET /categories/:id — Detalle de categoria (con subcategorias)

**Response (200):**
```typescript
{
  id: string
  name: string
  type: 'expense' | 'income' | 'transfer' | 'adjustment'
  icon: string | null
  color: string | null
  is_system: boolean
  is_active: boolean
  sort_order: number
  parent_id: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
  children: Array<CategoryNode>   // subcategorias directas
  transaction_count: number
}
```

#### PATCH /categories/:id — Actualizar categoria

**Request (todos opcionales):**
```typescript
{
  name?: string
  icon?: string | null
  color?: string | null
  description?: string | null
  sort_order?: number
  is_active?: boolean
}
```

**Response (200):** CategoryResponse

**NOTA:** `type` y `parent_id` NO se pueden cambiar despues de crear. El tipo es permanente y la re-parentalizacion requiere logica especial (no implementada en esta fase).

#### DELETE /categories/:id — Eliminar categoria (soft-delete)

**Response (200):**
```typescript
{
  message: string
  category_id: string
}
```

**NOTA:** Si la categoria tiene transacciones asociadas o subcategorias, el backend debe manejarlo (bloquear eliminacion o eliminar en cascada). Confirmar con backend.

#### GET /categories/stats — Estadisticas de categorias

**Response (200):**
```typescript
{
  total_categories: number
  by_type: {
    expense: number
    income: number
    transfer: number
    adjustment: number
  }
  system_count: number
  user_count: number
  with_children: number
}
```

#### POST /ai/categorize — AI Categorization Test

**Request:**
```typescript
{
  description: string   // descripcion de transaccion a categorizar
}
```

**Response (200):**
```typescript
{
  category_id: string
  category_name: string
  category_icon: string | null
  category_color: string | null
  confidence: number              // 0.0 - 1.0
  method: 'exact' | 'fuzzy' | 'llm'
  alternatives: Array<{
    category_id: string
    category_name: string
    confidence: number
  }>
}
```

---

## 3. Estructura de Archivos

```
src/
  types/
    categories.ts                    # Category types (CREAR)
  features/
    categories/                      # (CREAR carpeta completa)
      api/
        categories.ts                # API functions
      hooks/
        useCategories.ts             # Queries + Mutations
      constants.ts                   # CATEGORY_TYPE_CONFIG, ICON_MAP
      components/
        CategoryBadge.tsx            # Chip color-coded con icono
        CategoryTypeBadge.tsx        # Badge del tipo (expense/income/transfer/adjustment)
        CategoryTree.tsx             # Arbol expandible recursivo
        CategoryCard.tsx             # Tarjeta de categoria para el arbol
        CategoryForm.tsx             # Formulario crear/editar categoria
        CategoryPicker.tsx           # Selector jerarquico reutilizable
        IconPicker.tsx               # Selector de iconos Lucide searchable
        DeleteCategoryModal.tsx      # Modal confirmacion eliminar
        CategoryStatsWidget.tsx      # Widget resumen de categorias
        AICategorizationTool.tsx     # Herramienta de test AI categorization
        SubcategoryList.tsx          # Lista de subcategorias editable inline
        SubcategoryForm.tsx          # Formulario inline para subcategoria
      pages/
        CategoryListPage.tsx
        CategoryCreatePage.tsx
        CategoryDetailPage.tsx
  routes/
    index.tsx                        # Actualizar routes
    lazy.ts                          # Agregar lazy imports
```

---

## 4. Tipos de TypeScript

Crear `src/types/categories.ts`:

```typescript
// ============================================================
// Enums & Constants
// ============================================================

export const CATEGORY_TYPES = {
  expense: 'Gasto',
  income: 'Ingreso',
  transfer: 'Transferencia',
  adjustment: 'Ajuste',
} as const

export type CategoryType = keyof typeof CATEGORY_TYPES

// ============================================================
// API Request types
// ============================================================

export interface CreateCategoryRequest {
  name: string
  type: CategoryType
  icon?: string | null
  color?: string | null
  parent_id?: string | null
  description?: string | null
  sort_order?: number
}

export interface UpdateCategoryRequest {
  name?: string
  icon?: string | null
  color?: string | null
  description?: string | null
  sort_order?: number
  is_active?: boolean
}

// ============================================================
// API Response types
// ============================================================

export interface CategoryNode {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
  is_system: boolean
  is_active: boolean
  sort_order: number
  parent_id: string | null
  description: string | null
  created_at: string | null
  transaction_count: number
  children: CategoryNode[]
}

export interface CategoryResponse {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
  is_system: boolean
  is_active: boolean
  sort_order: number
  parent_id: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
  children: CategoryNode[]
  transaction_count: number
}

export interface ListCategoriesResponse {
  categories: CategoryNode[]
  total: number
}

export interface CategoryStatsResponse {
  total_categories: number
  by_type: Record<CategoryType, number>
  system_count: number
  user_count: number
  with_children: number
}

export interface DeleteCategoryResponse {
  message: string
  category_id: string
}

// ============================================================
// AI Categorization types
// ============================================================

export interface AICategorizeRequest {
  description: string
}

export interface AICategorizationAlternative {
  category_id: string
  category_name: string
  confidence: number
}

export interface AICategorizeResponse {
  category_id: string
  category_name: string
  category_icon: string | null
  category_color: string | null
  confidence: number
  method: 'exact' | 'fuzzy' | 'llm'
  alternatives: AICategorizationAlternative[]
}
```

---

## 5. API Client

Crear `src/features/categories/api/categories.ts`:

```typescript
import api from '@/lib/api'
import type {
  CategoryResponse, CategoryNode, ListCategoriesResponse,
  CategoryStatsResponse, DeleteCategoryResponse,
  AICategorizeRequest, AICategorizeResponse,
  CreateCategoryRequest, UpdateCategoryRequest,
} from '@/types/categories'

// ============================================================
// Category CRUD
// ============================================================

export function createCategory(data: CreateCategoryRequest) {
  return api.post<CategoryResponse>('/categories', data)
}

export function listCategories(params?: {
  type?: string
  include_system?: boolean
}) {
  return api.get<ListCategoriesResponse>('/categories', { params })
}

export function getCategory(id: string) {
  return api.get<CategoryResponse>(`/categories/${id}`)
}

export function updateCategory(id: string, data: UpdateCategoryRequest) {
  return api.patch<CategoryResponse>(`/categories/${id}`, data)
}

export function deleteCategory(id: string) {
  return api.delete<DeleteCategoryResponse>(`/categories/${id}`)
}

export function getCategoryStats() {
  return api.get<CategoryStatsResponse>('/categories/stats')
}

// ============================================================
// AI Categorization
// ============================================================

export function categorizeDescription(data: AICategorizeRequest) {
  return api.post<AICategorizeResponse>('/ai/categorize', data)
}
```

---

## 6. Hooks de TanStack Query

Crear `src/features/categories/hooks/useCategories.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as categoriesApi from '../api/categories'
import type { CreateCategoryRequest, UpdateCategoryRequest, AICategorizeRequest } from '@/types/categories'

// ============================================================
// Query Keys
// ============================================================

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  stats: () => [...categoryKeys.all, 'stats'] as const,
}

// ============================================================
// Queries
// ============================================================

export function useCategories(params?: { type?: string; include_system?: boolean }) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesApi.listCategories(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2, // 2 min
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
    staleTime: 1000 * 60 * 5, // 5 min
  })
}

// ============================================================
// Mutations
// ============================================================

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

// ============================================================
// AI Categorization (no es mutation, es query-like pero POST)
// ============================================================

export function useAICategorization() {
  return useMutation({
    mutationFn: (data: AICategorizeRequest) =>
      categoriesApi.categorizeDescription(data).then((r) => r.data),
  })
}
```

---

## 7. Constantes y Configuracion

Crear `src/features/categories/constants.ts`:

```typescript
import {
  // Expense icons
  ShoppingCart, Utensils, Coffee, Wine, Cake, Car, Plane, Bus, Fuel,
  Home, Heart, BookOpen, Shirt, Gamepad2, Gift, Smartphone, Zap, Droplets,
  Wifi, Cross, Dog, MoreHorizontal,
  // Income icons
  Briefcase, TrendingUp, Award, Download, Banknote, Handshake,
  // Transfer icons
  ArrowLeftRight, Repeat, Send,
  // Adjustment icons
  Scale, SlidersHorizontal, PlusMinus,
  // Category icons
  Tag, FolderOpen, FolderTree,
} from 'lucide-react'
import type { CategoryType } from '@/types/categories'
import type { LucideIcon } from 'lucide-react'

// ============================================================
// Category Type Config
// ============================================================

export const CATEGORY_TYPE_CONFIG: Record<CategoryType, {
  label: string
  color: string
  bgColor: string
  gradient: string
  icon: LucideIcon
}> = {
  expense: {
    label: 'Gasto',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
    icon: ShoppingCart,
  },
  income: {
    label: 'Ingreso',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    gradient: 'from-emerald-400 to-emerald-600',
    icon: TrendingUp,
  },
  transfer: {
    label: 'Transferencia',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    gradient: 'from-blue-400 to-blue-600',
    icon: ArrowLeftRight,
  },
  adjustment: {
    label: 'Ajuste',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
    icon: Scale,
  },
}

// ============================================================
// Icon Picker — organized categories (todos los iconos importados explicitamente para Vite ESM)
// ============================================================

export const ICON_CATEGORIES: Array<{
  name: string
  icons: Array<{ name: string; icon: LucideIcon }>
}> = [
  {
    name: 'Comida y Bebida',
    icons: [
      { name: 'utensils', icon: Utensils },
      { name: 'coffee', icon: Coffee },
      { name: 'wine', icon: Wine },
      { name: 'cake', icon: Cake },
    ],
  },
  {
    name: 'Transporte',
    icons: [
      { name: 'car', icon: Car },
      { name: 'plane', icon: Plane },
      { name: 'bus', icon: Bus },
      { name: 'fuel', icon: Fuel },
    ],
  },
  {
    name: 'Vivienda y Servicios',
    icons: [
      { name: 'home', icon: Home },
      { name: 'zap', icon: Zap },
      { name: 'droplets', icon: Droplets },
      { name: 'wifi', icon: Wifi },
    ],
  },
  {
    name: 'Compras y Entretenimiento',
    icons: [
      { name: 'shopping-cart', icon: ShoppingCart },
      { name: 'shirt', icon: Shirt },
      { name: 'gamepad', icon: Gamepad2 },
      { name: 'gift', icon: Gift },
    ],
  },
  {
    name: 'Salud y Educacion',
    icons: [
      { name: 'heart', icon: Heart },
      { name: 'cross', icon: Cross },
      { name: 'book-open', icon: BookOpen },
      { name: 'dog', icon: Dog },
    ],
  },
  {
    name: 'Ingresos',
    icons: [
      { name: 'briefcase', icon: Briefcase },
      { name: 'award', icon: Award },
      { name: 'download', icon: Download },
      { name: 'banknote', icon: Banknote },
    ],
  },
  {
    name: 'Transferencias y Ajustes',
    icons: [
      { name: 'arrow-left-right', icon: ArrowLeftRight },
      { name: 'repeat', icon: Repeat },
      { name: 'send', icon: Send },
      { name: 'plus-minus', icon: PlusMinus },
    ],
  },
  {
    name: 'Generales',
    icons: [
      { name: 'tag', icon: Tag },
      { name: 'folder-open', icon: FolderOpen },
      { name: 'folder-tree', icon: FolderTree },
      { name: 'more-horizontal', icon: MoreHorizontal },
    ],
  },
]

export const ICON_MAP: Record<string, LucideIcon> = {}
for (const cat of ICON_CATEGORIES) {
  for (const item of cat.icons) {
    ICON_MAP[item.name] = item.icon
  }
}

export const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16', '#a855f7', '#e11d48',
]

---

## 8. Componentes Compartidos

### 8.1 CategoryBadge

Chip visual de categoria con icono + color + nombre.

```typescript
// src/features/categories/components/CategoryBadge.tsx
import { cn } from '@/lib/utils'
import { ICON_MAP } from '../constants'

interface Props {
  name: string
  icon?: string | null
  color?: string | null
  isSystem?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function CategoryBadge({ name, icon, color, isSystem, showIcon = true, size = 'sm', className }: Props) {
  const Icon = icon ? ICON_MAP[icon] : null

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 shadow-sm',
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
      className,
    )}>
      {Icon && showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} style={color ? { color } : undefined} />}
      {!Icon && showIcon && (
        <span
          className={cn('h-2 w-2 rounded-full', size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')}
          style={{ backgroundColor: color || '#6b7280' }}
        />
      )}
      <span className="text-gray-700 dark:text-gray-300">{name}</span>
      {isSystem && (
        <span className="ml-0.5 rounded bg-gray-200/50 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
          SYS
        </span>
      )}
    </span>
  )
}
```

### 8.2 CategoryTypeBadge

Badge del tipo de categoria (expense/income/transfer/adjustment) con icono + color.

```typescript
// src/features/categories/components/CategoryTypeBadge.tsx
import { cn } from '@/lib/utils'
import type { CategoryType } from '@/types/categories'
import { CATEGORY_TYPE_CONFIG } from '../constants'

interface Props {
  type: CategoryType | string
  showLabel?: boolean
  className?: string
}

export default function CategoryTypeBadge({ type, showLabel = true, className }: Props) {
  const config = CATEGORY_TYPE_CONFIG[type as CategoryType]
  if (!config) return <span className="text-xs text-gray-500">{type}</span>

  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium',
      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm border border-white/20',
      config.color, className,
    )}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
```

### 8.3 IconPicker (Componente Reutilizable)

Selector visual de iconos Lucide con busqueda y categorias.

```typescript
// src/features/categories/components/IconPicker.tsx
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { ICON_CATEGORIES } from '../constants'
import type { LucideIcon } from 'lucide-react'

interface Props {
  value: string | null
  onChange: (iconName: string | null) => void
}

export default function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return ICON_CATEGORIES
    const q = search.toLowerCase()
    return ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter(
        (item) => item.name.includes(q) || cat.name.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.icons.length > 0)
  }, [search])

  const displayedCategories = activeCategory
    ? filteredCategories.filter((c) => c.name === activeCategory)
    : filteredCategories

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar iconos..."
          className="w-full rounded-xl border border-gray-200 bg-white/70 py-2 pl-9 pr-3 text-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
        />
      </div>

      {/* Category tabs (solo cuando no hay busqueda) */}
      {!search.trim() && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
              !activeCategory
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            Todos
          </button>
          {ICON_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={cn(
                'whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                activeCategory === cat.name
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Icon grid */}
      <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto">
        {/* None option */}
        <button
          onClick={() => onChange(null)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all',
            value === null
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
          )}
          title="Sin icono"
        >
          <span className="text-xs text-gray-400 font-bold">X</span>
        </button>
        {displayedCategories.map((cat) =>
          cat.icons.map((item) => {
            const Icon = item.icon
            const isSelected = value === item.name
            return (
              <button
                key={item.name}
                onClick={() => onChange(isSelected ? null : item.name)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 scale-110 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800',
                )}
                title={item.name}
              >
                <Icon className={cn('h-4 w-4', isSelected ? 'text-primary-600' : 'text-gray-500')} />
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
```

### 8.4 CategoryPicker

Selector jerarquico de categorias con busqueda, para reutilizar en forms de transacciones, budgets, etc.

```typescript
// src/features/categories/components/CategoryPicker.tsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useCategories } from '../hooks/useCategories'
import CategoryBadge from './CategoryBadge'
import { Search, ChevronRight, ChevronDown } from 'lucide-react'
import type { CategoryNode } from '@/types/categories'
import { CATEGORY_TYPE_CONFIG } from '../constants'

interface Props {
  value: string     // category_id
  onChange: (categoryId: string) => void
  filterType?: 'expense' | 'income' | 'transfer' | 'adjustment'
  placeholder?: string
  className?: string
}

function flattenTree(nodes: CategoryNode[], depth = 0): Array<CategoryNode & { depth: number }> {
  const result: Array<CategoryNode & { depth: number }> = []
  for (const node of nodes) {
    result.push({ ...node, depth })
    if (node.children?.length) {
      result.push(...flattenTree(node.children, depth + 1))
    }
  }
  return result
}

export default function CategoryPicker({ value, onChange, filterType, placeholder = 'Seleccionar categoria...', className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())
  const ref = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useCategories(filterType ? { type: filterType } : undefined)

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allItems = useMemo(() => {
    if (!data?.categories) return []
    return flattenTree(data.categories)
  }, [data])

  const filtered = useMemo(() => {
    if (!search.trim()) return allItems
    const q = search.toLowerCase()
    return allItems.filter((item) => item.name.toLowerCase().includes(q))
  }, [allItems, search])

  const selected = allItems.find((item) => item.id === value)

  const toggleExpand = (id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const renderItems = (nodes: CategoryNode[], depth: number) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0
      const isExpanded = expandedParents.has(node.id)
      const config = CATEGORY_TYPE_CONFIG[node.type as keyof typeof CATEGORY_TYPE_CONFIG]

      return (
        <div key={node.id}>
          <button
            type="button"
            onClick={() => {
              onChange(node.id)
              setIsOpen(false)
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
              value === node.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleExpand(node.id) }}
                className="rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {isExpanded
                  ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <CategoryBadge
              name={node.name}
              icon={node.icon}
              color={node.color}
              isSystem={node.is_system}
              size="sm"
              showIcon
            />
            {config && (
              <span className={cn('ml-auto text-[10px] font-medium', config.color)}>
                {config.label}
              </span>
            )}
          </button>
          {hasChildren && isExpanded && renderItems(node.children, depth + 1)}
        </div>
      )
    })
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-3 py-2.5 text-sm backdrop-blur-sm transition-all',
          'dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20',
          isOpen && 'border-primary-400 ring-2 ring-primary-500/20',
        )}
      >
        {selected ? (
          <CategoryBadge
            name={selected.name}
            icon={selected.icon}
            color={selected.color}
            isSystem={selected.is_system}
            size="sm"
          />
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDown className={cn('ml-auto h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900">
          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoria..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="py-6 text-center text-sm text-gray-400">Cargando...</div>
          )}

          {/* Empty */}
          {!isLoading && filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400">
              {search ? 'Sin resultados' : 'No hay categorias'}
            </div>
          )}

          {/* Tree */}
          {!isLoading && filtered.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {search.trim()
                ? filtered.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { onChange(item.id); setIsOpen(false) }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all',
                        value === item.id
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      )}
                      style={{ paddingLeft: `${12 + item.depth * 16}px` }}
                    >
                      <CategoryBadge
                        name={item.name}
                        icon={item.icon}
                        color={item.color}
                        isSystem={item.is_system}
                        size="sm"
                      />
                    </button>
                  ))
                : renderItems(data!.categories, 0)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### 8.5 DeleteCategoryModal

```typescript
// src/features/categories/components/DeleteCategoryModal.tsx (mismo patron que DeleteAccountModal)
```

### 8.6 CategoryForm

Formulario completo para crear/editar categoria.

```typescript
// src/features/categories/components/CategoryForm.tsx
// Schema Zod:
// - name: string, min 1, max 100
// - type: enum expense|income|transfer|adjustment (solo en CREATE, readonly en EDIT)
// - icon: string | null, opcional
// - color: string | null, hex valido (regex #RRGGBB), opcional
// - description: string, opcional, max 500
// - parent_id: string | null, opcional, para crear subcategoria

// Componentes a incluir:
// 1. Type Selector visual (grid 2x2 con iconos + labels) — SOLO en CREATE
// 2. Name input
// 3. IconPicker component
// 4. Color Picker (12 colores predefinidos + custom hex)
// 5. Description textarea
// 6. Toggle is_active (en EDIT mode)

// IMPORTANTE: Usar CATEGORY_TYPE_CONFIG para los tipos
// El selector de tipo debe ser visual como en AccountForm pero con 4 opciones en grid 2x2
```

---

## 9. CategoryTree

Componente de arbol expandible recursivo para visualizar categorias jerarquicas.

```typescript
// src/features/categories/components/CategoryTree.tsx
// Props: categories: CategoryNode[]
//        onSelect: (id: string) => void
//        selectedId?: string
//        showType?: boolean    // mostrar badge de tipo
//        depth?: number       // para indentacion recursiva
//        defaultExpanded?: boolean

// Comportamiento:
// - Render recursivo de CategoryNode.children
// - Cada nodo tiene:
//   - Chevron expand/collapse (si tiene hijos)
//   - CategoryBadge con icono + color + nombre
//   - CategoryTypeBadge (opcional)
//   - Badge "SYS" si is_system (System vs User distinction)
//   - Transaction count
//   - Boton de accion (opcional): editar inline
// - Transicion suave de altura al expandir/collapse
// - Animacion de fade-in escalonada

// Estados:
// - Empty: mensaje "No hay categorias"
// - Loading: CategoryTreeSkeleton
// - Error: ErrorMessage con retry
```

---

## 10. CategoryListPage

```typescript
// src/features/categories/pages/CategoryListPage.tsx
// Ruta: /categories

// Layout:
// - Background decorations (orbs blur con colores de category types)
// - Header con titulo + boton "Nueva Categoria"
// - CategoryStatsWidget en la parte superior
// - Filtros por tipo: Todos, Gastos, Ingresos, Transferencias, Ajustes
//   (filtros en gradient glass style, mismo patron que AccountListPage)
// - CategoryTree con todas las categorias
// - Cada categoria en el arbol es clickeable → navega a /categories/:id

// Estados:
// - Loading: Skeleton del arbol
// - Empty: EmptyState con icono Tag + "Crea tu primera categoria"
// - Error: ErrorMessage con retry

// Filtro por tipo via URL search params: ?type=expense
// Boton "Nueva Categoria" navega a /categories/new
```

---

## 11. CategoryCreatePage

```typescript
// src/features/categories/pages/CategoryCreatePage.tsx
// Ruta: /categories/new

// Layout (mismo estilo glass que AccountCreatePage):
// - Background decorations
// - Header con ArrowLeft + titulo "Nueva Categoria"
// - Glass card con CategoryForm

// Comportamiento:
// - Usar useCreateCategory()
// - On success: navigate('/categories') + toast
// - El formulario incluye selector de tipo (solo en create)
// - Query param ?parent=xxx para crear subcategoria directamente
//   (si viene parent en URL, pre-seleccionar y mostrar "Subcategoria de: [nombre padre]")
```

---

## 12. CategoryDetailPage

```typescript
// src/features/categories/pages/CategoryDetailPage.tsx
// Ruta: /categories/:id

// Layout:
// - Background decorations
// - Header: nombre + CategoryTypeBadge + SystemBadge + botones Editar/Eliminar
// - Glass card con informacion detallada:
//   - Tipo (con icono + color)
//   - Color actual (mostrado como swatch)
//   - Icono actual (mostrado)
//   - Descripcion
//   - Fecha de creacion
//   - Transaction count
// - Seccion de Subcategorias (SubcategoryList):
//   - Lista de subcategorias con icono + nombre + color
//   - Cada subcategoria: editar inline (nombre + color) o eliminar
//   - Boton "Agregar Subcategoria" → forma inline o modal
// - Editar categoria: expande CategoryForm precargado
// - Eliminar: DeleteCategoryModal + confirmacion
//   - Si tiene subcategorias, mostrar advertencia: "Esta categoria tiene X subcategorias que tambien se eliminaran"

// SubcategoryList:
// - Lista inline (no modal)
// - Cada item: icono + CategoryBadge + botones editar/eliminar
// - Editar: el item se convierte en un mini-formulario (input + color picker)
// - Agregar: aparece un formulario al final de la lista
// - Usar mutations useCreateCategory (con parent_id) y useUpdateCategory
```

---

## 13. CategoryStatsWidget

```typescript
// src/features/categories/components/CategoryStatsWidget.tsx
// Data: useCategoryStats()

// Layout (glass card con gradient accent bar):
// - Header "Resumen de Categorias"
// - Grid 2x2 de metricas:
//   - Total categorias (numero grande)
//   - Por tipo: expense (rojo), income (verde), transfer (azul), adjustment (ambar)
//     Cada uno con icono + count + label
//   - System vs User: "X del sistema / Y creadas por ti"
//   - Con hijos: "Z con subcategorias"

// Estados:
// - Loading: Skeleton grid 2x2
// - Empty o error: null (no mostrar)
```

---

## 14. AICategorizationTool

```typescript
// src/features/categories/components/AICategorizationTool.tsx
// Herramienta de test para AI categorization

// Layout (glass card):
// - Header: "AI Categorization Test"
// - Description: "Ingresa una descripcion de transaccion para ver como la categoriza la IA"
// - Input text area para descripcion
// - Boton "Categorizar" → useAICategorization mutation
// - Resultado (cuando hay respuesta):
//   - Card con:
//     - Categoria predicha (CategoryBadge grande)
//     - Confidence indicator (barra de progreso color-coded:
//       >0.8 = verde, >0.5 = amarillo, <0.5 = rojo)
//     - Metodo usado: exact | fuzzy | llm (con badge)
//     - Alternativas (si hay):
//       - Lista de categorias con su confidence
// - Estados:
//   - Idle: mostrar solo el input
//   - Loading: spinner en boton + skeleton resultado
//   - Success: resultado animado
//   - Error: ErrorMessage

// Confidence bar component:
// {confidence}% con color segun nivel
// bg-gradient-to-r:
//   <0.5: from-red-400 to-red-600
//   0.5-0.8: from-amber-400 to-amber-600
//   >0.8: from-emerald-400 to-emerald-600

// Method badge:
// exact → "Exacta" (verde)
// fuzzy → "Difusa" (ambar)
// llm → "IA" (azul/violeta)
```

---

## 15. Actualizacion de Routing

### lazy.ts

Agregar a `src/routes/lazy.ts`:

```typescript
// Categories
export const CategoryListPage = lazy(() => import('@/features/categories/pages/CategoryListPage'))
export const CategoryCreatePage = lazy(() => import('@/features/categories/pages/CategoryCreatePage'))
export const CategoryDetailPage = lazy(() => import('@/features/categories/pages/CategoryDetailPage'))
```

### routes/index.tsx

Reemplazar la ruta Placeholder de categories:

```typescript
// En el import:
import {
  // ... existing
  CategoryListPage, CategoryCreatePage, CategoryDetailPage,
} from './lazy'

// En el children del MainLayout, reemplazar:
// Categories
{
  path: '/categories',
  element: (
    <SuspenseWrapper>
      <CategoryListPage />
    </SuspenseWrapper>
  ),
},
{
  path: '/categories/new',
  element: (
    <SuspenseWrapper>
      <CategoryCreatePage />
    </SuspenseWrapper>
  ),
},
{
  path: '/categories/:id',
  element: (
    <SuspenseWrapper>
      <CategoryDetailPage />
    </SuspenseWrapper>
  ),
},
```

---

## 16. Actualizacion de Sidebar

Verificar `components/layout/Sidebar.tsx`. Ya deberia tener la entrada:

```typescript
{ name: 'Categorias', href: '/categories', icon: Tags },
```

Si no existe, agregarla en la seccion correspondiente (entre Wallets y Transacciones, o en orden alfabetico/logico).

---

## 17. Estrategias y Mejores Practicas

### 17.1 Arbol Expandible: Estado de expansion

Usar `useState<Set<string>>` para trackear que nodos estan expandidos. No usar estado global — cada instancia del arbol maneja su propio estado.

```typescript
const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

const toggle = (id: string) => {
  setExpandedIds((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
}
```

Para "Expand All" / "Collapse All":

```typescript
const expandAll = (nodes: CategoryNode[]) => {
  const allIds = new Set<string>()
  const collect = (items: CategoryNode[]) => {
    for (const item of items) {
      if (item.children?.length) {
        allIds.add(item.id)
        collect(item.children)
      }
    }
  }
  collect(nodes)
  setExpandedIds(allIds)
}
```

### 17.2 System vs User Visual Distinction

Las categorias del sistema deben ser visualmente distintas:
- Badge "SYS" pequeño al lado del nombre (ver CategoryBadge)
- Fondo ligeramente diferente (gris vs blanco)
- Tooltip: "Categoria del sistema — no editable"
- Las categorias del sistema NO tienen boton de eliminar
- Opcionalmente: icono de candado

### 17.3 IconPicker Performance

- El grid de iconos tiene ~40 iconos. No necesita virtualizacion.
- La busqueda filtra por nombre de icono y nombre de categoria.
- Pre-cargar todos los iconos en `ICON_MAP` para lookup eficiente.

### 17.4 CategoryPicker Reutilizable

El CategoryPicker debe ser un componente independiente y reutilizable que otros features puedan importar:

```typescript
// Uso en TransactionForm:
import CategoryPicker from '@/features/categories/components/CategoryPicker'

<CategoryPicker
  value={categoryId}
  onChange={setCategoryId}
  filterType="expense"    // solo mostrar categorias de gasto
/>
```

### 17.5 Inline Subcategory CRUD

Para la edicion inline de subcategorias en CategoryDetailPage:

```typescript
// Estado local para subcategoria en edicion
const [editingSubId, setEditingSubId] = useState<string | null>(null)
const [addingSub, setAddingSub] = useState(false)

// Cuando editingSubId !== null, ese item muestra inputs en lugar de texto
// Cuando addingSub === true, se muestra un formulario al final

// Al guardar:
// - Editar: useUpdateCategory()
// - Crear: useCreateCategory() con parent_id = currentCategory.id
// - Eliminar: useDeleteCategory() con confirmacion
// - Invalidar queries locales despues de cada operacion
```

### 17.6 AI Categorization Tool Layout

Ubicar el AICategorizationTool en CategoryListPage como un widget colapsable, o en una seccion separada accesible desde el header de categorias. Recomendacion: incluirlo como una card expandible al final de CategoryListPage, o como un modal/tab.

Para mejor UX, que sea una card que se pueda contraer:

```typescript
const [showAITool, setShowAITool] = useState(false)
// Boton "Probar Categorizacion IA" en el header de CategoryListPage
// Al hacer click, expande/muestra el AICategorizationTool
```

### 17.7 Estrategia de Cache

```typescript
// Query keys organizados:
categoryKeys.all        = ['categories']
categoryKeys.lists()   = ['categories', 'list']
categoryKeys.list(filters) = ['categories', 'list', filters]
categoryKeys.detail(id) = ['categories', 'detail', id]
categoryKeys.stats()   = ['categories', 'stats']

// Invalidacion despues de mutaciones:
// - Crear/eliminar: invalidar lists + stats
// - Editar: invalidar lists + detail(id)
// - Crear subcategoria: invalidar lists + detail(parentId)
// - AI categorize: NO invalidar nada (es POST test-only)
```

### 17.8 Manejo de Errores Especificos

- **Eliminar categoria con transacciones**: Backend debe devolver error si tiene transacciones. Mostrar: "No se puede eliminar esta categoria porque tiene X transacciones asociadas."
- **Eliminar categoria con subcategorias**: Mostrar advertencia de eliminacion en cascada.
- **Crear subcategoria con type diferente**: No permitir (subcategoria hereda el type del padre). Validar en frontend: si `parent_id` esta presente, el type debe coincidir con el del padre.
- **Limite de profundidad**: Maximo 2 niveles (padre → hijo). No permitir subcategorias de subcategorias.
  - En el CategoryPicker, deshabilitar items que ya son hijos (profundidad >= 1) como parent.

### 17.9 Diseño Visual Consistente

Mantener el mismo glass design system de Fase 3:

```
+--------------------------------------------------+
|  [Background gradient orbs with blur-3xl]         |
|                                                    |
|  [Header with title + animated dot + button]      |
|  [Stats widget - glass with gradient accent bar]   |
|  [Type filter pills - gradient when active]        |
|                                                    |
|  [Category Tree]                                   |
|  +--- [CategoryBadge] > [expand] [type] [count]   |
|  |    +--- [SubcategoryBadge] > [type] [count]    |
|  |    +--- [SubcategoryBadge] > [type] [count]    |
|  +--- [CategoryBadge] > [expand] [type] [count]   |
|                                                    |
|  [AI Categorization Tool - collapsible card]       |
+--------------------------------------------------+

Cada categoria en el arbol:
- Glass card bg-white/80 backdrop-blur-xl
- Gradient left border segun type:
  - expense: from-red-400 to-red-600
  - income: from-emerald-400 to-emerald-600
  - transfer: from-blue-400 to-blue-600
  - adjustment: from-amber-400 to-amber-600
- Hover: shadow + translate-y (-0.5)
- Click: navigate to detail
```

### 17.10 Orden de Implementacion Sugerido

1. `types/categories.ts` — tipos
2. `features/categories/constants.ts` — config types + icon map
3. `features/categories/api/categories.ts` — API functions
4. `features/categories/hooks/useCategories.ts` — TanStack hooks
5. `components/CategoryTypeBadge.tsx` — badge basico
6. `components/CategoryBadge.tsx` — chip color-coded
7. `components/CategoryForm.tsx` — formulario
8. `components/IconPicker.tsx` — selector de iconos
9. `components/DeleteCategoryModal.tsx` — modal eliminar
10. `components/CategoryTree.tsx` — arbol expandible
11. `components/CategoryPicker.tsx` — selector jerarquico
12. `pages/CategoryListPage.tsx` — pagina principal con arbol + filtros
13. `pages/CategoryCreatePage.tsx` — formulario de creacion
14. `components/SubcategoryList.tsx` + `SubcategoryForm.tsx` — CRUD inline
15. `pages/CategoryDetailPage.tsx` — detalle con subcategorias
16. `components/CategoryStatsWidget.tsx` — widget resumen
17. `components/AICategorizationTool.tsx` — herramienta AI
18. Routing updates
19. Verificacion final

---

## 18. Verificacion Final

```bash
# TypeScript check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```

### Checklist Final

**General:**
- [ ] `tsc --noEmit` sin errores
- [ ] `pnpm lint` sin errores (warnings conocidos de RHF ok)
- [ ] `pnpm build` exitoso
- [ ] Dark mode funciona en todas las paginas
- [ ] Responsive funciona en mobile
- [ ] Loading states con skeletons
- [ ] Empty states con icono + mensaje + CTA
- [ ] Error states con retry button
- [ ] Toasts de success/error en cada mutation
- [ ] Animaciones fade-in escalonadas

**Category List:**
- [ ] Arbol expandible con subcategorias funcionando
- [ ] Expand/Collapse con animacion suave
- [ ] Filtro por tipo de categoria via URL params
- [ ] System vs User distinction visual (badge "SYS")
- [ ] CategoryBadge con icono + color + nombre
- [ ] CategoryStatsWidget mostrando metricas
- [ ] AICategorizationTool funcional (input + resultado)

**Category Create:**
- [ ] Formulario con selector de tipo (expense/income/transfer/adjustment)
- [ ] IconPicker funcionando (search + grid)
- [ ] Color Picker funcionando (12 colores + custom hex)
- [ ] Crear subcategoria via query param `?parent=xxx`
- [ ] Validacion Zod en todos los campos
- [ ] Redirige a lista con toast success

**Category Detail:**
- [ ] Informacion completa de la categoria
- [ ] Editar categoria con formulario precargado
- [ ] Eliminar con confirmacion (y advertencia si tiene subcategorias)
- [ ] SubcategoryList inline con CRUD
- [ ] Agregar subcategoria inline
- [ ] Editar subcategoria inline
- [ ] Eliminar subcategoria con confirmacion

**CategoryPicker:**
- [ ] Dropdown jerarquico con arbol expandible
- [ ] Busqueda por nombre de categoria
- [ ] Filtro por tipo via prop
- [ ] Cerrar al seleccionar
- [ ] Cerrar al hacer click fuera
- [ ] Funciona en formularios de otros features

**AI Categorization Tool:**
- [ ] Input de descripcion
- [ ] Boton "Categorizar" con loading state
- [ ] Muestra categoria predicha con CategoryBadge
- [ ] Confidence indicator (barra color-coded)
- [ ] Method badge (exact/fuzzy/llm)
- [ ] Alternativas listadas con confidence

---

## Estrategias y Recomendaciones

### 1. Reutilizacion de Componentes

- **ColorPicker**: Si no existe como componente UI global, crearlo en `components/ui/ColorPicker.tsx` para reuso en accounts, wallets, categories, etc.
- **IconPicker**: Tambien candidato a `components/ui/IconPicker.tsx` si se usara en otros features.
- **CategoryPicker**: Mantenerlo en features/categories (es especifico de dominio) pero exportarlo para uso externo.

### 2. Animaciones del Arbol

Para la animacion de expand/collapse, puedes usar:

```css
/* En tu CSS o con Tailwind */
.tree-item-enter {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 300ms ease, opacity 200ms ease;
}
.tree-item-enter-active {
  max-height: 200px; /* suficientemente grande */
  opacity: 1;
}
```

O usar `framer-motion` si ya esta en el proyecto (no esta en stack actual, pero es opcional).

### 3. Profundidad Maxima del Arbol

El backend deberia limitar la profundidad a 2 niveles. En el frontend:
- Deshabilitar la opcion de agregar subcategoria si la categoria actual ya es una subcategoria.
- Mostrar tooltip: "Las subcategorias no pueden tener subcategorias"

### 4. Multiple Tipos de Categoria

Cada categoria tiene un `type` fijo (expense/income/transfer/adjustment). Esto es importante:
- Al crear subcategoria, hereda el type del padre automaticamente.
- El CategoryPicker debe filtrar por type cuando se usa en contextos especificos (ej: solo categorias de gasto en un formulario de gasto).
- Los colores de gradiente y badges deben coincidir con el type.

### 5. Categorias del Sistema

Las categorias del sistema (is_system=true) tienen restricciones:
- No se pueden eliminar (ocultar boton eliminar)
- No se puede cambiar el tipo
- Se puede editar nombre, icono, color (o no — depende del diseño)
- Mostrar un candado o badge "Sistema" para identificarlas
- En el formulario de edicion, mostrar campos como readonly si es del sistema

### 6. Performance del Arbol

Para ~20-50 categorias (tipico), no se necesita virtualizacion. Si hay ~100+:
- Solo renderizar nodos expandidos
- Usar `React.memo` en CategoryTreeItem
- Evitar re-renders innecesarios

### 7. AI Categorization Testing

El endpoint `POST /ai/categorize` es para testing y desarrollo. El usuario escribe una descripcion de transaccion y ve como la IA la clasificaria. Esto es util para:
- Verificar que las categorias estan bien configuradas
- Entender como la IA interpreta las descripciones
- Ajustar reglas de categorizacion

El resultado incluye:
- `method`: "exact" (coincidencia exacta con regla), "fuzzy" (coincidencia aproximada), "llm" (clasificacion por IA generativa)
- `confidence`: 0.0-1.0
- `alternatives`: otras categorias posibles con su confidence

### 8. Codigo de Barras de Confidence

```typescript
function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color = confidence >= 0.8
    ? 'from-emerald-400 to-emerald-600'
    : confidence >= 0.5
    ? 'from-amber-400 to-amber-600'
    : 'from-red-400 to-red-600'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Confianza</span>
        <span className="font-bold tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

### 9. Estrategia de Cache para AI

El endpoint de AI categorization NO modifica datos, asi que no invalidar nada. Pero para evitar llamadas repetidas con el mismo input, podrias cachear resultados recientes en un Map local:

```typescript
const [cache, setCache] = useState<Map<string, AICategorizeResponse>>(new Map())
// Antes de llamar al API, revisar cache
// Cache key: description.toLowerCase().trim()
```

### 10. Testing Manual Sugerido

```
1. Abrir /categories → ver arbol vacio con empty state
2. Crear categoria "Comida" de tipo "Gasto" con icono Utensils y color rojo
3. Crear subcategoria "Restaurantes" con parent Comida
4. Crear subcategoria "Supermercado" con parent Comida
5. Verificar que aparecen anidadas en el arbol
6. Editar "Restaurantes" → cambiar color
7. Intentar crear subcategoria de "Restaurantes" → deberia estar deshabilitado
8. Ir a detalle de "Comida" → ver subcategorias inline
9. Agregar subcategoria desde detalle
10. Eliminar "Restaurantes" desde detalle
11. Probar AI Categorization: escribir "Cena en italiano" → ver prediccion
12. Verificar dark mode en todas las paginas
13. Verificar responsive en mobile
14. Verificar que CategoryPicker funciona eligiendo categoria
```
