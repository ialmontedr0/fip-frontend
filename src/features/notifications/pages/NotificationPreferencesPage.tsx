import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Bell, Save, RotateCcw, RefreshCw, Sparkles } from 'lucide-react'
import { useNotificationPreferences, useUpdatePreferences } from '../hooks/useNotifications'
import ChannelToggle from '../components/ChannelToggle'
import ChannelConfigFields from '../components/ChannelConfigFields'
import TypeToggleList from '../components/TypeToggleList'
import TestNotificationButton from '../components/TestNotificationButton'
import { Skeleton } from '@/components/ui'
import { CHANNEL_CONFIG } from '../constants'
import type { NotificationChannel } from '@/types/notifications'

const CHANNELS: NotificationChannel[] = ['push', 'email', 'telegram', 'discord', 'webhook']

function channelEnabledKey(ch: NotificationChannel): string { return `${ch}_enabled` }
function channelTypesKey(ch: NotificationChannel): string { return `${ch}_types` }

function emptyChannelState() {
  return { enabled: true, types: {} as Record<string, boolean>, config: {} as Record<string, string> }
}

export default function NotificationPreferencesPage() {
  const { data: preferences, isLoading } = useNotificationPreferences()
  const updatePrefs = useUpdatePreferences()

  const [form, setForm] = useState<Record<string, ReturnType<typeof emptyChannelState>>>({})
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (preferences) {
      const p = preferences as unknown as Record<string, unknown>
      const initial: Record<string, ReturnType<typeof emptyChannelState>> = {}
      for (const ch of CHANNELS) {
        initial[ch] = {
          enabled: (p[channelEnabledKey(ch)] as boolean) ?? true,
          types: (p[channelTypesKey(ch)] as Record<string, boolean>) ?? {},
          config: {},
        }
      }
      initial.telegram.config = { telegram_chat_id: preferences.telegram_chat_id ?? '' }
      initial.discord.config = { discord_webhook_url: preferences.discord_webhook_url ?? '' }
      initial.webhook.config = { webhook_url: preferences.webhook_url ?? '' }
      setForm(initial)
    }
  }, [preferences])

  const updateChannel = (channel: string, patch: Partial<ReturnType<typeof emptyChannelState>>) => {
    setForm((prev) => ({ ...prev, [channel]: { ...emptyChannelState(), ...prev[channel], ...patch } }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {}
      for (const ch of CHANNELS) {
        const s = form[ch]
        if (!s) continue
        payload[channelEnabledKey(ch)] = s.enabled
        payload[channelTypesKey(ch)] = s.types
      }
      const tgConfig = form.telegram?.config
      if (tgConfig?.telegram_chat_id !== undefined) payload.telegram_chat_id = tgConfig.telegram_chat_id || null
      const dcConfig = form.discord?.config
      if (dcConfig?.discord_webhook_url !== undefined) payload.discord_webhook_url = dcConfig.discord_webhook_url || null
      const whConfig = form.webhook?.config
      if (whConfig?.webhook_url !== undefined) payload.webhook_url = whConfig.webhook_url || null
      await updatePrefs.mutateAsync(payload as never)
      setDirty(false)
    } finally { setSaving(false) }
  }

  const handleReset = () => {
    if (preferences) {
      const p = preferences as unknown as Record<string, unknown>
      const initial: Record<string, ReturnType<typeof emptyChannelState>> = {}
      for (const ch of CHANNELS) {
        initial[ch] = {
          enabled: (p[channelEnabledKey(ch)] as boolean) ?? true,
          types: (p[channelTypesKey(ch)] as Record<string, boolean>) ?? {},
          config: {},
        }
      }
      initial.telegram.config = { telegram_chat_id: preferences.telegram_chat_id ?? '' }
      initial.discord.config = { discord_webhook_url: preferences.discord_webhook_url ?? '' }
      initial.webhook.config = { webhook_url: preferences.webhook_url ?? '' }
      setForm(initial)
      setDirty(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/50 dark:bg-gray-900/50 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40 rounded-lg" />
                  <Skeleton className="h-3 w-56 rounded-lg" />
                </div>
              </div>
              <div className="space-y-3 pl-12">
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-3/4 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const hasChanges = dirty && !saving

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-pink-500/5 blur-2xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30">
              <Bell className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Preferencias</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Configura los canales y tipos de notificaciones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Descartar
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm',
                hasChanges
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:scale-[0.95] shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed',
              )}
            >
              {saving ? (
                <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="h-3.5 w-3.5" /> Guardar cambios</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Channel cards */}
      <div className="space-y-5">
        {CHANNELS.map((channel, idx) => {
          const state = form[channel] ?? emptyChannelState()
          const config = CHANNEL_CONFIG[channel]
          const Icon = config?.icon
          return (
            <div
              key={channel}
              className={cn(
                'group relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 animate-fade-in-up',
                state.enabled
                  ? 'bg-white/90 dark:bg-gray-900/90 border-gray-200/80 dark:border-gray-700/60 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200/50 dark:hover:border-purple-500/30'
                  : 'bg-white/50 dark:bg-gray-900/40 border-gray-100/80 dark:border-gray-700/40',
              )}
              style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards' }}
            >
              {/* Hover glow */}
              <div className="absolute -inset-20 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />

              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3',
                    state.enabled
                      ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-purple-500/10'
                      : 'bg-gray-100 dark:bg-gray-700',
                  )}>
                    {Icon && <Icon className={cn('h-5 w-5', state.enabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500')} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{config?.label}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{config?.description}</p>
                  </div>
                </div>
                <ChannelToggle enabled={state.enabled} onChange={(v) => updateChannel(channel, { enabled: v })} />
              </div>

              <div className={cn('space-y-4 transition-all duration-300', state.enabled ? 'opacity-100 max-h-[2000px]' : 'opacity-40 max-h-0 overflow-hidden pointer-events-none')}>
                <TypeToggleList types={state.types} onChange={(types) => updateChannel(channel, { types })} />
                <ChannelConfigFields channel={channel} values={state.config} onChange={(key, value) => updateChannel(channel, { config: { ...state.config, [key]: value } })} />
                <TestNotificationButton channel={channel} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Los cambios se aplican inmediatamente después de guardar</span>
      </div>
    </div>
  )
}
