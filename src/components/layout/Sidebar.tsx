import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tags,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  CreditCard,
  Landmark,
  BarChart3,
  Brain,
  Bot,
  Bell,
  Upload,
  Download,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

const navigation = [
  {
    section: 'Principal',
    items: [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    section: 'Finanzas',
    items: [
      { name: 'Cuentas', href: '/accounts', icon: Wallet },
      { name: 'Wallets', href: '/wallets', icon: PiggyBank },
      { name: 'Transacciones', href: '/transactions', icon: ArrowLeftRight },
      { name: 'Categorias', href: '/categories', icon: Tags },
    ],
  },
  {
    section: 'Ingresos y Gastos',
    items: [
      { name: 'Ingresos', href: '/incomes', icon: TrendingUp },
      { name: 'Gastos', href: '/expenses', icon: TrendingDown },
    ],
  },
  {
    section: 'Planificacion',
    items: [
      { name: 'Metas', href: '/goals', icon: Target },
      { name: 'Presupuestos', href: '/budgets', icon: PiggyBank },
      { name: 'Tarjetas', href: '/cards', icon: CreditCard },
      { name: 'Prestamos', href: '/loans', icon: Landmark },
    ],
  },
  {
    section: 'Inteligencia',
    items: [
      { name: 'Analitica', href: '/analytics', icon: BarChart3 },
      { name: 'IA', href: '/ai', icon: Brain },
      { name: 'Automatizaciones', href: '/automations', icon: Bot },
    ],
  },
  {
    section: 'Sistema',
    items: [
      { name: 'Notificaciones', href: '/notifications', icon: Bell },
      { name: 'Importar', href: '/imports', icon: Upload },
      { name: 'Exportar', href: '/exports', icon: Download },
      { name: 'Admin', href: '/admin/users', icon: Shield },
      { name: 'Configuracion', href: '/settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

function Sidebar({ mobile, onClose }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold text-gray-900 dark:text-white">FIP</span>
          )}
        </div>
        {mobile ? (
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
        {navigation.map((section) => (
          <div key={section.section}>
            {sidebarOpen && (
              <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                {section.section}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={mobile ? onClose : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                        !sidebarOpen && 'justify-center',
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )

  if (mobile) {
    return (
      <div className="fixed inset-0 z-40 flex lg:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative flex w-72 max-w-[calc(100vw-3rem)] flex-col bg-white dark:bg-gray-900">
          {content}
        </div>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      {content}
    </aside>
  )
}

export default Sidebar
