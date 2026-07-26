import { useState } from 'react'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import ModelRegistryTable from '../components/ModelRegistryTable'
import ModelDetailPanel from '../components/ModelDetailPanel'
import type { ModelItem } from '@/types/ai'
import { FileJson } from 'lucide-react'

function AIModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null)

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
        <AIPageHeader title="Modelos de IA" subtitle="Registro y gestion de modelos" className="flex-1" />
      </div>

      <AINav />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ModelRegistryTable onSelect={setSelectedModel} selectedId={selectedModel?.id} />
        </div>
        <div className="lg:col-span-2">
          {selectedModel ? (
            <ModelDetailPanel modelId={selectedModel.id} />
          ) : (
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-400">
                <FileJson className="h-8 w-8 mb-2 text-gray-300 dark:text-gray-600" />
                Selecciona un modelo para ver sus detalles
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIModelsPage
