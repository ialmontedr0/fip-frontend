import { useState } from 'react'
import { useClassifyTransaction } from '../hooks/useAI'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import AISectionHeader from '../components/AISectionHeader'
import ClassificationResultCard from '../components/ClassificationResultCard'
import BatchClassificationPanel from '../components/BatchClassificationPanel'
import TrainClassifierButton from '../components/TrainClassifierButton'
import ClassifierStatusCard from '../components/ClassifierStatusCard'
import { cn } from '@/lib/utils'
import { Tags, Layers, BrainCircuit, Cpu } from 'lucide-react'

function AIClassifyPage() {
  const [activeTab, setActiveTab] = useState<'individual' | 'batch'>('individual')
  const classifyMutation = useClassifyTransaction()
  const [result, setResult] = useState<{ predicted_category: string | null; confidence: number; model_version: string; reason: string } | null>(null)

  const handleClassify = () => {
    classifyMutation.mutate(
      { transaction_id: 'current', description: 'Transaccion de ejemplo' },
      {
        onSuccess: (data) => setResult(data),
      },
    )
  }

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/ai/dashboard" />
        <AIPageHeader title="Clasificacion" subtitle="Clasifica transacciones con IA" className="flex-1" />
      </div>

      <AINav />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('individual')}
              className={cn(
                'flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-medium transition-all',
                activeTab === 'individual'
                  ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 border-t border-l border-r border-gray-200 dark:border-gray-700 -mb-[2px]'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              )}
            >
              <Tags className="h-3.5 w-3.5" />
              Individual
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('batch')}
              className={cn(
                'flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-medium transition-all',
                activeTab === 'batch'
                  ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 border-t border-l border-r border-gray-200 dark:border-gray-700 -mb-[2px]'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              Por lote
            </button>
          </div>

          {activeTab === 'individual' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Selecciona una transaccion para clasificar individualmente.
                </p>
                <button
                  type="button"
                  onClick={handleClassify}
                  disabled={classifyMutation.isPending}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200',
                    'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
                    'hover:from-purple-600 hover:to-indigo-600 hover:shadow-md',
                    classifyMutation.isPending && 'opacity-60 cursor-wait',
                  )}
                >
                  <Tags className="h-3.5 w-3.5" />
                  {classifyMutation.isPending ? 'Clasificando...' : 'Clasificar transaccion'}
                </button>
              </div>

              {result && (
                <ClassificationResultCard
                  predicted_category={result.predicted_category}
                  confidence={result.confidence}
                  model_version={result.model_version}
                  reason={result.reason}
                />
              )}
            </div>
          )}

          {activeTab === 'batch' && <BatchClassificationPanel />}

          <AISectionHeader icon={<BrainCircuit className="h-3.5 w-3.5 text-white" />} title="Entrenamiento" subtitle="Entrena el clasificador" />
          <TrainClassifierButton />
        </div>

        <div className="space-y-4">
          <AISectionHeader icon={<Cpu className="h-3.5 w-3.5 text-white" />} title="Estado" />
          <ClassifierStatusCard />
        </div>
      </div>
    </div>
  )
}

export default AIClassifyPage
