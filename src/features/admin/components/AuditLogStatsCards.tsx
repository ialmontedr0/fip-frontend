import { cn } from '@/lib/utils'
import { ScrollText, Activity, Siren, FolderOpen } from 'lucide-react'
import { useAuditLogStats } from '../hooks/useAdmin'

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  gradient: string
}

function StatCard({ title, value, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', gradient)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase">{title}</p>
        </div>
      </div>
    </div>
  )
}

export default function AuditLogStatsCards() {
  const { data, isLoading } = useAuditLogStats()

  if (isLoading || !data) return null

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Estad&iacute;sticas de Auditor&iacute;a
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Logs"
          value={data.total}
          icon={ScrollText}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Acciones"
          value={Object.keys(data.by_action).length}
          icon={Activity}
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        />
        <StatCard
          title="Recursos"
          value={Object.keys(data.by_resource).length}
          icon={FolderOpen}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
        />
        <StatCard
          title="Estados"
          value={Object.keys(data.by_status).length}
          icon={Siren}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
        />
      </div>
    </div>
  )
}
