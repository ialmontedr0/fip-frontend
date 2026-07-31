import api from '@/lib/api'
import type {
  NotificationListResponse, Notification,
  NotificationStatsResponse, NotificationPreferences,
  NotificationPreferenceUpdate, BulkMarkReadRequest,
  BulkMarkReadResponse, NotificationTestResponse,
} from '@/types/notifications'

export function listNotifications(params?: {
  channel?: string
  type?: string
  is_read?: boolean
  skip?: number
  limit?: number
}) {
  return api.get<NotificationListResponse>('/notifications', { params })
}

export function getNotification(id: string) {
  return api.get<Notification>(`/notifications/${id}`)
}

export function markRead(id: string) {
  return api.patch<{ success: boolean }>(`/notifications/${id}/read`)
}

export function deleteNotification(id: string) {
  return api.delete(`/notifications/${id}`)
}

export function bulkMarkRead(data: BulkMarkReadRequest) {
  return api.post<BulkMarkReadResponse>('/notifications/bulk-read', data)
}

export function markAllRead() {
  return api.post<BulkMarkReadResponse>('/notifications/read-all')
}

export function deleteRead() {
  return api.delete<BulkMarkReadResponse>('/notifications/read')
}

export function bulkDelete(data: BulkMarkReadRequest) {
  return api.post<BulkMarkReadResponse>('/notifications/bulk-delete', data)
}

export function getNotificationStats() {
  return api.get<NotificationStatsResponse>('/notifications/stats')
}

export function getNotificationPreferences() {
  return api.get<NotificationPreferences>('/notifications/preferences')
}

export function updateNotificationPreferences(data: NotificationPreferenceUpdate) {
  return api.put<NotificationPreferences>('/notifications/preferences', data)
}

export function sendTestNotification(params: { channel?: string; telegramChatId?: string } = {}) {
  return api.post<NotificationTestResponse>('/notifications/test', { channel: params.channel || 'telegram', telegram_chat_id: params.telegramChatId || null })
}

export function generateTelegramLinkCode() {
  return api.post<{ code: string }>('/telegram/link-code')
}

export function checkTelegramLink() {
  return api.get<{ linked: boolean; telegram_chat_id?: string | null }>('/telegram/check-link')
}

export function unlinkTelegram() {
  return api.post<{ success: boolean }>('/telegram/unlink')
}
