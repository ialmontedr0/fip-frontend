import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Settings, User, Shield, SlidersHorizontal, Bell, ArrowRight } from 'lucide-react'

const LINKS = [
  {
    path: '/settings/profile',
    label: 'Perfil',
    description: 'Informaci&oacute;n personal y foto',
    icon: User,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    path: '/settings/security',
    label: 'Seguridad',
    description: 'Contrase&ntilde;a, MFA y sesiones',
    icon: Shield,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    path: '/settings/preferences',
    label: 'Preferencias',
    description: 'Idioma, moneda y formato',
    icon: SlidersHorizontal,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    path: '/settings/notifications',
    label: 'Notificaciones',
    description: 'Canales y tipos de notificaci&oacute;n',
    icon: Bell,
    gradient: 'from-purple-500 to-pink-500',
  },
]

export default function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="relative space-y-8 pb-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-gray-100 bg-white/80 px-6 pb-5 pt-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg shadow-gray-500/20">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Configuraci&oacute;n</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Administra tu cuenta y preferencias</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {LINKS.map((link) => {
          const Icon = link.icon
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="group relative w-full text-left rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shadow-lg shrink-0 bg-gradient-to-br', link.gradient)}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dangerouslySetInnerHTML={{ __html: link.description }} />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
