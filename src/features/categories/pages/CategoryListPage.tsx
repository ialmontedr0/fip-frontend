import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import CategoryTree, { CategoryTreeSkeleton } from '../components/CategoryTree'
import CategoryStatsWidget from '../components/CategoryStatsWidget'
import AICategorizationTool from '../components/AICategorizationTool'
import { ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { CATEGORY_TYPE_CONFIG } from '../constants'
import { Plus, Tags, Sparkles } from 'lucide-react'
import type { CategoryType } from '@/types/categories'

const TYPE_FILTERS: Array<{ value: string; label: string; gradient: string }> = [
  { value: '', label: 'Todas', gradient: 'from-primary-400 to-primary-600' },
  ...(Object.entries(CATEGORY_TYPE_CONFIG) as [CategoryType, typeof CATEGORY_TYPE_CONFIG[CategoryType]][]).map(([key, config]) => ({
    value: key,
    label: config.label,
    gradient: config.gradient,
  })),
]

export default function CategoryListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeType = searchParams.get('category_type') || ''
  const [showAI, setShowAI] = useState(false)
  const { data, isLoading, isError, error } = useCategories(
    activeType ? { category_type: activeType } : undefined,
  )

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute -left-32 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-violet-200/30 to-fuchsia-200/20 blur-3xl dark:from-violet-500/10 dark:to-fuchsia-500/5" />
      <div className="pointer-events-none absolute -right-20 top-40 h-56 w-56 rounded-full bg-gradient-to-br from-amber-200/20 to-rose-200/20 blur-3xl dark:from-amber-500/5 dark:to-rose-500/5" />

      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-violet-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Categorias</h1>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Gestiona las categorias para clasificar tus transacciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAI(!showAI)}>
            <Sparkles className="mr-1.5 h-4 w-4" />
            Probar IA
          </Button>
          <Button onClick={() => navigate('/categories/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoria
          </Button>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <CategoryStatsWidget />
      </div>

      {showAI && (
        <div className="animate-fade-in" style={{ animationDelay: '0.08s', animationFillMode: 'both' }}>
          <AICategorizationTool />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              if (filter.value) params.set('category_type', filter.value)
              else params.delete('category_type')
              setSearchParams(params)
            }}
            className={cn(
              'relative overflow-hidden whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
              activeType === filter.value
                ? 'bg-gradient-to-r text-white shadow-md shadow-violet-500/20'
                : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-sm dark:bg-gray-800/70 dark:text-gray-400 dark:hover:bg-gray-800',
              activeType === filter.value && filter.gradient,
            )}
          >
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
        <button
          onClick={() => navigate('/categories/new')}
          className="whitespace-nowrap rounded-full border-2 border-dashed border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-400 transition-all hover:border-primary-300 hover:text-primary-500 dark:border-gray-600 dark:hover:border-primary-500"
        >
          <Plus className="mr-1 inline h-3.5 w-3.5" />
          Nueva
        </button>
      </div>

      {isError && (
        <div className="animate-fade-in">
          <ErrorMessage
            message={(error as Error)?.message || 'Error al cargar las categorias'}
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {isLoading && (
        <div className={cn(
          'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-5 backdrop-blur-xl',
          'dark:border-gray-800/80 dark:bg-gray-900/80',
        )}>
          <CategoryTreeSkeleton />
        </div>
      )}

      {!isLoading && !isError && data?.categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-5 dark:from-gray-800 dark:to-gray-700">
            <Tags className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No tienes categorias aun
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs text-center">
            Crea categorias para organizar tus transacciones y mejorar el analisis financiero.
          </p>
          <Button onClick={() => navigate('/categories/new')} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Crear Categoria
          </Button>
        </div>
      )}

      {!isLoading && !isError && data && data.categories.length > 0 && (
        <div className={cn(
          'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 backdrop-blur-xl shadow-sm',
          'dark:border-gray-800/80 dark:bg-gray-900/80',
          'animate-fade-in',
        )} style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400" />
          <div className="relative p-5">
            <CategoryTree
              categories={data.categories}
              onSelect={(id) => navigate(`/categories/${id}`)}
              showType
            />
          </div>
        </div>
      )}
    </div>
  )
}
