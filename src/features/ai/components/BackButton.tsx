import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  to?: string
  className?: string
}

function BackButton({ to, className }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-700/80',
        'text-gray-500 dark:text-gray-400 shadow-sm',
        'hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-500/10 dark:hover:to-indigo-500/10',
        'hover:text-purple-600 dark:hover:text-purple-400',
        'hover:border-purple-200/80 dark:hover:border-purple-500/30',
        'hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5',
        'active:scale-95',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      Volver
    </button>
  )
}

export default BackButton
