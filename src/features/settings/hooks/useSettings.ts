import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as settingsApi from '../api/settings'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import type {
  UpdateProfileRequest, UpdatePreferencesRequest, DisableMFARequest, LogoutSessionRequest,
} from '@/types/settings'

// ── Query Keys ──

export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  preferences: () => [...settingsKeys.all, 'preferences'] as const,
  supportedValues: () => [...settingsKeys.all, 'supported-values'] as const,
  sessions: () => [...settingsKeys.all, 'sessions'] as const,
}

// ── Profile ──

export function useProfile() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: () => settingsApi.getProfile().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      settingsApi.updateProfile(data).then((r) => r.data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: settingsKeys.profile() })
      updateUser({
        phone: res.user.phone ?? undefined,
        avatar_url: res.user.avatar_url ?? undefined,
      })
      toast.success('Perfil actualizado')
    },
    onError: () => toast.error('Error al actualizar perfil'),
  })
}

// ── Preferences ──

export function usePreferences() {
  return useQuery({
    queryKey: settingsKeys.preferences(),
    queryFn: () => settingsApi.getPreferences().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdatePreferences() {
  const qc = useQueryClient()
  const setTheme = useThemeStore((s) => s.setTheme)

  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) =>
      settingsApi.updatePreferences(data).then((r) => r.data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: settingsKeys.preferences() })
      if (res.preferences.theme === 'light' || res.preferences.theme === 'dark') {
        setTheme(res.preferences.theme)
      }
      toast.success('Preferencias actualizadas')
    },
    onError: () => toast.error('Error al actualizar preferencias'),
  })
}

export function useSupportedValues() {
  return useQuery({
    queryKey: settingsKeys.supportedValues(),
    queryFn: () => settingsApi.getSupportedValues().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  })
}

// ── MFA ──

export function useEnableMFA() {
  return useMutation({
    mutationFn: () => settingsApi.enableMFA().then((r) => r.data),
    onError: () => toast.error('Error al configurar MFA'),
  })
}

export function useConfirmMFA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => settingsApi.confirmMFA(code).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.profile() })
      toast.success('MFA activado correctamente')
    },
    onError: () => toast.error('C\u00f3digo inv\u00e1lido. Intenta de nuevo'),
  })
}

export function useDisableMFA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DisableMFARequest) =>
      settingsApi.disableMFA(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.profile() })
      toast.success('MFA deshabilitado')
    },
    onError: () => toast.error('Error al deshabilitar MFA'),
  })
}

// ── Sessions ──

export function useSessions() {
  return useQuery({
    queryKey: settingsKeys.sessions(),
    queryFn: () => settingsApi.getSessions().then((r) => r.data),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  })
}

export function useLogoutSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: LogoutSessionRequest) =>
      settingsApi.logoutSession(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.sessions() })
      toast.success('Sesi\u00f3n cerrada')
    },
    onError: () => toast.error('Error al cerrar sesi\u00f3n'),
  })
}

export function useLogoutAllSessions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => settingsApi.logoutAllSessions().then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.sessions() })
      toast.success('Todas las sesiones cerradas')
    },
    onError: () => toast.error('Error al cerrar sesiones'),
  })
}
