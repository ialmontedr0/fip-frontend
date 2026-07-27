import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useUpdateUserStatus } from '../hooks/useAdmin'

interface UserStatusToggleProps {
  userId: string
  isActive: boolean
}

export default function UserStatusToggle({ userId, isActive }: UserStatusToggleProps) {
  const [checked, setChecked] = useState(isActive)
  const mutation = useUpdateUserStatus()

  const handleToggle = () => {
    const newValue = !checked
    setChecked(newValue)
    mutation.mutate(
      { userId, is_active: newValue },
      { onError: () => setChecked(!newValue) },
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={mutation.isPending}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-1',
        checked
          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
          : 'bg-gray-200 dark:bg-gray-600',
        mutation.isPending && 'opacity-50 cursor-not-allowed',
      )}
      role="switch"
      aria-checked={checked}
    >
      {mutation.isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-white mx-auto" />
      ) : (
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            'ring-1 ring-black/5',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      )}
    </button>
  )
}
