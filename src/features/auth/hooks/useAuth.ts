import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth-store'
import {
  loginApi, registerApi, verifyMFAApi, logoutApi,
  requestPasswordResetApi, resetPasswordApi,
  verifyEmailApi, requestEmailVerificationApi,
  enableMFAApi, disableMFAApi,
  getSessionsApi, revokeSessionApi,
} from '../api/auth'
import type {
  LoginRequest, RegisterRequest, MFAVerifyRequest,
  ResetPasswordRequest, VerifyEmailRequest,
} from '../types'

export function useLogin() {
  const storeLogin = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data).then((r) => r.data),
    onSuccess: (data) => {
      if (data.requires_mfa && data.mfa_token) {
        navigate('/mfa', { state: { mfa_token: data.mfa_token } })
        return
      }
      if (data.user && data.tokens) {
        storeLogin(data.user, data.tokens)
        toast.success('Inicio de sesion exitoso')
        navigate('/dashboard')
      }
    },
    onError: () => {
      toast.error('Credenciales invalidas. Intenta de nuevo.')
    },
  })
}

export function useRegister() {
  const storeLogin = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data).then((r) => r.data),
    onSuccess: (data) => {
      if (data.user && data.tokens) {
        storeLogin(data.user, data.tokens)
        toast.success('Registro exitoso. Bienvenido!')
        navigate('/dashboard')
      }
    },
    onError: () => {
      toast.error('Error al registrarse. Verifica tus datos.')
    },
  })
}

export function useMFAVerify() {
  const storeLogin = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: MFAVerifyRequest) => verifyMFAApi(data).then((r) => r.data),
    onSuccess: (data) => {
      if (data.user && data.tokens) {
        storeLogin(data.user, data.tokens)
        toast.success('Verificacion exitosa')
        navigate('/dashboard')
      }
    },
    onError: () => {
      toast.error('Codigo invalido. Intenta de nuevo.')
    },
  })
}

export function useLogout() {
  const storeLogout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logoutApi().then((r) => r.data),
    onSettled: () => {
      storeLogout()
      queryClient.clear()
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: { email: string }) => requestPasswordResetApi(data).then((r) => r.data),
    onSuccess: () => {
      toast.success('Revisa tu correo para restablecer tu contrasena')
    },
    onError: () => {
      toast.error('No se pudo enviar el correo. Verifica el email.')
    },
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPasswordApi(data).then((r) => r.data),
    onSuccess: () => {
      toast.success('Contrasena restablecida exitosamente')
      navigate('/login')
    },
    onError: () => {
      toast.error('Error al restablecer la contrasena. El token puede haber expirado.')
    },
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmailApi(data).then((r) => r.data),
    onSuccess: () => {
      toast.success('Email verificado exitosamente')
    },
    onError: () => {
      toast.error('Error al verificar el email. El token puede haber expirado.')
    },
  })
}

export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: () => requestEmailVerificationApi().then((r) => r.data),
    onSuccess: () => {
      toast.success('Email de verificacion enviado')
    },
    onError: () => {
      toast.error('Error al enviar el email de verificacion')
    },
  })
}

export function useEnableMFA() {
  return useMutation({
    mutationFn: () => enableMFAApi().then((r) => r.data),
  })
}

export function useDisableMFA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { code: string }) => disableMFAApi(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('MFA deshabilitado')
    },
  })
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessionsApi().then((r) => r.data),
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (session_id: string) => revokeSessionApi(session_id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Sesion revocada')
    },
  })
}
