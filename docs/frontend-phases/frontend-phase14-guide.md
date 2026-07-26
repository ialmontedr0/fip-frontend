# Fase 14: Notifications — Guia de Implementacion

## Arquitectura General

### Resumen
Sistema completo de notificaciones multi-canal que permite a los usuarios recibir alertas financieras, ver su historial, administrar preferencias por canal y tipo de evento, y configurar canales externos (Telegram, Discord, Webhook). El frontend se comunica con 10 endpoints REST del backend.

### Flujo de datos
```
Header (Bell icon + badge)
  ↳ GET /notifications/stats (polling 30s) → { total, unread, by_channel, by_type }
  ↳ Click → navigate('/notifications')

NotificacionesPage (drawer/full page)
  ↳ GET /notifications?skip=0&limit=50&is_read=false → list
  ↳ PATCH /notifications/{id}/read → mark single read
  ↳ POST /notifications/bulk-read → mark multiple read
  ↳ DELETE /notifications/{id} → delete single
  ↳ GET /notifications/stats → refresh badge

NotificationPreferencesPage
  ↳ GET /notifications/preferences → current prefs
  ↳ PUT /notifications/preferences → save prefs
  ↳ POST /notifications/test → test button per channel
```

### Endpoints Backend (10 total)

| Método | Ruta | Descripción | Schema Request | Schema Response |
|--------|------|-------------|---------------|-----------------|
| `POST` | `/notifications` | Crear notificación manual | `{ type, title, body, data?, channels? }` | `{ success, results[] }` |
| `GET` | `/notifications?channel=&type=&is_read=&skip=&limit=` | Listar notificaciones | Query params | `{ notifications[], total }` |
| `GET` | `/notifications/{id}` | Obtener una notificación | — | `NotificationResponse` |
| `PATCH` | `/notifications/{id}/read` | Marcar como leída | — | `{ success }` |
| `DELETE` | `/notifications/{id}` | Eliminar notificación | — | `204 No Content` |
| `GET` | `/notifications/preferences` | Obtener preferencias | — | `NotificationPreferenceResponse` |
| `PUT` | `/notifications/preferences` | Actualizar preferencias | `NotificationPreferenceUpdate` | `NotificationPreferenceResponse` |
| `POST` | `/notifications/test` | Enviar notificación de prueba a todos los canales habilitados | — | `{ success, results[] }` |
| `GET` | `/notifications/stats` | Estadísticas | — | `{ total, unread, by_channel, by_type }` |
| `POST` | `/notifications/bulk-read` | Marcar múltiples como leídas | `{ notification_ids: UUID[] }` | `{ success, count }` |

### NotificationResponse (schema completo)
```typescript
interface NotificationResponse {
  id: string
  channel: string    // 'email' | 'push' | 'telegram' | 'discord' | 'webhook'
  type: string       // ver NOTIFICATION_TYPES abajo
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  is_sent: boolean
  sent_at: string | null
  created_at: string
}
```

### NotificationPreferenceResponse (schema completo)
```typescript
interface NotificationPreferenceResponse {
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
```

### NotificationStatsResponse
```typescript
interface NotificationStatsResponse {
  total: number
  unread: number
  by_channel: Record<string, number>
  by_type: Record<string, number>
}
```

### NOTIFICATION_TYPES (categorías del backend)
Basado en los templates email y la configuración Discord del backend, estos son los tipos de notificación que existen:

| Tipo | Icono | Color | Descripción |
|------|-------|-------|-------------|
| `transaction_alert` | `ArrowRightLeft` | `blue` | Alerta de transacción grande/inusual |
| `budget_warning` | `PieChart` | `red` | Presupuesto cerca o sobre el límite |
| `budget_alert` | `AlertTriangle` | `amber` | Alerta de presupuesto (genérica) |
| `goal_completed` | `Flag` | `green` | Meta financiera completada |
| `goal_milestone` | `Target` | `emerald` | Hito de meta alcanzado |
| `bill_due` | `CreditCard` | `orange` | Factura próxima a vencer |
| `payment_due` | `CalendarClock` | `amber` | Pago programado próximo |
| `anomaly_detected` | `AlertTriangle` | `purple` | Anomalía financiera detectada |
| `automation_executed` | `Bot` | `teal` | Regla de automatización ejecutada |
| `security_alert` | `ShieldAlert` | `red` | Alerta de seguridad (login nuevo, etc.) |
| `system` | `Bell` | `slate` | Notificación del sistema |
| `marketing` | `Megaphone` | `blue` | Comunicación promocional/informativa |

### CHANNELS (canales de entrega)

| Canal | ID | Requiere Configuración | Ícono |
|-------|-----|----------------------|-------|
| In-App (Push) | `push` | No (siempre disponible) | `Bell` |
| Email | `email` | No (email del usuario) | `Mail` |
| Telegram | `telegram` | `TELEGRAM_BOT_TOKEN` + `telegram_chat_id` | `Send` |
| Discord | `discord` | `discord_webhook_url` | `MessageCircle` |
| Webhook | `webhook` | `webhook_url` (+ `webhook_secret`) | `Webhook` |

---

## 1. Tipos TypeScript (`src/types/notifications.ts`)

Crear archivo con todas las interfaces necesarias:

```typescript
// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType =
  | 'transaction_alert'
  | 'budget_warning'
  | 'budget_alert'
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
```

---

## 2. Constantes (`src/features/notifications/constants.ts`)

Define iconos, colores, labels para cada tipo y canal:

```typescript
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRightLeft, PieChart, AlertTriangle, Flag, Target,
  CreditCard, CalendarClock, Bot, ShieldAlert, Bell, Megaphone,
  Mail, Send, MessageCircle, Webhook,
} from 'lucide-react'
import type { NotificationType, NotificationChannel } from '@/types/notifications'

// ============================================================
// NOTIFICATION TYPE CONFIG
// ============================================================

export interface NotificationTypeConfig {
  type: NotificationType
  label: string
  icon: LucideIcon
  color: string           // Tailwind text/bg color
  gradient: string        // bg-gradient-to-br
  description: string
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  transaction_alert: {
    type: 'transaction_alert', label: 'Transacción', icon: ArrowRightLeft,
    color: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-400 to-blue-600',
    description: 'Alertas de transacciones grandes o inusuales',
  },
  budget_warning: {
    type: 'budget_warning', label: 'Presupuesto', icon: PieChart,
    color: 'text-red-600 dark:text-red-400', gradient: 'from-red-400 to-red-600',
    description: 'Presupuestos cerca o sobre el límite',
  },
  budget_alert: {
    type: 'budget_alert', label: 'Alerta de Presupuesto', icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400', gradient: 'from-amber-400 to-amber-600',
    description: 'Alertas generales de presupuesto',
  },
  goal_completed: {
    type: 'goal_completed', label: 'Meta Completada', icon: Flag,
    color: 'text-green-600 dark:text-green-400', gradient: 'from-green-400 to-green-600',
    description: 'Metas financieras alcanzadas',
  },
  goal_milestone: {
    type: 'goal_milestone', label: 'Hito de Meta', icon: Target,
    color: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-400 to-emerald-600',
    description: 'Hitos importantes de metas',
  },
  bill_due: {
    type: 'bill_due', label: 'Factura por Vencer', icon: CreditCard,
    color: 'text-orange-600 dark:text-orange-400', gradient: 'from-orange-400 to-orange-600',
    description: 'Facturas próximas a vencer',
  },
  payment_due: {
    type: 'payment_due', label: 'Pago Programado', icon: CalendarClock,
    color: 'text-amber-600 dark:text-amber-400', gradient: 'from-amber-400 to-amber-600',
    description: 'Pagos programados próximos',
  },
  anomaly_detected: {
    type: 'anomaly_detected', label: 'Anomalía', icon: AlertTriangle,
    color: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-400 to-purple-600',
    description: 'Actividad financiera anómala detectada',
  },
  automation_executed: {
    type: 'automation_executed', label: 'Automatización', icon: Bot,
    color: 'text-teal-600 dark:text-teal-400', gradient: 'from-teal-400 to-teal-600',
    description: 'Reglas de automatización ejecutadas',
  },
  security_alert: {
    type: 'security_alert', label: 'Seguridad', icon: ShieldAlert,
    color: 'text-red-600 dark:text-red-400', gradient: 'from-red-400 to-red-600',
    description: 'Alertas de seguridad de la cuenta',
  },
  system: {
    type: 'system', label: 'Sistema', icon: Bell,
    color: 'text-slate-600 dark:text-slate-400', gradient: 'from-slate-400 to-slate-600',
    description: 'Notificaciones del sistema',
  },
  marketing: {
    type: 'marketing', label: 'Marketing', icon: Megaphone,
    color: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-400 to-blue-600',
    description: 'Comunicaciones promocionales',
  },
}

// ============================================================
// CHANNEL CONFIG
// ============================================================

export interface ChannelConfig {
  channel: NotificationChannel
  label: string
  icon: LucideIcon
  description: string
  requiresConfig: boolean
  configFields?: ChannelConfigField[]
}

export interface ChannelConfigField {
  key: string
  label: string
  type: 'text' | 'password' | 'url'
  placeholder: string
  helpText: string
}

export const CHANNEL_CONFIG: Record<NotificationChannel, ChannelConfig> = {
  push: {
    channel: 'push', label: 'In-App', icon: Bell,
    description: 'Notificaciones dentro de la aplicación',
    requiresConfig: false,
  },
  email: {
    channel: 'email', label: 'Email', icon: Mail,
    description: 'Notificaciones por correo electrónico',
    requiresConfig: false,
  },
  telegram: {
    channel: 'telegram', label: 'Telegram', icon: Send,
    description: 'Notificaciones vía Telegram',
    requiresConfig: true,
    configFields: [
      {
        key: 'telegram_chat_id',
        label: 'Chat ID',
        type: 'text',
        placeholder: '123456789',
        helpText: 'Envía /start a @fip_bot para obtener tu Chat ID',
      },
    ],
  },
  discord: {
    channel: 'discord', label: 'Discord', icon: MessageCircle,
    description: 'Notificaciones vía Discord Webhook',
    requiresConfig: true,
    configFields: [
      {
        key: 'discord_webhook_url',
        label: 'Webhook URL',
        type: 'url',
        placeholder: 'https://discord.com/api/webhooks/...',
        helpText: 'Crea un Webhook en tu canal de Discord: Configuración > Integraciones > Webhooks',
      },
    ],
  },
  webhook: {
    channel: 'webhook', label: 'Webhook', icon: Webhook,
    description: 'Notificaciones vía Webhook HTTP',
    requiresConfig: true,
    configFields: [
      {
        key: 'webhook_url',
        label: 'Webhook URL',
        type: 'url',
        placeholder: 'https://tuservidor.com/webhook/fip',
        helpText: 'URL que recibirá un POST con el payload de la notificación',
      },
    ],
  },
}

// ============================================================
// FILTER OPTIONS
// ============================================================

export const NOTIFICATION_TYPE_OPTIONS = Object.values(NOTIFICATION_TYPE_CONFIG).map((c) => ({
  value: c.type,
  label: c.label,
  icon: c.icon,
  gradient: c.gradient,
}))

export const CHANNEL_OPTIONS = Object.values(CHANNEL_CONFIG).map((c) => ({
  value: c.channel,
  label: c.label,
  icon: c.icon,
}))

export const READ_STATUS_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'false', label: 'No leídas' },
  { value: 'true', label: 'Leídas' },
] as const

export const POLLING_INTERVAL = 30000 // 30 seconds
```

---

## 3. API Layer (`src/features/notifications/api/notifications.ts`)

Funciones API que envuelven los 10 endpoints:

```typescript
import api from '@/lib/api'
import type {
  NotificationListResponse, Notification,
  NotificationStatsResponse, NotificationPreferences,
  NotificationPreferenceUpdate, BulkMarkReadRequest,
  BulkMarkReadResponse, NotificationTestResponse,
} from '@/types/notifications'

// ============================================================
// NOTIFICATIONS CRUD
// ============================================================

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

// ============================================================
// STATISTICS
// ============================================================

export function getNotificationStats() {
  return api.get<NotificationStatsResponse>('/notifications/stats')
}

// ============================================================
// PREFERENCES
// ============================================================

export function getNotificationPreferences() {
  return api.get<NotificationPreferences>('/notifications/preferences')
}

export function updateNotificationPreferences(data: NotificationPreferenceUpdate) {
  return api.put<NotificationPreferences>('/notifications/preferences', data)
}

// ============================================================
// TEST
// ============================================================

export function sendTestNotification() {
  return api.post<NotificationTestResponse>('/notifications/test')
}
```

---

## 4. TanStack Query Hooks (`src/features/notifications/hooks/useNotifications.ts`)

Query keys, hooks para todas las operaciones CRUD y polling:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as notificationsApi from '../api/notifications'
import type { NotificationPreferenceUpdate } from '@/types/notifications'

// ============================================================
// QUERY KEYS
// ============================================================

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...notificationKeys.lists(), filters] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
}

// ============================================================
// QUERIES
// ============================================================

export function useNotifications(params?: {
  channel?: string
  type?: string
  is_read?: boolean
  skip?: number
  limit?: number
}) {
  return useQuery({
    queryKey: notificationKeys.list(params as Record<string, unknown>),
    queryFn: () => notificationsApi.listNotifications(params).then((r) => r.data),
    staleTime: 1000 * 15, // 15s fresh
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
    refetchInterval: 30000, // polling cada 30s
    staleTime: 1000 * 15,
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsApi.getNotificationPreferences().then((r) => r.data),
    staleTime: 1000 * 60, // 1 min
  })
}

// ============================================================
// MUTATIONS
// ============================================================

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

export function useSendTestNotification() {
  return useMutation({
    mutationFn: () => notificationsApi.sendTestNotification().then((r) => r.data),
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
```

---

## 5. Componentes Base

### 5.1 Estructura de archivos a crear

```
src/
  types/
    notifications.ts                    # Tipos
  features/
    notifications/
      api/
        notifications.ts                # Funciones API
      hooks/
        useNotifications.ts             # TanStack Query hooks
      components/
        NotificationDrawer.tsx          # Drawer lateral desde Header
        NotificationItem.tsx            # Item individual de notificación
        NotificationFilters.tsx         # Filtros por tipo/canal/estado
        NotificationEmptyState.tsx      # Estado vacío
        NotificationTypeBadge.tsx       # Badge con icono+color por tipo
        ChannelToggle.tsx               # Toggle on/off por canal
        ChannelConfigFields.tsx         # Campos de configuración por canal
        TypeToggleList.tsx              # Lista de toggles por tipo de evento
        TestNotificationButton.tsx      # Botón probar por canal
        NotificationStats.tsx           # Tarjetas de estadísticas
        LoadingSkeleton.tsx             # Skeleton para carga
      pages/
        NotificationsPage.tsx           # Página principal de notificaciones
        NotificationPreferencesPage.tsx # Página de preferencias
```

### 5.2 NotificationTypeBadge

Badge reutilizable que muestra el tipo de notificación con su icono y color:

```typescript
import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'
import type { NotificationType } from '@/types/notifications'

interface NotificationTypeBadgeProps {
  type: NotificationType
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export default function NotificationTypeBadge({
  type, showIcon = true, size = 'sm',
}: NotificationTypeBadgeProps) {
  const config = NOTIFICATION_TYPE_CONFIG[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        config.color,
        config.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-') + '/10',
      )}
    >
      {showIcon && <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />}
      {config.label}
    </span>
  )
}
```

### 5.3 NotificationItem

Componente de una notificación individual, con hover reveal para actions:

```typescript
import { useState } from 'react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Check, Trash2, ChevronRight } from 'lucide-react'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'
import type { Notification } from '@/types/notifications'

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  onClick?: (notification: Notification) => void
}

export default function NotificationItem({
  notification, onMarkRead, onDelete, onClick,
}: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false)
  const config = NOTIFICATION_TYPE_CONFIG[notification.type]
  const Icon = config?.icon

  return (
    <div
      className={cn(
        'group relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer',
        'hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30',
        notification.is_read
          ? 'border-gray-100/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-900/50'
          : 'border-purple-200/80 dark:border-purple-500/30 bg-white/90 dark:bg-gray-900/90 shadow-sm',
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex items-start gap-3">
        {/* Icono tipo */}
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg',
            'bg-gradient-to-br',
            config?.gradient ?? 'from-gray-400 to-gray-600',
          )}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              'text-sm font-semibold truncate',
              notification.is_read
                ? 'text-gray-600 dark:text-gray-400'
                : 'text-gray-900 dark:text-white',
            )}>
              {notification.title}
            </span>
            {!notification.is_read && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-purple-500 animate-pulse" />
            )}
          </div>
          <p className={cn(
            'text-xs leading-relaxed line-clamp-2',
            notification.is_read
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-500 dark:text-gray-400',
          )}>
            {notification.body}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {formatRelativeTime(notification.created_at)}
            </span>
            <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
            <span className="text-[10px] capitalize text-gray-400 dark:text-gray-500">
              {notification.channel}
            </span>
          </div>
        </div>

        {/* Actions hover */}
        <div className={cn(
          'flex items-center gap-1 transition-all duration-200',
          showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2',
        )}>
          {!notification.is_read && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id) }}
              className="rounded-lg p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
              title="Marcar como leída"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
            className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        </div>
      </div>

      {/* Indicador de "no leída" — barra lateral */}
      {!notification.is_read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-indigo-500" />
      )}
    </div>
  )
}
```

### 5.4 NotificationDrawer

Drawer lateral que se abre desde el Header (mejor experiencia que navegar a página completa):

```typescript
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { X, CheckCheck, Bell, Settings, ChevronRight } from 'lucide-react'
import { useNotifications, useNotificationStats, useMarkRead, useBulkMarkRead, useDeleteNotification } from '../hooks/useNotifications'
import NotificationItem from './NotificationItem'
import NotificationEmptyState from './NotificationEmptyState'
import { Skeleton, Badge } from '@/components/ui'
import type { Notification } from '@/types/notifications'

interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

export default function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('unread')

  const { data: stats } = useNotificationStats()
  const { data: notifData, isLoading } = useNotifications(
    activeFilter === 'unread' ? { is_read: false, limit: 50 } : { limit: 50 },
  )
  const markRead = useMarkRead()
  const bulkMarkRead = useBulkMarkRead()
  const deleteNotif = useDeleteNotification()

  const notifications = notifData?.notifications ?? []
  const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  // Click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  const handleClick = (notification: Notification) => {
    if (!notification.is_read) markRead.mutate(notification.id)
    // Si tiene data con link de navegación, navegar
    if (notification.data?.link) {
      navigate(notification.data.link as string)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={drawerRef}
        className={cn(
          'relative z-50 flex w-full max-w-lg flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl',
          'animate-in slide-in-from-right duration-300',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-gray-700/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notificaciones</h2>
            {stats && stats.unread > 0 && (
              <Badge variant="danger" size="sm">{stats.unread}</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadIds.length > 0 && (
              <button
                onClick={() => bulkMarkRead.mutate(unreadIds)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all"
              >
                <CheckCheck className="mr-1 inline-block h-3.5 w-3.5" />
                Leer todas
              </button>
            )}
            <button
              onClick={() => { navigate('/settings/notifications'); onClose() }}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100/80 dark:border-gray-700/50">
          <button
            onClick={() => setActiveFilter('unread')}
            className={cn(
              'rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all',
              activeFilter === 'unread'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50',
            )}
          >
            No leídas {stats ? `(${stats.unread})` : ''}
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all',
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50',
            )}
          >
            Todas
          </button>
          <button
            onClick={() => { navigate('/notifications'); onClose() }}
            className="ml-auto rounded-lg px-2.5 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all"
          >
            Ver todas
            <ChevronRight className="ml-0.5 inline-block h-3 w-3" />
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/50 dark:bg-gray-900/50 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <NotificationEmptyState
              filter={activeFilter}
              onAction={() => setActiveFilter('all')}
            />
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={(id) => markRead.mutate(id)}
                onDelete={(id) => deleteNotif.mutate(id)}
                onClick={handleClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

### 5.5 NotificationEmptyState

```typescript
import { Bell } from 'lucide-react'

interface NotificationEmptyStateProps {
  filter: 'all' | 'unread'
  onAction?: () => void
}

export default function NotificationEmptyState({ filter, onAction }: NotificationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl animate-pulse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-200/50 dark:border-purple-500/30">
          <Bell className="h-7 w-7 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones'}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
        {filter === 'unread'
          ? 'Tus notificaciones sin leer aparecerán aquí. Revisa más tarde.'
          : 'Las notificaciones de actividad financiera, alertas y el sistema aparecerán aquí.'}
      </p>
      {filter === 'unread' && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-md transition-all"
        >
          Ver todas las notificaciones
        </button>
      )}
    </div>
  )
}
```

### 5.6 NotificationFilters

```typescript
import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_OPTIONS, CHANNEL_OPTIONS, READ_STATUS_OPTIONS } from '../constants'

interface NotificationFiltersProps {
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  channelFilter: string
  onChannelFilterChange: (value: string) => void
  readFilter: string
  onReadFilterChange: (value: string) => void
}

export default function NotificationFilters({
  typeFilter, onTypeFilterChange,
  channelFilter, onChannelFilterChange,
  readFilter, onReadFilterChange,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Read status */}
      <div className="inline-flex items-center rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-1 shadow-sm gap-0.5">
        {READ_STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onReadFilterChange(opt.value)}
            className={cn(
              'rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
              readFilter === opt.value
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="relative">
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="appearance-none rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer shadow-sm"
        >
          <option value="">Todos los tipos</option>
          {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Channel filter */}
      <div className="relative">
        <select
          value={channelFilter}
          onChange={(e) => onChannelFilterChange(e.target.value)}
          className="appearance-none rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer shadow-sm"
        >
          <option value="">Todos los canales</option>
          {CHANNEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
```

### 5.7 NotificationStats (kpi cards)

```typescript
import { Bell, CheckCheck, Activity, BarChart3 } from 'lucide-react'
import type { NotificationStatsResponse } from '@/types/notifications'

interface NotificationStatsProps {
  stats: NotificationStatsResponse | undefined
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function NotificationStats({ stats }: NotificationStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total', value: stats.total.toString(), icon: Bell,
      gradient: 'from-purple-500 to-indigo-600',
      subtext: 'notificaciones',
    },
    {
      label: 'No leídas', value: stats.unread.toString(), icon: Activity,
      gradient: 'from-amber-500 to-orange-600',
      subtext: `${stats.total > 0 ? Math.round((stats.unread / stats.total) * 100) : 0}% sin leer`,
    },
    {
      label: 'Leídas', value: (stats.total - stats.unread).toString(), icon: CheckCheck,
      gradient: 'from-emerald-500 to-green-600',
      subtext: 'notificaciones leídas',
    },
    {
      label: 'Canales', value: Object.keys(stats.by_channel).length.toString(), icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-600',
      subtext: Object.keys(stats.by_channel).join(', ') || 'Ninguno',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.subtext}</p>
          </div>
        )
      })}
    </div>
  )
}
```

### 5.8 LoadingSkeleton

```typescript
import { Skeleton } from '@/components/ui'

export default function NotificationListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-3 mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 6. Páginas

### 6.1 NotificationsPage (`src/features/notifications/pages/NotificationsPage.tsx`)

Página principal con lista completa, filtros, estadísticas y acciones bulk:

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/features/ai/components/BackButton'
import AIPageHeader from '@/features/ai/components/AIPageHeader'
import NotificationStats from '../components/NotificationStats'
import NotificationFilters from '../components/NotificationFilters'
import NotificationItem from '../components/NotificationItem'
import NotificationListSkeleton from '../components/LoadingSkeleton'
import NotificationEmptyState from '../components/NotificationEmptyState'
import { useNotifications, useNotificationStats, useMarkRead, useBulkMarkRead, useDeleteNotification } from '../hooks/useNotifications'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'

function NotificationsPage() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const { data: stats } = useNotificationStats()
  const { data, isLoading, isError, refetch } = useNotifications({
    type: typeFilter || undefined,
    channel: channelFilter || undefined,
    is_read: readFilter === '' ? undefined : readFilter === 'true',
    limit: 100,
  })
  const markRead = useMarkRead()
  const bulkMarkRead = useBulkMarkRead()
  const deleteNotif = useDeleteNotification()

  const notifications = data?.notifications ?? []
  const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="relative space-y-6 pb-8 animate-fade-in">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <BackButton to="/dashboard" />
        <AIPageHeader
          title="Notificaciones"
          subtitle="Mantente al día con tu actividad financiera"
          icon={<Bell className="h-6 w-6 text-white" />}
          className="flex-1"
        />
      </div>

      {/* Stats */}
      <NotificationStats stats={stats} />

      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <NotificationFilters
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          channelFilter={channelFilter}
          onChannelFilterChange={setChannelFilter}
          readFilter={readFilter}
          onReadFilterChange={setReadFilter}
        />
        <div className="flex items-center gap-2">
          {unreadIds.length > 0 && (
            <button
              onClick={() => bulkMarkRead.mutate(unreadIds)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3.5 py-2 text-xs font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Leer todas ({unreadIds.length})
            </button>
          )}
          <button
            onClick={() => navigate('/settings/notifications')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-3.5 py-2 text-xs font-medium shadow-sm hover:shadow-md transition-all text-gray-700 dark:text-gray-300"
          >
            <Bell className="h-3.5 w-3.5" />
            Preferencias
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          <NotificationListSkeleton />
        ) : notifications.length === 0 ? (
          <NotificationEmptyState
            filter={readFilter === 'true' ? 'all' : 'unread'}
            onAction={() => setReadFilter('')}
          />
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={(id) => markRead.mutate(id)}
              onDelete={(id) => deleteNotif.mutate(id)}
              onClick={(notif) => {
                if (!notif.is_read) markRead.mutate(notif.id)
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
```

### 6.2 NotificationPreferencesPage (`src/features/notifications/pages/NotificationPreferencesPage.tsx`)

Página de configuración de preferencias con canales, tipos por canal y test button:

```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/features/ai/components/BackButton'
import AIPageHeader from '@/features/ai/components/AIPageHeader'
import ChannelToggle from '../components/ChannelToggle'
import ChannelConfigFields from '../components/ChannelConfigFields'
import TypeToggleList from '../components/TypeToggleList'
import TestNotificationButton from '../components/TestNotificationButton'
import { useNotificationPreferences, useUpdatePreferences } from '../hooks/useNotifications'
import { Skeleton, Button } from '@/components/ui'
import { Bell, Save, RotateCcw } from 'lucide-react'
import { CHANNEL_CONFIG } from '../constants'
import type { NotificationPreferenceUpdate, NotificationChannel, NotificationType } from '@/types/notifications'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'

function NotificationPreferencesPage() {
  const navigate = useNavigate()
  const { data: prefs, isLoading } = useNotificationPreferences()
  const updatePrefs = useUpdatePreferences()

  // Local state for form
  const [form, setForm] = useState<NotificationPreferenceUpdate>({})
  const [dirty, setDirty] = useState(false)

  // Initialize form from server data
  useEffect(() => {
    if (prefs) {
      setForm({
        email_enabled: prefs.email_enabled,
        push_enabled: prefs.push_enabled,
        telegram_enabled: prefs.telegram_enabled,
        discord_enabled: prefs.discord_enabled,
        webhook_enabled: prefs.webhook_enabled,
        email_types: prefs.email_types ?? undefined,
        push_types: prefs.push_types ?? undefined,
        telegram_types: prefs.telegram_types ?? undefined,
        discord_types: prefs.discord_types ?? undefined,
        webhook_types: prefs.webhook_types ?? undefined,
        telegram_chat_id: prefs.telegram_chat_id,
        discord_webhook_url: prefs.discord_webhook_url,
        webhook_url: prefs.webhook_url,
      })
    }
  }, [prefs])

  const update = (partial: Partial<NotificationPreferenceUpdate>) => {
    setForm((prev) => ({ ...prev, ...partial }))
    setDirty(true)
  }

  const handleSave = () => {
    updatePrefs.mutate(form, {
      onSuccess: () => setDirty(false),
    })
  }

  const channels: NotificationChannel[] = ['push', 'email', 'telegram', 'discord', 'webhook']
  const types = Object.keys(NOTIFICATION_TYPE_CONFIG) as NotificationType[]

  if (isLoading) {
    return (
      <div className="relative space-y-6 pb-8 animate-fade-in">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-6 pb-8 animate-fade-in">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl dark:bg-indigo-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/notifications" />
        <AIPageHeader
          title="Preferencias de Notificación"
          subtitle="Configura cómo y cuándo recibir notificaciones"
          icon={<Bell className="h-6 w-6 text-white" />}
          className="flex-1"
        />
      </div>

      {/* Save bar */}
      {dirty && (
        <div className="sticky top-20 z-20 flex items-center justify-between rounded-2xl border border-purple-200/80 dark:border-purple-500/30 bg-purple-50/90 dark:bg-purple-500/10 backdrop-blur-xl px-5 py-3 shadow-lg">
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Tienes cambios sin guardar
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { setForm(prefs ?? {}); setDirty(false) }}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Descartar
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={updatePrefs.isPending}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Guardar cambios
            </Button>
          </div>
        </div>
      )}

      {/* Channels */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Canales de notificación</h3>
        <div className="grid gap-4">
          {channels.map((channel) => {
            const config = CHANNEL_CONFIG[channel]
            const enabled = form[`${channel}_enabled` as keyof NotificationPreferenceUpdate] as boolean | undefined
            const typesMap = form[`${channel}_types` as keyof NotificationPreferenceUpdate] as Record<string, boolean> | undefined
            const channelKey = channel as NotificationChannel

            return (
              <div
                key={channel}
                className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                      <config.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{config.label}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
                    </div>
                  </div>
                  <ChannelToggle
                    enabled={enabled ?? false}
                    onChange={(val) => update({ [`${channel}_enabled`]: val } as Partial<NotificationPreferenceUpdate>)}
                  />
                </div>

                {enabled && (
                  <div className="space-y-4">
                    {/* Config fields */}
                    {config.requiresConfig && (
                      <ChannelConfigFields
                        channel={channelKey}
                        values={{
                          telegram_chat_id: form.telegram_chat_id ?? '',
                          discord_webhook_url: form.discord_webhook_url ?? '',
                          webhook_url: form.webhook_url ?? '',
                        }}
                        onChange={(key, val) => update({ [key]: val } as Partial<NotificationPreferenceUpdate>)}
                      />
                    )}

                    {/* Type toggles */}
                    <TypeToggleList
                      channel={channelKey}
                      types={typesMap ?? {}}
                      onChange={(newTypes) => update({ [`${channel}_types`]: newTypes } as Partial<NotificationPreferenceUpdate>)}
                    />

                    {/* Test button */}
                    <TestNotificationButton channel={channelKey} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NotificationPreferencesPage
```

---

## 7. Componentes de Preferencias

### 7.1 ChannelToggle

```typescript
import { cn } from '@/lib/utils'

interface ChannelToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function ChannelToggle({ enabled, onChange }: ChannelToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-2',
        enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out',
          enabled ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}
```

### 7.2 ChannelConfigFields

```typescript
import { CHANNEL_CONFIG } from '../constants'
import type { NotificationChannel } from '@/types/notifications'

interface ChannelConfigFieldsProps {
  channel: NotificationChannel
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

export default function ChannelConfigFields({ channel, values, onChange }: ChannelConfigFieldsProps) {
  const config = CHANNEL_CONFIG[channel]
  if (!config.configFields) return null

  return (
    <div className="space-y-3 pl-12">
      {config.configFields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {field.label}
          </label>
          <input
            type={field.type}
            value={values[field.key] ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
          />
          <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">{field.helpText}</p>
        </div>
      ))}
    </div>
  )
}
```

### 7.3 TypeToggleList

Lista de tipos de evento con toggle individual, agrupados visualmente:

```typescript
import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'
import type { NotificationChannel, NotificationType } from '@/types/notifications'

interface TypeToggleListProps {
  channel: NotificationChannel
  types: Record<string, boolean>
  onChange: (types: Record<string, boolean>) => void
}

export default function TypeToggleList({ types, onChange }: TypeToggleListProps) {
  const typeEntries = Object.entries(NOTIFICATION_TYPE_CONFIG) as [NotificationType, typeof NOTIFICATION_TYPE_CONFIG[NotificationType]][]

  const toggle = (type: NotificationType) => {
    const current = types[type]
    // Si no existe en el map, por defecto está habilitado (true)
    const newVal = current === undefined ? false : !current
    onChange({ ...types, [type]: newVal })
  }

  return (
    <div className="pl-12">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tipos de evento</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {typeEntries.map(([type, config]) => {
          const Icon = config.icon
          const enabled = types[type] !== false // default true
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200',
                enabled
                  ? 'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300/50 dark:hover:border-purple-500/30'
                  : 'bg-gray-50/50 dark:bg-gray-800/30 border border-transparent text-gray-400 dark:text-gray-500 opacity-60',
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', config.color)} />
              <span className="truncate">{config.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

### 7.4 TestNotificationButton

```typescript
import { useState } from 'react'
import { Send, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSendTestNotification } from '../hooks/useNotifications'
import type { NotificationChannel } from '@/types/notifications'

interface TestNotificationButtonProps {
  channel: NotificationChannel
}

export default function TestNotificationButton({ channel }: TestNotificationButtonProps) {
  const sendTest = useSendTestNotification()
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)

  const handleTest = async () => {
    setFeedback(null)
    try {
      const result = await sendTest.mutateAsync()
      const chResult = result.results.find((r) => r.channel === channel)
      setFeedback(chResult?.success ? 'success' : 'error')
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback('error')
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  if (feedback === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 animate-fade-in">
        <Check className="h-3.5 w-3.5" />
        Enviada
      </span>
    )
  }

  if (feedback === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/20 animate-fade-in">
        <X className="h-3.5 w-3.5" />
        Error
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleTest}
      disabled={sendTest.isPending}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ml-12',
        sendTest.isPending
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 hover:shadow-md',
      )}
    >
      {sendTest.isPending ? (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      {sendTest.isPending ? 'Enviando...' : 'Probar'}
    </button>
  )
}
```

---

## 8. Utilidades

### 8.1 formatRelativeTime

Agregar a `src/lib/utils.ts` si no existe:

```typescript
export function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '-'
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  if (days < 7) return `hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-DO', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
```

---

## 9. Integración con Header existente

El archivo `src/components/layout/Header.tsx` ya tiene el Bell icon con badge y polling a `/notifications/stats`. La integración que falta es:

### 9.1 Reemplazar navegación por NotificationDrawer

En lugar de `navigate('/notifications')` al hacer click en la campana, abrir el `NotificationDrawer`:

```typescript
// En Header.tsx - importar NotificationDrawer
import NotificationDrawer from '@/features/notifications/components/NotificationDrawer'

// Agregar estado local
const [notifDrawerOpen, setNotifDrawerOpen] = useState(false)

// Cambiar el onClick del botón de notificaciones
<button
  onClick={() => setNotifDrawerOpen(true)}
  // ... resto igual
>

// Renderizar el drawer al final del header
<NotificationDrawer
  open={notifDrawerOpen}
  onClose={() => setNotifDrawerOpen(false)}
/>
```

### 9.2 Mejorar el polling

El header ya usa TanStack Query con `refetchInterval: 30000`. Para una experiencia más en tiempo real, se puede bajar a 15s o implementar WebSocket (ver sección 12).

---

## 10. Rutas

### 10.1 lazy.ts

Agregar al archivo `src/routes/lazy.ts`:

```typescript
// Notifications
export const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'))
export const NotificationPreferencesPage = lazy(() => import('@/features/notifications/pages/NotificationPreferencesPage'))
```

### 10.2 index.tsx

Reemplazar el placeholder de `/notifications` y agregar la ruta de preferencias:

```typescript
// Importar los componentes lazy
import {
  // ... existing imports ...
  NotificationsPage,
  NotificationPreferencesPage,
} from './lazy'

// En las rutas, reemplazar:
{
  path: '/notifications',
  element: (<SuspenseWrapper><NotificationsPage /></SuspenseWrapper>),
},

// Y agregar dentro de /settings o como ruta independiente:
{
  path: '/settings/notifications',
  element: (<SuspenseWrapper><NotificationPreferencesPage /></SuspenseWrapper>),
},
```

### 10.3 Sidebar

La entrada de "Notificaciones" en la sección "Sistema" del Sidebar ya existe (`Sidebar.tsx` línea ~94). No requiere cambios.

---

## 11. Diseño Visual y Animaciones

### 11.1 Estilo general
- **Glassmorphism**: `backdrop-blur-xl bg-white/80 dark:bg-gray-900/80` en todos los contenedores
- **Hover lift**: `hover:-translate-y-0.5 hover:shadow-lg hover:border-purple-200/50`
- **Gradient icon boxes**: `bg-gradient-to-br from-{color}-400 to-{color}-600`
- **Active press**: `active:scale-[0.97]`
- **Staggered entrance**: `animate-fade-in-up` con `style={{ animationDelay: '${i * 0.08}s' }}`

### 11.2 Micro-interacciones
- Items de notificación: mostrar acciones (mark read, delete) solo en hover con fade+slide
- Badge de no-leída: barra lateral púrpura con transición
- Drawer: slide-in desde la derecha con `animate-in slide-in-from-right`
- Checkbox de selección múltiple con animación de check
- Toggle switch con knob animado y glow en estado activo
- Test notification button: feedback success/error con fade-in-out

### 11.3 Estados
- **Loading**: Skeleton que replica la forma de los items (icono cuadrado + líneas de texto)
- **Empty**: Ilustración con icono Bell, gradiente, mensaje claro y CTA
- **Error**: ErrorMessage component con retry button
- **Unread**: Barra púrpura lateral + badge animate-pulse + bg más opaca

---

## 12. Tiempo Real (WebSocket vs Polling)

### Estrategia recomendada: Polling con TanStack Query

**Por qué:**
- Ya está implementado en el Header con `refetchInterval: 30000`
- El backend no expone WebSocket para notificaciones
- TanStack Query maneja caché, re-renders automáticos y deduplicación
- 30 segundos es latencia aceptable para notificaciones financieras

**Mejora opcional (si se agrega WebSocket después):**
```typescript
// hook opcional para WebSocket futuro
export function useNotificationWebSocket() {
  const queryClient = useQueryClient()
  useEffect(() => {
    const ws = new WebSocket('wss://api.fip.com/ws/notifications')
    ws.onmessage = (event) => {
      const notif = JSON.parse(event.data)
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
    }
    return () => ws.close()
  }, [])
}
```

---

## 13. Estrategia de Implementación (Orden recomendado)

### Paso 1: Tipos y constantes
Crear `src/types/notifications.ts` y `src/features/notifications/constants.ts`

### Paso 2: API layer
Crear `src/features/notifications/api/notifications.ts`

### Paso 3: Hooks
Crear `src/features/notifications/hooks/useNotifications.ts`

### Paso 4: Componentes base
Crear en orden:
1. `NotificationTypeBadge` (dependencia de otros)
2. `NotificationItem`
3. `NotificationEmptyState`
4. `NotificationFilters`
5. `NotificationStats`
6. `LoadingSkeleton`

### Paso 5: NotificationDrawer
Integrar en Header, reemplazar navegación por drawer

### Paso 6: NotificationsPage
Página principal con filtros, stats, lista, acciones bulk

### Paso 7: Componentes de preferencias
1. `ChannelToggle`
2. `ChannelConfigFields`
3. `TypeToggleList`
4. `TestNotificationButton`

### Paso 8: NotificationPreferencesPage
Página completa de configuración

### Paso 9: Rutas
Actualizar `lazy.ts` e `index.tsx`

### Paso 10: `formatRelativeTime`
Agregar a `src/lib/utils.ts`

### Paso 11: Verificar compilación
```bash
npx tsc --noEmit
```

### Paso 12: Verificar navegación
- Click en Bell del header → abre drawer
- "Ver todas" en drawer → navega a /notifications
- Click en "Preferencias" → navega a /settings/notifications
- Sidebar "Notificaciones" → navega a /notifications
- Toggle canales, configurar campos, probar test button
- Marcar como leída, bulk mark read, eliminar

---

## 14. Checklist de Implementación

- [ ] `src/types/notifications.ts` — Tipos
- [ ] `src/features/notifications/constants.ts` — Constantes
- [ ] `src/features/notifications/api/notifications.ts` — API
- [ ] `src/features/notifications/hooks/useNotifications.ts` — Hooks
- [ ] `src/features/notifications/components/NotificationTypeBadge.tsx`
- [ ] `src/features/notifications/components/NotificationItem.tsx`
- [ ] `src/features/notifications/components/NotificationEmptyState.tsx`
- [ ] `src/features/notifications/components/NotificationFilters.tsx`
- [ ] `src/features/notifications/components/NotificationStats.tsx`
- [ ] `src/features/notifications/components/LoadingSkeleton.tsx`
- [ ] `src/features/notifications/components/NotificationDrawer.tsx`
- [ ] `src/features/notifications/components/ChannelToggle.tsx`
- [ ] `src/features/notifications/components/ChannelConfigFields.tsx`
- [ ] `src/features/notifications/components/TypeToggleList.tsx`
- [ ] `src/features/notifications/components/TestNotificationButton.tsx`
- [ ] `src/features/notifications/pages/NotificationsPage.tsx`
- [ ] `src/features/notifications/pages/NotificationPreferencesPage.tsx`
- [ ] `src/components/layout/Header.tsx` — Integrar NotificationDrawer
- [ ] `src/lib/utils.ts` — Agregar `formatRelativeTime` si no existe
- [ ] `src/routes/lazy.ts` — Agregar lazy imports
- [ ] `src/routes/index.tsx` — Agregar rutas reales
- [ ] `npx tsc --noEmit` — Sin errores

---

## 15. Notas Adicionales

### Sobre el endpoint GET /notifications
El endpoint actualmente retorna `total: len(notifications)` en lugar del total real de la BD. Esto es un bug conocido del backend que debería corregirse para mostrar paginación correcta (el total debe ser el conteo total sin el limit). Mientras tanto, el frontend puede ignorar `total` o mostrar la longitud de la lista actual.

### Sobre el tipo `data` en NotificationResponse
El campo `data` puede contener metadatos adicionales como:
- `link`: Ruta de navegación a la que redirigir al hacer click (ej: `/transactions/xxx`, `/budgets/xxx`)
- `amount`: Monto involucrado
- `category`: Categoría relacionada
- `account_id`, `card_id`, etc.: IDs de recursos relacionados

El frontend puede usar `data.link` para navegación contextual.

### Sobre el tipo `channel` en NotificationResponse
Cada notificación se almacena por canal individual. Si una notificación se envía a 3 canales, se crean 3 registros separados con el mismo `type`, `title`, `body` pero diferente `channel`. El frontend puede mostrar esto agrupando por `correlation_id` (si se agrega) o simplemente mostrando cada una por separado con el badge del canal.
