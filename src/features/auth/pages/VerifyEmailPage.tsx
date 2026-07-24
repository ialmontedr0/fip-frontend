import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { useVerifyEmail, useRequestEmailVerification } from '../hooks/useAuth'

function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>()
  const verifyMutation = useVerifyEmail()
  const requestVerificationMutation = useRequestEmailVerification()

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (verifyMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Verificando tu email...
        </p>
      </div>
    )
  }

  if (verifyMutation.isError) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            El enlace de verificacion es invalido o ha expirado.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => requestVerificationMutation.mutate()}
          isLoading={requestVerificationMutation.isPending}
        >
          Reenviar verificacion
        </Button>
        <div>
          <Link
            to="/dashboard"
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (verifyMutation.isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            Email verificado exitosamente!
          </p>
        </div>
        <Link
          to="/dashboard"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          Ir al Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default VerifyEmailPage
