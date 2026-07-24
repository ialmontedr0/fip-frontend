import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useAICategorization, useCategories } from '../hooks/useCategories'
import CategoryBadge from './CategoryBadge'
import { Sparkles, Cpu, Zap, Brain } from 'lucide-react'
import type { AICategorizeResponse } from '@/types/categories'

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
        <span className="font-bold tabular-nums" style={{ color: confidence >= 0.8 ? '#059669' : confidence >= 0.5 ? '#d97706' : '#dc2626' }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function MethodBadge({ method }: { method: string }) {
  const config: Record<string, { icon: typeof Zap; label: string; color: string; bg: string }> = {
    rule: { icon: Zap, label: 'Regla', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    ml: { icon: Cpu, label: 'ML', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    fallback: { icon: Brain, label: 'Sin coincidencia', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  }
  const c = config[method] ?? config.fallback
  const Icon = c.icon
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', c.bg, c.color)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  )
}

export default function AICategorizationTool() {
  const [description, setDescription] = useState('')
  const [result, setResult] = useState<AICategorizeResponse | null>(null)
  const categorize = useAICategorization()
  const { data: categoriesData } = useCategories()

  const handleCategorize = async () => {
    if (!description.trim()) return
    setResult(null)
    const res = await categorize.mutateAsync({ description: description.trim() })
    setResult(res)
  }

  const getCategoryInfo = (categoryId: string | null) => {
    if (!categoryId || !categoriesData?.categories) return null
    for (const cat of categoriesData.categories) {
      if (cat.id === categoryId) return { name: cat.name, icon: cat.icon, color: cat.color }
      for (const sub of cat.subcategories) {
        if (sub.id === categoryId) return { name: sub.name, icon: sub.icon, color: sub.color }
      }
    }
    return null
  }

  const categoryInfo = result ? getCategoryInfo(result.category_id) : null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-100/80 bg-gradient-to-br from-violet-50/80 to-white/80 p-5 backdrop-blur-xl shadow-sm dark:border-violet-900/50 dark:from-violet-500/10 dark:to-gray-900/80">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            AI Categorization Test
          </h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Ingresa una descripcion de transaccion para ver como la IA la categoriza automaticamente.
        </p>

        <div className="space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Cena en italiano con amigos, Pago de nomina, Transferencia a cuenta de ahorros..."
            rows={3}
            className={cn(
              'w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm backdrop-blur-sm transition-all',
              'dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200',
              'focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20',
              'placeholder:text-gray-400 resize-none',
            )}
            onKeyDown={(e) => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && handleCategorize()}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleCategorize}
              disabled={!description.trim() || categorize.isPending}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {categorize.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Categorizando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Categorizar
                </span>
              )}
            </Button>
          </div>
        </div>

        {categorize.isPending && (
          <div className="mt-4 animate-pulse space-y-3 rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
            <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        )}

        {result && !categorize.isPending && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div className="rounded-xl border border-violet-100 bg-white/80 p-4 dark:border-violet-900/50 dark:bg-gray-800/80">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Categoria Asignada</p>
                  {categoryInfo ? (
                    <CategoryBadge
                      name={categoryInfo.name}
                      icon={categoryInfo.icon}
                      color={categoryInfo.color}
                      size="md"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">ID: {result.category_id}</span>
                  )}
                </div>
                <MethodBadge method={result.method} />
              </div>

              <ConfidenceBar confidence={result.confidence} />

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700">
                  {result.method === 'rule' ? 'Coincidencia por regla' : result.method === 'ml' ? 'Clasificacion ML' : 'Sin coincidencia — entrena el clasificador en /ai'}
                </span>
                {result.rule_name && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700">
                    Regla: {result.rule_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {categorize.isError && !categorize.isPending && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            Error al categorizar. Intenta de nuevo.
          </div>
        )}
      </div>
    </div>
  )
}
