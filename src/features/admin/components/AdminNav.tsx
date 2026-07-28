import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  LayoutDashboard, Users, Shield, Key, ScrollText, BarChart3, ChevronDown,
} from 'lucide-react'

const TABS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Usuarios', icon: Users },
  { path: '/admin/roles', label: 'Roles', icon: Shield },
  { path: '/admin/permissions', label: 'Permisos', icon: Key },
  { path: '/admin/audit-logs', label: 'Auditoria', icon: ScrollText },
  { path: '/admin/stats', label: 'Estadisticas', icon: BarChart3 },
]

function ActivePill({ style }: { style: React.CSSProperties }) {
  return (
    <span
      className="absolute inset-y-1.5 left-0 rounded-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-200/50 dark:border-gray-600/50 transition-all duration-400 ease-out z-0"
      style={style}
    />
  )
}

function DesktopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({ opacity: 0 })
  const [mounted, setMounted] = useState(false)

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const activeIndex = TABS.findIndex((t) => isActive(t.path))

  useEffect(() => {
    if (!containerRef.current || activeIndex === -1) return
    const items = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-nav-item]')
    const activeEl = items[activeIndex]
    if (!activeEl) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = activeEl.getBoundingClientRect()

    requestAnimationFrame(() => {
      setPillStyle({
        width: rect.width,
        height: rect.height,
        transform: `translateX(${rect.left - containerRect.left}px)`,
        opacity: 1,
      })
      setMounted(true)
    })
  }, [activeIndex, location.pathname])

  return (
    <div
      ref={containerRef}
      className="relative flex rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-1.5 gap-1 overflow-visible"
    >
      <ActivePill style={pillStyle} />
      {TABS.map((tab, i) => {
        const Icon = tab.icon
        const active = i === activeIndex
        return (
          <button
            key={tab.path}
            data-nav-item
            onClick={() => navigate(tab.path)}
            className={cn(
              'relative z-10 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 select-none',
              'hover:bg-white/50 dark:hover:bg-gray-700/50',
              active
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400',
              mounted && !active && 'hover:scale-[1.02]',
            )}
          >
            <Icon className={cn(
              'h-4 w-4 transition-transform duration-200',
              active && 'scale-110 text-purple-600 dark:text-purple-400',
            )} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function MobileSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const activeTab = TABS.find((t) => isActive(t.path)) || TABS[0]
  const Icon = activeTab.icon

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/10">
            <Icon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span>{activeTab.label}</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {TABS.map((tab) => {
              const active = isActive(tab.path)
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.path}
                  onClick={() => { navigate(tab.path); setOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  )}
                >
                  <div className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-lg',
                    active ? 'bg-purple-100 dark:bg-purple-500/20' : 'bg-gray-100 dark:bg-gray-700/50',
                  )}>
                    <TabIcon className="h-3.5 w-3.5" />
                  </div>
                  <span>{tab.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminNav() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div className="animate-fade-in">
      {isDesktop ? <DesktopNav /> : <MobileSelect />}
    </div>
  )
}
