import { cn } from '@/lib/utils'
import { BrainCircuit } from 'lucide-react'

interface AIPageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

function AIPageHeader({ title, subtitle, icon, children, className }: AIPageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in', className)}>
      <div>
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/30 to-indigo-500/30 animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              {icon || <BrainCircuit className="h-6 w-6 text-white" />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '100ms' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export default AIPageHeader
