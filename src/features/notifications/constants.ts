import type { LucideIcon } from 'lucide-react'
import {
  ArrowRightLeft, PieChart, AlertTriangle, Flag, Target,
  CreditCard, CalendarClock, Bot, ShieldAlert, Bell, Megaphone,
  Mail, Send, MessageCircle, Webhook,
} from 'lucide-react'
import type { NotificationType, NotificationChannel } from '@/types/notifications'

export interface NotificationTypeConfig {
  type: NotificationType
  label: string
  icon: LucideIcon
  color: string
  gradient: string
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
