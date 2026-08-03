export type NotificationType =
  | 'transaction_alert'
  | 'budget_warning'
  | 'budget_alert'
  | 'budget_closed'
  | 'goal_completed'
  | 'goal_milestone'
  | 'bill_due'
  | 'payment_due'
  | 'anomaly_detected'
  | 'automation_executed'
  | 'security_alert'
  | 'system'
  | 'marketing'

export type NotificationChannel = 'email' | 'push' | 'telegram' | 'discord' | 'webhook'

export interface Notification {
  id: string
  channel: NotificationChannel
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  is_sent: boolean
  sent_at: string | null
  created_at: string
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
}

export interface NotificationStatsResponse {
  total: number
  unread: number
  by_channel: Record<string, number>
  by_type: Record<string, number>
}

export interface NotificationPreferences {
  email_enabled: boolean
  push_enabled: boolean
  telegram_enabled: boolean
  discord_enabled: boolean
  webhook_enabled: boolean
  email_types: Record<string, boolean> | null
  push_types: Record<string, boolean> | null
  telegram_types: Record<string, boolean> | null
  discord_types: Record<string, boolean> | null
  webhook_types: Record<string, boolean> | null
  telegram_chat_id: string | null
  discord_webhook_url: string | null
  webhook_url: string | null
}

export interface NotificationPreferenceUpdate {
  email_enabled?: boolean
  push_enabled?: boolean
  telegram_enabled?: boolean
  discord_enabled?: boolean
  webhook_enabled?: boolean
  email_types?: Record<string, boolean>
  push_types?: Record<string, boolean>
  telegram_types?: Record<string, boolean>
  discord_types?: Record<string, boolean>
  webhook_types?: Record<string, boolean>
  telegram_chat_id?: string | null
  discord_webhook_url?: string | null
  webhook_url?: string | null
}

export interface BulkMarkReadRequest {
  notification_ids: string[]
}

export interface BulkMarkReadResponse {
  success: boolean
  count: number
}

export interface NotificationTestResult {
  success: boolean
  channel: string
  error: string | null
}

export interface NotificationTestResponse {
  success: boolean
  results: NotificationTestResult[]
}
