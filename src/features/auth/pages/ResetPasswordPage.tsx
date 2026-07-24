import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useResetPassword } from '../hooks/useAuth'

const resetSchema = z
  .object({
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contrasena'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

type ResetFormData = z.infer<typeof resetSchema>

function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const resetMutation = useResetPassword()
  const isSuccess = resetMutation.isSuccess

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = (data: ResetFormData) => {
    if (!token) return
    resetMutation.mutate({ token, password: data.password })
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 dark:text-red-400">Token invalido o faltante</p>
        <Link
          to="/reset-password"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            Contrasena restablecida exitosamente
          </p>
        </div>
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          Iniciar Sesion
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Nueva Contrasena
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ingresa tu nueva contrasena
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nueva Contrasena"
          type="password"
          placeholder="Minimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmar Contrasena"
          type="password"
          placeholder="Repite la contrasena"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={resetMutation.isPending}
        >
          Restablecer Contrasena
        </Button>
      </form>
    </div>
  )
}

export default ResetPasswordPage
