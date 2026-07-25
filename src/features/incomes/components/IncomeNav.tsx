import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  List, BarChart3, Building2, CalendarDays, Repeat, AlertTriangle,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/incomes', label: 'Lista', icon: List },
  { href: '/incomes/summary', label: 'Resumen', icon: BarChart3 },
  { href: '/incomes/sources', label: 'Fuentes', icon: Building2 },
  { href: '/incomes/schedule', label: 'Programacion', icon: CalendarDays },
  { href: '/incomes/recurring', label: 'Recurrentes', icon: Repeat },
  { href: '/incomes/irregular', label: 'Irregulares', icon: AlertTriangle },
]

export default function IncomeNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const getMatch = (href: string) => {
    if (href === '/incomes') return location.pathname === '/incomes'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="flex overflow-x-auto hide-scrollbar p-1.5 gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = getMatch(item.href)
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
                isActive
                  ? 'text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50',
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 animate-fade-in" />
              )}
              <Icon className={cn('relative z-10 h-4 w-4', isActive && 'scale-110')} />
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </div>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  )
}
