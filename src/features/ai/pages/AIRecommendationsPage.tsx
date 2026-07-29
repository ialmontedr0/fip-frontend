import { useState } from 'react'
import { useGetRecommendations, useLatestRecommendations } from '../hooks/useAI'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import RecommendationsFeed from '../components/RecommendationsFeed'
import { cn } from '@/lib/utils'
import { Lightbulb, Loader2, Sparkles, RefreshCw, Clock, AlertCircle } from 'lucide-react'

function AIRecommendationsPage() {
  const generateMutation = useGetRecommendations()
  const latestQuery = useLatestRecommendations()
  const [hasGenerated, setHasGenerated] = useState(false)

  const latest = latestQuery.data
  const recommendations = hasGenerated ? (generateMutation.data?.recommendations ?? latest?.recommendations) : latest?.recommendations
  const estimatedTotalSavings = hasGenerated ? (generateMutation.data?.estimated_total_savings ?? latest?.estimated_total_savings) : latest?.estimated_total_savings

  const handleGetRecommendations = () => {
    setHasGenerated(true)
    generateMutation.mutate(undefined)
  }

  const hasBatch = latest?.has_batch && !hasGenerated
  const showNewDataHint = latest?.has_new_transactions && !hasGenerated

  if (!recommendations && !generateMutation.isPending && !generateMutation.isError && !latestQuery.isLoading) {
    if (!hasBatch) {
      return (
        <div className="relative space-y-8 pb-8 animate-fade-in">
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-yellow-500/8 blur-3xl dark:bg-yellow-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
          </div>
          <div className="flex items-center gap-2">
            <BackButton to="/ai/dashboard" />
            <AIPageHeader title="Recomendaciones" subtitle="Recomendaciones personalizadas de IA" className="flex-1" />
          </div>
          <AINav />
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 mb-4">
              <Lightbulb className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Recomendaciones IA</p>
            <p className="text-sm text-gray-400 mb-6">Genera recomendaciones personalizadas para optimizar tus finanzas</p>
            <button
              type="button"
              onClick={handleGetRecommendations}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
                'hover:from-amber-600 hover:to-yellow-600 hover:shadow-lg',
              )}
            >
              <Sparkles className="h-4 w-4" />
              Generar recomendaciones
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-yellow-500/8 blur-3xl dark:bg-yellow-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/ai/dashboard" />
        <AIPageHeader title="Recomendaciones" subtitle="Recomendaciones personalizadas de IA" className="flex-1">
          <button
            type="button"
            onClick={handleGetRecommendations}
            disabled={generateMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-60"
          >
            {generateMutation.isPending ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generando...</>
            ) : (
              <><RefreshCw className="h-3.5 w-3.5" /> Regenerar</>
            )}
          </button>
        </AIPageHeader>
      </div>

      <AINav />

      {showNewDataHint && !generateMutation.isPending && !hasGenerated && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-700/40 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 backdrop-blur-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Nuevas transacciones detectadas</p>
            <p className="text-xs text-amber-500 dark:text-amber-400">Hay transacciones nuevas desde la ultima generacion. Regenera para obtener recomendaciones actualizadas.</p>
          </div>
          <button
            type="button"
            onClick={handleGetRecommendations}
            disabled={generateMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-60 shrink-0"
          >
            {generateMutation.isPending ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generando...</>
            ) : (
              <><RefreshCw className="h-3.5 w-3.5" /> Regenerar</>
            )}
          </button>
        </div>
      )}

      {!hasBatch && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-700/40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 backdrop-blur-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {latestQuery.isLoading ? 'Cargando...' : 'Genera tus primeras recomendaciones'}
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400">Haz clic en "Generar" para obtener recomendaciones personalizadas.</p>
          </div>
          <button
            type="button"
            onClick={handleGetRecommendations}
            disabled={generateMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-60 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" /> Generar
          </button>
        </div>
      )}

      {latest?.last_generated_at && !hasGenerated && (
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Clock className="h-3 w-3" />
          Ultima generacion: {new Date(latest.last_generated_at).toLocaleString('es-DO')}
        </div>
      )}

      <RecommendationsFeed
        recommendations={recommendations ?? []}
        isLoading={generateMutation.isPending || latestQuery.isLoading}
        isError={generateMutation.isError || latestQuery.isError}
        onRetry={handleGetRecommendations}
        estimatedTotalSavings={estimatedTotalSavings ?? 0}
      />
    </div>
  )
}

export default AIRecommendationsPage