import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as notificationsApi from '../api/notifications'
import type { NotificationPreferenceUpdate } from '@/types/notifications'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...notificationKeys.lists(), filters] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  )
}

export function useNotifications(params?: {
  channel?: string
  type?: string
  is_read?: boolean
  skip?: number
  limit?: number
}) {
  return useQuery({
    queryKey: notificationKeys.list(cleanParams(params as Record<string, unknown>)),
    queryFn: () => notificationsApi.listNotifications(params).then((r) => r.data),
    staleTime: 1000 * 15,
  })
}

export function useNotification(id: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.detail(id!),
    queryFn: () => notificationsApi.getNotification(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useNotificationStats() {
  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: () => notificationsApi.getNotificationStats().then((r) => r.data),
    refetchInterval: 30000,
    staleTime: 1000 * 15,
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsApi.getNotificationPreferences().then((r) => r.data),
    staleTime: 1000 * 60,
  })
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
    },
  })
}

export function useBulkMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      notificationsApi.bulkMarkRead({ notification_ids: ids }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
      toast.success(`${res.data.count} notificaciones marcadas como leídas`)
    },
    onError: () => toast.error('Error al marcar notificaciones'),
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
      toast.success('Notificación eliminada')
    },
    onError: () => toast.error('Error al eliminar notificación'),
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NotificationPreferenceUpdate) =>
      notificationsApi.updateNotificationPreferences(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() })
      toast.success('Preferencias actualizadas')
    },
    onError: () => toast.error('Error al actualizar preferencias'),
  })
}

export function useGenerateTelegramLinkCode() {
  return useMutation({
    mutationFn: () => notificationsApi.generateTelegramLinkCode().then((r) => r.data),
    onError: () => toast.error('Error al generar codigo de vinculacion'),
  })
}

export function useCheckTelegramLink() {
  return useQuery({
    queryKey: [...notificationKeys.all, 'telegram-link'] as const,
    queryFn: () => notificationsApi.checkTelegramLink().then((r) => r.data),
    refetchInterval: (query) => (query.state.data?.linked ? false : 2000),
    staleTime: 0,
  })
}

export function useSendTestNotification() {
  return useMutation({
    mutationFn: (params: { channel: string; telegramChatId?: string }) => notificationsApi.sendTestNotification(params).then((r) => r.data),
    onSuccess: (data) => {
      const successCount = data.results.filter((r) => r.success).length
      const failCount = data.results.filter((r) => !r.success).length
      if (failCount === 0) {
        toast.success(`Notificación de prueba enviada a ${successCount} canal(es)`)
      } else {
        toast.success(`Enviada a ${successCount} canal(es), ${failCount} fallaron`)
        data.results
          .filter((r) => !r.success)
          .forEach((r) => toast.error(`${r.channel}: ${r.error}`))
      }
    },
    onError: () => toast.error('Error al enviar notificación de prueba'),
  })
}
