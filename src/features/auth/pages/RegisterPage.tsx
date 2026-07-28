import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useRegister } from '../hooks/useAuth'

const registerSchema = z
  .object({
    email: z.string().min(1, 'El email es requerido').email('Email invalido'),
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contrasena'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterPage() {
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
    })
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
        isLoading={registerMutation.isPending}
      >
        Crear Cuenta
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          Inicia Sesion
        </Link>
      </p>
    </form>
  )
}

export default RegisterPage
