import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useLogin } from '../hooks/useAuth'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Contrasena"
        type="password"
        placeholder="********"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-end">
        <Link
          to="/reset-password"
          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Olvidaste tu contrasena?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={loginMutation.isPending}
      >
        Iniciar Sesion
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        No tienes cuenta?{' '}
        <Link
          to="/register"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          Registrate
        </Link>
      </p>
    </form>
  )
}

export default LoginPage
