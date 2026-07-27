import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Loader2, Shield } from 'lucide-react'
import { useUpdateUserRole, useAdminRoles } from '../hooks/useAdmin'

interface UserRoleSelectProps {
  userId: string
  currentRole: string
}

export default function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState(currentRole)
  const { data: rolesData } = useAdminRoles()
  const mutation = useUpdateUserRole()

  const handleChange = (newRole: string) => {
    setRole(newRole)
    mutation.mutate(
      { userId, role: newRole },
      { onError: () => setRole(currentRole) },
    )
  }

  return (
    <div className="relative">
      <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      <select
        value={role}
        onChange={(e) => handleChange(e.target.value)}
        disabled={mutation.isPending}
        className={cn(
          'w-full rounded-lg border pl-8 pr-8 py-2 text-xs font-medium transition-all appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
          'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600',
          'text-gray-900 dark:text-gray-100',
          mutation.isPending && 'opacity-50 cursor-not-allowed',
        )}
      >
        {rolesData?.roles.map((r) => (
          <option key={r.name} value={r.name}>
            {r.display_name}
          </option>
        ))}
      </select>
      {mutation.isPending && (
        <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-purple-500" />
      )}
    </div>
  )
}
