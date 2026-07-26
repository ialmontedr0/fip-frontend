import { useState } from 'react'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import SavingsOptimizerDashboard from '../components/SavingsOptimizerDashboard'
import SavingsSimulatorPanel from '../components/SavingsSimulatorPanel'
import { cn } from '@/lib/utils'
import { PiggyBank, Calculator } from 'lucide-react'

function AISavingsPage() {
  const [activeTab, setActiveTab] = useState<'optimization' | 'simulator'>('optimization')

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-teal-500/8 blur-3xl dark:bg-teal-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-green-500/5 blur-3xl dark:bg-green-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/ai/dashboard" />
        <AIPageHeader title="Ahorros" subtitle="Optimiza tus ahorros con IA" className="flex-1" />
      </div>

      <AINav />

      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('optimization')}
          className={cn(
            'flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-medium transition-all',
            activeTab === 'optimization'
              ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 border-t border-l border-r border-gray-200 dark:border-gray-700 -mb-[2px]'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          )}
        >
          <PiggyBank className="h-3.5 w-3.5" />
          Optimizacion
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={cn(
            'flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-medium transition-all',
            activeTab === 'simulator'
              ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 border-t border-l border-r border-gray-200 dark:border-gray-700 -mb-[2px]'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          )}
        >
          <Calculator className="h-3.5 w-3.5" />
          Simulador
        </button>
      </div>

      {activeTab === 'optimization' && <SavingsOptimizerDashboard />}
      {activeTab === 'simulator' && <SavingsSimulatorPanel />}
    </div>
  )
}

export default AISavingsPage
