import { cn } from '@/lib/utils'

interface AISectionHeaderProps {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  gradient?: string
  className?: string
}

function AISectionHeader({ icon, title, subtitle, gradient = 'from-purple-500 to-indigo-600', className }: AISectionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 animate-fade-in', className)}>
      {icon && (
        <div className={cn('relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-purple-500/15 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105', gradient)}>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 to-white/0 animate-[pulse_3s_ease-in-out_infinite]" />
          <div className="relative">
            {icon}
          </div>
        </div>
      )}
      <div>
        <h2 className="text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default AISectionHeader
