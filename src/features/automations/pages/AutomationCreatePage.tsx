import BackButton from '@/features/ai/components/BackButton'
import AIPageHeader from '@/features/ai/components/AIPageHeader'
import AutomationCreateWizard from '../components/CreateWizard/AutomationCreateWizard'
import { Zap } from 'lucide-react'

function AutomationCreatePage() {
  return (
    <div className="relative space-y-6 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/automations" />
        <AIPageHeader
          title="Nueva regla"
          subtitle="Crea una automatizacion financiera"
          icon={<Zap className="h-6 w-6 text-white" />}
          className="flex-1"
        />
      </div>

      <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-transparent" />

      <AutomationCreateWizard />
    </div>
  )
}

export default AutomationCreatePage
