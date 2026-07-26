import { cn } from '@/lib/utils'
import { Sun, Moon } from 'lucide-react'

interface ActiveToggleProps {
  isActive: boolean
  onChange: (active: boolean) => void
  disabled?: boolean
}

export default function ActiveToggle({ isActive, onChange, disabled }: ActiveToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={disabled}
      onClick={() => onChange(!isActive)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
        isActive
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
          : 'bg-gray-300 dark:bg-gray-600',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {isActive && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-sm animate-pulse" />
      )}
      <span
        className={cn(
          'relative inline-flex h-5 w-5 items-center justify-center transform rounded-full bg-white shadow-md ring-0 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
          isActive ? 'translate-x-5' : 'translate-x-0',
        )}
      >
        {isActive ? (
          <Sun className="h-2.5 w-2.5 text-amber-500" />
        ) : (
          <Moon className="h-2.5 w-2.5 text-gray-400" />
        )}
      </span>
    </button>
  )
}
