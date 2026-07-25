import { useNavigate, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { NAV_TABS } from '../constants'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function BudgetNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 1023px)')

  const activeIndex = NAV_TABS.findIndex((tab) => {
    if (tab.path === '/budgets') return location.pathname === '/budgets'
    return location.pathname.startsWith(tab.path)
  })

  const currentTab = NAV_TABS[activeIndex] || NAV_TABS[0]

  if (isMobile) {
    return (
      <div className="flex items-center justify-between gap-3 mb-6">
        <select
          value={currentTab.path}
          onChange={(e) => navigate(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
          aria-label="Navegacion de presupuestos"
        >
          {NAV_TABS.map((tab) => (
            <option key={tab.path} value={tab.path}>{tab.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => navigate('/budgets/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="relative flex bg-gray-100 dark:bg-gray-800/80 rounded-xl p-1">
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out"
          style={{
            width: `${100 / NAV_TABS.length}%`,
            transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
          }}
        />
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab === currentTab
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => navigate('/budgets/new')}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        Nuevo presupuesto
      </button>
    </div>
  )
}
