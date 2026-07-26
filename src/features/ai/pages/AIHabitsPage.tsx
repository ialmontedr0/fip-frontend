import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import HabitsDashboard from '../components/HabitsDashboard'

function AIHabitsPage() {
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
        <AIPageHeader title="Analisis de Habitos" subtitle="Comprende tus patrones de gasto" className="flex-1" />
      </div>

      <AINav />

      <HabitsDashboard />
    </div>
  )
}

export default AIHabitsPage
