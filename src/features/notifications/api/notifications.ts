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

export function getNotificationStats() {
  return api.get<NotificationStatsResponse>('/notifications/stats')
}

export function getNotificationPreferences() {
  return api.get<NotificationPreferences>('/notifications/preferences')
}

export function updateNotificationPreferences(data: NotificationPreferenceUpdate) {
  return api.put<NotificationPreferences>('/notifications/preferences', data)
}

export function sendTestNotification() {
  return api.post<NotificationTestResponse>('/notifications/test')
}
