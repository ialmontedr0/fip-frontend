import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useRequestPasswordReset } from '../hooks/useAuth'

const resetSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email invalido'),
})

type ResetFormData = z.infer<typeof resetSchema>

function RequestResetPage() {
  const resetMutation = useRequestPasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = (data: ResetFormData) => {
    resetMutation.mutate(data)
  }

  const isSuccess = resetMutation.isSuccess

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Restablecer Contrasena
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena
        </p>
      </div>

      {isSuccess ? (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
          <p className="text-sm text-green-800 dark:text-green-200">
            Si el email esta registrado, recibiras un enlace para restablecer tu contrasena.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={resetMutation.isPending}
          >
            Enviar Enlace
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          Volver a Inicio de Sesion
        </Link>
      </p>
    </div>
  )
}

export default RequestResetPage
