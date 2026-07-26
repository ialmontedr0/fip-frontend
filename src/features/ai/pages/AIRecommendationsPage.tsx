import { useState } from 'react'
import { useGetRecommendations } from '../hooks/useAI'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import RecommendationsFeed from '../components/RecommendationsFeed'
import { cn } from '@/lib/utils'
import { Lightbulb, Loader2, Sparkles } from 'lucide-react'

function AIRecommendationsPage() {
  const mutation = useGetRecommendations()
  const [data, setData] = useState<{
    recommendations: import('@/types/ai').RecommendationItem[]
    total: number
    high_priority: number
    estimated_total_savings: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGetRecommendations = () => {
    setError(null)
    mutation.mutate(undefined, {
      onSuccess: (result) => setData(result),
      onError: (err) => setError(err instanceof Error ? err.message : 'Error al obtener recomendaciones'),
    })
  }

  if (!data && !mutation.isPending && !error) {
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
            disabled={mutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-60"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generando...</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Generar</>
            )}
          </button>
        </AIPageHeader>
      </div>

      <AINav />

      <RecommendationsFeed
        recommendations={data?.recommendations}
        isLoading={mutation.isPending}
        isError={!!error}
        onRetry={handleGetRecommendations}
        estimatedTotalSavings={data?.estimated_total_savings}
      />
    </div>
  )
}

export default AIRecommendationsPage
