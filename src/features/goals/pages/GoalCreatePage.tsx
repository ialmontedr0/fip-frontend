import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Target } from 'lucide-react'
import GoalCreateWizard from '../components/GoalCreateWizard'

export default function GoalCreatePage() {
  const navigate = useNavigate()

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate('/goals')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Metas
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nueva Meta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Define tu proximo objetivo financiero
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <GoalCreateWizard />
        </div>
      </div>
    </div>
  )
}
