import { useState } from 'react'
import BackButton from '@/features/ai/components/BackButton'
import AIPageHeader from '@/features/ai/components/AIPageHeader'
import AutomationNav from '../components/AutomationNav'
import AutomationSummaryCards from '../components/AutomationSummaryCards'
import AutomationFilters from '../components/AutomationFilters'
import AutomationListTable from '../components/AutomationListTable'
import QuickSetupModal from '../components/QuickSetupModal'
import { useAutomations, useAutomationSummary, useEvaluateAll, useToggleRule, useDeleteRule, useExecuteRule } from '../hooks/useAutomations'
import { PlusCircle, Play, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AutomationRule } from '@/types/automations'

type ActiveFilter = 'all' | 'active' | 'inactive'

function AutomationListPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [triggerTypeFilter, setTriggerTypeFilter] = useState('')
  const [quickSetupOpen, setQuickSetupOpen] = useState(false)

  const { data: rules, isLoading, isError, refetch } = useAutomations({
    is_active: activeFilter === 'all' ? undefined : activeFilter === 'active',
    trigger_type: triggerTypeFilter || undefined,
  })
  const { data: summary } = useAutomationSummary()
  const evaluateAll = useEvaluateAll()
  const toggleRule = useToggleRule()
  const deleteRule = useDeleteRule()
  const executeRule = useExecuteRule()

  const handleToggle = (rule: AutomationRule) => {
    toggleRule.mutate(rule.id)
  }

  const handleDelete = (rule: AutomationRule) => {
    deleteRule.mutate(rule.id)
  }

  const handleExecute = async (ruleId: string) => {
    const res = await executeRule.mutateAsync({ id: ruleId })
    return res?.data
  }

  return (
    <div className="relative space-y-6 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />

        <div className="absolute top-24 left-[15%] h-1.5 w-1.5 rounded-full bg-purple-400/30 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 right-[20%] h-2.5 w-2.5 rounded-full bg-indigo-400/20 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-[22%] h-2 w-2 rounded-full bg-violet-400/25 animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
        <div className="absolute top-[55%] right-[15%] h-1.5 w-1.5 rounded-full bg-purple-300/20 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/dashboard" />
        <AIPageHeader
          title="Automatizaciones"
          subtitle="Reglas IF/THEN para automatizar tus finanzas"
          className="flex-1"
        />
      </div>

      <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-transparent" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/automations/new')}
          className="group inline-flex items-center gap-2 rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200/80 dark:hover:border-emerald-500/30"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:shadow-emerald-500/40 group-hover:scale-110">
            <PlusCircle className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-90" />
          </div>
          <span className="font-semibold">Nueva regla</span>
        </button>
        <button
          type="button"
          onClick={() => evaluateAll.mutate(undefined)}
          disabled={evaluateAll.isPending}
          className="group inline-flex items-center gap-2 rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200/80 dark:hover:border-indigo-500/30"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:shadow-indigo-500/40 group-hover:scale-110">
            <Play className="h-4 w-4 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-semibold">Evaluar todas</span>
        </button>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <AutomationNav />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <AutomationSummaryCards summary={summary} />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <AutomationFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          triggerTypeFilter={triggerTypeFilter}
          onTriggerTypeChange={setTriggerTypeFilter}
        />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <AutomationListTable
          rules={rules?.rules}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          onSelect={(rule) => navigate(`/automations/${rule.id}`)}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onExecute={handleExecute}
          executePending={executeRule.isPending}
        />
      </div>

      <button
        type="button"
        onClick={() => setQuickSetupOpen(true)}
        className="group fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-500/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <Zap className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </button>

      <QuickSetupModal open={quickSetupOpen} onClose={() => setQuickSetupOpen(false)} />
    </div>
  )
}

export default AutomationListPage
