import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
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
  ShoppingCart,
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
  ChevronDown,
  X,
  AlertTriangle,
  Lightbulb,
  Activity,
  Cpu,
} from 'lucide-react'

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> }
type NavSection = { section: string; items: (NavItem | { name: string; icon: React.ComponentType<{ className?: string }>; children: NavItem[] })[] }

function useNavigation(): NavSection[] {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const sistemaItems: (NavItem | { name: string; icon: React.ComponentType<{ className?: string }>; children: NavItem[] })[] = [
    { name: 'Notificaciones', href: '/notifications', icon: Bell },
    { name: 'Importar', href: '/imports', icon: Upload },
    { name: 'Exportar', href: '/exports', icon: Download },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: Shield }] : []),
    { name: 'Configuracion', href: '/settings', icon: Settings },
  ]

  return [
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
        { name: 'Compras a Credito', href: '/credit-purchases', icon: ShoppingCart },
      ],
    },
    {
      section: 'Inteligencia',
      items: [
        { name: 'Analitica', href: '/analytics', icon: BarChart3 },
        {
          name: 'IA', icon: Brain,
          children: [
            { name: 'Dashboard', href: '/ai/dashboard', icon: LayoutDashboard },
            { name: 'Clasificar', href: '/ai/classify', icon: Tags },
            { name: 'Predecir', href: '/ai/predict', icon: TrendingUp },
            { name: 'Anomalias', href: '/ai/anomalies', icon: AlertTriangle },
            { name: 'Recomendaciones', href: '/ai/recommendations', icon: Lightbulb },
            { name: 'Habitos', href: '/ai/habits', icon: Activity },
            { name: 'Riesgos', href: '/ai/risks', icon: Shield },
            { name: 'Ahorros', href: '/ai/savings', icon: PiggyBank },
            { name: 'Modelos', href: '/ai/models', icon: Cpu },
          ],
        },
        { name: 'Automatizaciones', href: '/automations', icon: Bot },
      ],
    },
    {
      section: 'Sistema',
      items: sistemaItems,
    },
  ]
}

function NavSubmenu({ item, sidebarOpen, mobile, onClose }: { item: { name: string; icon: React.ComponentType<{ className?: string }>; children: NavItem[] }; sidebarOpen: boolean; mobile?: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(false)
  const Icon = item.icon

  return (
    <li>
      <button
        type="button"
        onClick={() => sidebarOpen && setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
          !sidebarOpen && 'justify-center',
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {sidebarOpen && (
          <>
            <span className="flex-1 text-left">{item.name}</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </>
        )}
      </button>
      {sidebarOpen && open && (
        <ul className="ml-3 mt-1 space-y-0.5 border-l-2 border-purple-200 dark:border-purple-800 pl-3">
          {item.children.map((child) => (
            <li key={child.name}>
              <NavLink
                to={child.href}
                onClick={mobile ? onClose : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                  )
                }
              >
                <child.icon className="h-4 w-4 flex-shrink-0" />
                <span>{child.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

function Sidebar({ mobile, onClose }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const navigation = useNavigation()

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="FIP" className="h-8 w-8 rounded-lg" />
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
              {section.items.map((item) => {
                if ('children' in item) {
                  return <NavSubmenu key={item.name} item={item} sidebarOpen={sidebarOpen} mobile={mobile} onClose={onClose} />
                }
                return (
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
                )
              })}
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
