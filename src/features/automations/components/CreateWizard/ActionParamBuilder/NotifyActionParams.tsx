import { Mail, Send, MessageCircle, Smartphone, Type, MessageSquare } from 'lucide-react'
import type { NotifyActionParams } from '@/types/automations'

interface Props {
  value: NotifyActionParams | null
  onChange: (params: NotifyActionParams) => void
}

const channelOptions = [
  { value: 'push', label: 'Push', icon: Smartphone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'discord', label: 'Discord', icon: MessageCircle },
]

export default function NotifyActionParams({ value, onChange }: Props) {
  const channel = value?.channel ?? 'push'
  const charCount = value?.message?.length ?? 0

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Título</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
            <Type className="h-3 w-3 text-white" />
          </div>
          <input
            value={value?.title ?? ''}
            onChange={(e) => onChange({ ...value, title: e.target.value } as NotifyActionParams)}
            placeholder="Título de la notificación"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          Mensaje <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
          <textarea
            value={value?.message ?? ''}
            onChange={(e) => onChange({ ...value, message: e.target.value } as NotifyActionParams)}
            rows={3}
            placeholder="Contenido de la notificación"
            className="w-full pl-11 pr-4 pt-3 pb-2 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all resize-none"
            maxLength={500}
          />
          <div className="absolute right-3 bottom-2 text-[10px] text-gray-400">
            {charCount}/500
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Canal</label>
        <div className="grid grid-cols-2 gap-2">
          {channelOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = channel === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...value, channel: opt.value } as NotifyActionParams)}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/80 dark:bg-gray-800/80 border border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-purple-200/50 dark:hover:border-purple-500/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
