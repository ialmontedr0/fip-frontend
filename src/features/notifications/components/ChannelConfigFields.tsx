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
    <div className="space-y-4 pl-12">
      {config.configFields.map((field) => (
        <div key={field.key} className="group">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {field.label}
          </label>
          <div className="relative">
            {/* Focus glow */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />
            <input
              type={field.type}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="relative w-full rounded-xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md"
            />
            {/* Active indicator line */}
            <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500/50 to-indigo-500/50 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
          </div>
          <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed pl-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">{field.helpText}</p>
        </div>
      ))}
    </div>
  )
}
