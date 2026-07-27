import { cn } from '@/lib/utils'
import { Users, Shield, Key, ScrollText, Activity, LogIn } from 'lucide-react'
import { useSystemStats } from '../hooks/useAdmin'

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  gradient: string
}

function StatCard({ title, value, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shadow-lg', gradient)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        </div>
      </div>
    </div>
  )
}

export default function SystemStatsCards() {
  const { data, isLoading } = useSystemStats()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Total Usuarios" value={data.total_users} icon={Users} gradient="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20" />
      <StatCard title="Usuarios Activos" value={data.active_users} icon={Activity} gradient="bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/20" />
      <StatCard title="Roles" value={data.total_roles} icon={Shield} gradient="bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/20" />
      <StatCard title="Permisos" value={data.total_permissions} icon={Key} gradient="bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/20" />
      <StatCard title="Auditor&iacute;as" value={data.total_audit_entries} icon={ScrollText} gradient="bg-gradient-to-br from-cyan-500 to-blue-500 shadow-cyan-500/20" />
      <StatCard title="Login Recientes" value={data.recent_logins} icon={LogIn} gradient="bg-gradient-to-br from-violet-500 to-purple-500 shadow-violet-500/20" />
    </div>
  )
}
