import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ChannelToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function ChannelToggle({ enabled, onChange }: ChannelToggleProps) {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (animating) {
      const t = setTimeout(() => setAnimating(false), 300)
      return () => clearTimeout(t)
    }
  }, [animating])

  const handleClick = () => {
    setAnimating(true)
    onChange(!enabled)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={handleClick}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        enabled
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md shadow-emerald-500/30'
          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-flex h-5 w-5 items-center justify-center transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          enabled ? 'translate-x-5' : 'translate-x-0',
          animating && 'scale-90',
        )}
      >
        {enabled ? (
          <svg className="h-2.5 w-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-2.5 w-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </span>
    </button>
  )
}
