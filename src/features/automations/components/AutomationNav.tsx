import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Bot, PlusCircle, ChevronDown } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/automations', label: 'Dashboard', icon: Bot },
  { href: '/automations/new', label: 'Nueva regla', icon: PlusCircle },
]

function ActivePill({ style }: { style: React.CSSProperties }) {
  return (
    <span
      className="absolute inset-y-1.5 left-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-200/50 dark:border-purple-500/30 shadow-lg shadow-purple-500/10 transition-all duration-400 ease-out z-0 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
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

  const getMatch = (href: string) => {
    if (href === '/automations') return location.pathname === '/automations'
    return location.pathname.startsWith(href)
  }

  const activeIndex = NAV_ITEMS.findIndex((item) => getMatch(item.href))

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
    <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-700/80 shadow-sm transition-all duration-300 hover:shadow-md">
      <div ref={containerRef} className="relative flex p-1.5 gap-1 overflow-x-auto scrollbar-none">
        <ActivePill style={pillStyle} />
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon
          const active = i === activeIndex
          return (
            <button
              key={item.href}
              data-nav-item
              onClick={() => navigate(item.href)}
              className={cn(
                'relative z-10 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-300 select-none whitespace-nowrap',
                'hover:bg-white/50 dark:hover:bg-gray-700/50',
                active
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400',
                mounted && !active && 'hover:scale-[1.04] hover:shadow-md',
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Icon className={cn(
                'h-4 w-4 transition-all duration-300',
                active
                  ? 'scale-110 bg-gradient-to-br from-purple-500 to-indigo-500 bg-clip-text text-transparent'
                  : 'group-hover:rotate-12 group-hover:scale-110',
              )} style={active ? { fill: 'url(#gradient)' } : undefined} />
              <span className="hidden sm:inline">{item.label}</span>
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_6px_rgba(139,92,246,0.4)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MobileSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const getMatch = (href: string) => {
    if (href === '/automations') return location.pathname === '/automations'
    return location.pathname.startsWith(href)
  }

  const activeItem = NAV_ITEMS.find((item) => getMatch(item.href)) || NAV_ITEMS[0]
  const Icon = activeItem.icon

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
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-700/80 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-200/80 dark:hover:border-gray-600/80 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-lg shadow-purple-500/10">
            <Icon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span>{activeItem.label}</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl bg-white/90 dark:bg-gray-900/90 border border-gray-100/80 dark:border-gray-700/80 shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-1">
              {NAV_ITEMS.map((item, i) => {
                const active = getMatch(item.href)
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => { navigate(item.href); setOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-0.5',
                    )}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200',
                      active ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-sm' : 'bg-gray-100 dark:bg-gray-700/50',
                    )}>
                      <ItemIcon className={cn('h-3.5 w-3.5', active ? 'text-purple-600 dark:text-purple-400' : '')} />
                    </div>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function AutomationNav() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div className="animate-fade-in-up">
      {isDesktop ? <DesktopNav /> : <MobileSelect />}
    </div>
  )
}
