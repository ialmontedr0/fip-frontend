import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Save, RotateCcw, RefreshCw, Sun, Moon, Monitor } from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import { usePreferences, useUpdatePreferences, useSupportedValues } from '../hooks/useSettings'
import { useCurrencyStore } from '@/stores/currency-store'
import { loadCurrencyRates } from '@/lib/currency'
import LanguageSelect from './LanguageSelect'
import CurrencySelect from './CurrencySelect'
import TimezoneSelect from './TimezoneSelect'
import type { UpdatePreferencesRequest } from '@/types/settings'

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
] as const

const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY']
const TIME_FORMATS = ['24h', '12h']
const NUMBER_FORMATS = ['#,##0.00', '#,##0', '#,##0.00##']
const WEEK_OPTIONS = [
  { value: 'monday', label: 'Lunes' },
  { value: 'sunday', label: 'Domingo' },
]

function ToggleGroup<T extends string>({ options, value, onChange }: {
  options: readonly { value: T; label: string; icon?: React.ComponentType<{ className?: string }> }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
      {options.map((opt) => {
        const active = opt.value === value
        const Icon = opt.icon
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all flex-1',
              active
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-1',
          checked ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-200 dark:bg-gray-600',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            'ring-1 ring-black/5',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </label>
  )
}

export default function PreferencesForm() {
  const { data: preferences, isLoading: prefsLoading } = usePreferences()
  const { data: supported, isLoading: supportedLoading } = useSupportedValues()
  const updatePreferences = useUpdatePreferences()
  const setCurrency = useCurrencyStore((s) => s.setCurrency)

  const [form, setForm] = useState<UpdatePreferencesRequest>({})
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (preferences) {
      setForm({
        currency_code: preferences.currency_code,
        timezone: preferences.timezone,
        language: preferences.language,
        date_format: preferences.date_format,
        time_format: preferences.time_format,
        number_format: preferences.number_format,
        first_day_of_week: preferences.first_day_of_week,
        theme: preferences.theme,
        email_notifications: preferences.email_notifications,
        push_notifications: preferences.push_notifications,
        marketing_emails: preferences.marketing_emails,
      })
    }
  }, [preferences])

  const update = (key: keyof UpdatePreferencesRequest, value: string | boolean | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    await updatePreferences.mutateAsync(form)
    setDirty(false)
  }

  const handleReset = () => {
    if (preferences) {
      setForm({
        currency_code: preferences.currency_code,
        timezone: preferences.timezone,
        language: preferences.language,
        date_format: preferences.date_format,
        time_format: preferences.time_format,
        number_format: preferences.number_format,
        first_day_of_week: preferences.first_day_of_week,
        theme: preferences.theme,
        email_notifications: preferences.email_notifications,
        push_notifications: preferences.push_notifications,
        marketing_emails: preferences.marketing_emails,
      })
      setDirty(false)
    }
  }

  const isLoading = prefsLoading || supportedLoading

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const currencies = (supported?.currencies ?? []).map((c) => c.code)
  const timezoneCodes = (supported?.timezones ?? []).map((tz) => tz.timezone)
  const timezones = timezoneCodes.length > 0 ? timezoneCodes : ['America/Santo_Domingo', 'America/New_York']

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
      {/* Localization */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Localizaci&oacute;n
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Idioma</label>
            <LanguageSelect
              value={form.language || 'es'}
              onChange={(v) => update('language', v)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zona Horaria</label>
            <TimezoneSelect
              value={form.timezone || 'America/Santo_Domingo'}
              onChange={(v) => update('timezone', v)}
              timezones={timezones}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Moneda</label>
            <CurrencySelect
              value={form.currency_code || 'DOP'}
              onChange={(v) => {
                update('currency_code', v)
                setCurrency(v as Parameters<typeof setCurrency>[0])
                loadCurrencyRates()
              }}
              currencies={currencies}
            />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Tema</h4>
        <ToggleGroup
          options={THEME_OPTIONS}
          value={form.theme || 'system'}
          onChange={(v) => update('theme', v)}
        />
      </div>

      {/* Formats */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Formatos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</label>
            <select
              value={form.date_format || 'DD/MM/YYYY'}
              onChange={(e) => update('date_format', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              {DATE_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hora</label>
            <select
              value={form.time_format || '24h'}
              onChange={(e) => update('time_format', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              {TIME_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt === '24h' ? '24 horas' : '12 horas (AM/PM)'}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N&uacute;meros</label>
            <select
              value={form.number_format || '#,##0.00'}
              onChange={(e) => update('number_format', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              {NUMBER_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semana</label>
            <select
              value={form.first_day_of_week || 'monday'}
              onChange={(e) => update('first_day_of_week', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              {WEEK_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Defaults */}
      <div className="mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Notificaciones
        </h4>
        <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/30 p-4 divide-y divide-gray-100 dark:divide-gray-700">
          <ToggleSwitch
            checked={form.email_notifications ?? true}
            onChange={(v) => update('email_notifications', v)}
            label="Notificaciones por email"
          />
          <ToggleSwitch
            checked={form.push_notifications ?? true}
            onChange={(v) => update('push_notifications', v)}
            label="Notificaciones push"
          />
          <ToggleSwitch
            checked={form.marketing_emails ?? false}
            onChange={(v) => update('marketing_emails', v)}
            label="Emails de marketing"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        {dirty && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Descartar
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!dirty}
          isLoading={updatePreferences.isPending}
          size="sm"
        >
          {updatePreferences.isPending ? (
            <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> Guardando...</>
          ) : (
            <><Save className="h-3.5 w-3.5 mr-1.5" /> Guardar Cambios</>
          )}
        </Button>
      </div>
    </div>
  )
}
