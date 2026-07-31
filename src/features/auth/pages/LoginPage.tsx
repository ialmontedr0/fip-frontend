import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)

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

      <div className="relative">
        <Input
          label="Contrasena"
          type={showPassword ? 'text' : 'password'}
          placeholder="********"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[2.15rem] flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          aria-pressed={showPassword}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

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
