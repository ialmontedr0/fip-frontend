import { cn } from '@/lib/utils'

interface AiStatusDotProps {
  trained: boolean
  className?: string
}

function AiStatusDot({ trained, className }: AiStatusDotProps) {
  return (
    <span className={cn('relative flex h-3.5 w-3.5', className)}>
      <span className={cn(
        'absolute inline-flex h-full w-full rounded-full opacity-75 animate-[ping_2s_ease-in-out_infinite]',
        trained ? 'bg-green-400' : 'bg-red-400',
      )} />
      <span className={cn(
        'absolute -inset-1 rounded-full opacity-20',
        trained ? 'bg-green-400' : 'bg-red-400',
      )} />
      <span className={cn(
        'relative inline-flex h-3.5 w-3.5 rounded-full shadow-md',
        trained ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30',
      )} />
    </span>
  )
}

export default AiStatusDot
