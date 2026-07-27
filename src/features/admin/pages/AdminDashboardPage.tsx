import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Shield, Users, Key, ScrollText, BarChart3, ArrowRight } from 'lucide-react'
import SystemStatsCards from '../components/SystemStatsCards'
import AdminNav from '../components/AdminNav'

const LINKS = [
  {
    path: '/admin/users',
    label: 'Usuarios',
    description: 'Gestion de usuarios, roles y estado',
    icon: Users,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
  },
  {
    path: '/admin/roles',
    label: 'Roles',
    description: 'Crear y gestionar roles del sistema',
    icon: Shield,
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/20',
  },
  {
    path: '/admin/permissions',
    label: 'Permisos',
    description: 'Explorar permisos disponibles',
    icon: Key,
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/20',
  },
  {
    path: '/admin/audit-logs',
    label: 'Auditoria',
    description: 'Registro de actividades del sistema',
    icon: ScrollText,
    gradient: 'from-cyan-500 to-blue-500',
    shadow: 'shadow-cyan-500/20',
  },
  {
    path: '/admin/stats',
    label: 'Estadisticas',
    description: 'M&eacute;tricas del sistema',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
  },
]

function AdminLink({ path, label, description, icon: Icon, gradient, shadow }: typeof LINKS[number]) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(path)}
      className="group relative w-full text-left rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shadow-lg shrink-0 bg-gradient-to-br', gradient, shadow)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {label}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <ArrowRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>
    </button>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <AdminNav />

      <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-gray-100 bg-white/80 px-6 pb-5 pt-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Panel de Administraci&oacute;n</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gesti&oacute;n del sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LINKS.map((link) => (
          <AdminLink key={link.path} {...link} />
        ))}
      </div>

      <div className="pt-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Estad&iacute;sticas del Sistema</h2>
        <SystemStatsCards />
      </div>
    </div>
  )
}
