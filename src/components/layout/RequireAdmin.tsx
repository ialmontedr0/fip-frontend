import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import Spinner from '@/components/ui/Spinner'

function RequireAdmin() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default RequireAdmin
