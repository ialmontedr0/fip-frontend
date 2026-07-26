import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Info, ChevronDown, CreditCard, Hash, Globe, DollarSign, Calendar, Percent, Palette, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { CardResponse, CreateCardRequest, CardNetwork } from '@/types/cards'

const CURRENCIES = [
  { code: 'DOP', name: 'DOP - Peso Dominicano', symbol: 'RD$', flag: '🇩🇴' },
  { code: 'USD', name: 'USD - Dolar Americano', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'EUR - Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'ARS', name: 'ARS - Peso Argentino', symbol: '$', flag: '🇦🇷' },
  { code: 'CLP', name: 'CLP - Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'COP - Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'MXN', name: 'MXN - Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'PEN', name: 'PEN - Sol Peruano', symbol: 'S/', flag: '🇵🇪' },
  { code: 'BRL', name: 'BRL - Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
]

const SECONDARY_CURRENCIES = CURRENCIES.filter((c) => c.code !== 'DOP')

const PREDEFINED_COLORS = [
  '#6B21A8', '#7C3AED', '#4F46E5', '#2563EB', '#0891B2',
  '#059669', '#65A30D', '#D97706', '#EA580C', '#DC2626',
  '#BE185D', '#1E293B',
]

const cardSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  last_four_digits: z.string().max(4).optional().or(z.literal('')),
  card_network: z.enum(['visa', 'mastercard', 'amex']).optional().or(z.literal('')),
  currency_code: z.string().length(3).default('DOP'),
  is_multicurrency: z.boolean().default(false),
  secondary_currency_code: z.string().optional().or(z.literal('')),
  secondary_credit_limit: z.string().optional().or(z.literal('')),
  secondary_available_credit: z.string().optional().or(z.literal('')),
  credit_limit: z.string().optional().or(z.literal('')),
  available_credit: z.string().optional().or(z.literal('')),
  statement_day: z.coerce.number().min(1).max(28).optional().or(z.nan()),
  payment_due_day: z.coerce.number().min(1).max(28).optional().or(z.nan()),
  interest_rate: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  color: z.string().optional().or(z.literal('')),
})

type CardFormData = z.infer<typeof cardSchema>

interface CardFormProps {
  initialData?: Partial<CardResponse>
  onSubmit: (data: CreateCardRequest) => Promise<void>
  onCancel?: () => void
  loading?: boolean
}

function FormField({ icon: Icon, label, error, children, required }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default function CardForm({ initialData, onSubmit, onCancel, loading }: CardFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      last_four_digits: initialData?.last_four_digits || '',
      card_network: (initialData?.card_network as 'visa' | 'mastercard' | 'amex' | '') || '',
      currency_code: initialData?.currency_code || 'DOP',
      is_multicurrency: initialData?.is_multicurrency ?? false,
      secondary_currency_code: initialData?.secondary_currency_code || '',
      secondary_credit_limit: initialData?.secondary_credit_limit || '',
      secondary_available_credit: initialData?.secondary_available_credit || '',
      credit_limit: initialData?.credit_limit || '',
      available_credit: initialData?.available_credit || '',
      statement_day: initialData?.statement_day || undefined,
      payment_due_day: initialData?.payment_due_day || undefined,
      interest_rate: initialData?.interest_rate || '',
      is_active: initialData?.is_active ?? true,
      color: initialData?.color || '',
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const selectedCurrency = watch('currency_code')
  const selectedColor = watch('color')
  const networks = ['visa', 'mastercard', 'amex'] as const
  const selectedNetwork = watch('card_network')
  const isMulticurrency = watch('is_multicurrency')

  const handleFormSubmit = async (data: CardFormData) => {
    await onSubmit({
      name: data.name,
      last_four_digits: data.last_four_digits || null,
      card_network: (data.card_network || null) as CardNetwork | null,
      currency_code: data.currency_code,
      is_multicurrency: data.is_multicurrency,
      secondary_currency_code: data.is_multicurrency ? data.secondary_currency_code || null : null,
      secondary_credit_limit: data.is_multicurrency ? data.secondary_credit_limit || null : null,
      secondary_available_credit: data.is_multicurrency ? data.secondary_available_credit || null : null,
      credit_limit: data.credit_limit || null,
      available_credit: data.available_credit || null,
      statement_day: data.statement_day && !isNaN(data.statement_day) ? data.statement_day : null,
      payment_due_day: data.payment_due_day && !isNaN(data.payment_due_day) ? data.payment_due_day : null,
      interest_rate: data.interest_rate || null,
      color: data.color || null,
    })
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all dark:placeholder-gray-500"

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 space-y-5 shadow-sm overflow-visible relative z-10"
      >
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-violet-500" />
          Informacion Basica
        </h4>

        <div>
          <FormField icon={CreditCard} label="Nombre" error={errors.name?.message} required>
            <input {...register('name')} placeholder="ej: Visa Platino, Amex Gold..." className={inputClass} />
          </FormField>
        </div>
      </motion.div>

      {/* Detalles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 space-y-5 shadow-sm overflow-visible"
      >
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Activity className="h-4 w-4 text-violet-500" />
          Detalles de la Tarjeta
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField icon={Hash} label="Ultimos 4 digitos">
            <input {...register('last_four_digits')} maxLength={4} placeholder="1234" className={inputClass} />
          </FormField>

          <FormField icon={Globe} label="Red">
            <div className="flex gap-1.5">
              {networks.map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setValue('card_network', selectedNetwork === net ? '' : net)}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide border transition-all',
                    selectedNetwork === net
                      ? net === 'visa' ? 'bg-[#1A1F71] text-white border-[#1A1F71]'
                        : net === 'mastercard' ? 'bg-[#EB001B] text-white border-[#EB001B]'
                          : 'bg-[#2E77BC] text-white border-[#2E77BC]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  )}
                >
                  {net}
                </button>
              ))}
            </div>
          </FormField>

          <FormField icon={DollarSign} label="Moneda">
            <div className="relative">
              <select {...register('currency_code')} className={cn(inputClass, 'appearance-none')}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.symbol}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {CURRENCIES.find(c => c.code === selectedCurrency)?.flag}
              </span>
            </div>
          </FormField>
        </div>

        {/* Multi-moneda */}
        <div className="flex items-center gap-3 py-2">
          <input
            {...register('is_multicurrency')}
            type="checkbox"
            id="is_multicurrency"
            className="h-5 w-5 rounded-lg border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 cursor-pointer"
          />
          <label htmlFor="is_multicurrency" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            Tarjeta multi-moneda
          </label>
        </div>

        {isMulticurrency && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden"
          >
            <FormField icon={DollarSign} label="2da Moneda">
              <select {...register('secondary_currency_code')} className={cn(inputClass, 'appearance-none')}>
                <option value="">Seleccionar...</option>
                {SECONDARY_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.symbol}</option>
                ))}
              </select>
            </FormField>
            <FormField icon={DollarSign} label="Limite 2da Moneda">
              <input {...register('secondary_credit_limit')} type="text" inputMode="decimal" placeholder="0.00" className={inputClass} />
            </FormField>
            <FormField icon={DollarSign} label="Disponible 2da Moneda">
              <input {...register('secondary_available_credit')} type="text" inputMode="decimal" placeholder="0.00" className={inputClass} />
            </FormField>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField icon={DollarSign} label="Limite de Credito">
            <input {...register('credit_limit')} type="text" inputMode="decimal" placeholder="50000.00" className={inputClass} />
          </FormField>

          <FormField icon={DollarSign} label="Credito Disponible">
            <input {...register('available_credit')} type="text" inputMode="decimal" placeholder="45000.00" className={inputClass} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField icon={Calendar} label="Dia de Corte (1-28)" error={errors.statement_day?.message}>
            <input {...register('statement_day', { valueAsNumber: true })} type="text" inputMode="numeric" min={1} max={28} placeholder="15" className={inputClass} />
          </FormField>

          <FormField icon={Calendar} label="Dia de Pago (1-28)" error={errors.payment_due_day?.message}>
            <input {...register('payment_due_day', { valueAsNumber: true })} type="text" inputMode="numeric" min={1} max={28} placeholder="5" className={inputClass} />
          </FormField>
        </div>
      </motion.div>

      {/* Advanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl overflow-visible shadow-sm"
      >
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4 text-violet-500" />
            Configuracion Avanzada
          </span>
          <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700/30 space-y-5 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField icon={Percent} label="Tasa de Interes Anual %">
                <input {...register('interest_rate')} type="text" inputMode="decimal" placeholder="18.00" className={inputClass} />
              </FormField>

              <FormField icon={Palette} label="Color">
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <motion.button
                      key={color}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setValue('color', selectedColor === color ? '' : color)}
                      className={cn(
                        'h-8 w-8 rounded-lg border-2 transition-all',
                        selectedColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent',
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    {...register('color')}
                    type="color"
                    className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  />
                  <input {...register('color')} placeholder="#6B21A8" className={cn(inputClass, 'flex-1')} />
                </div>
              </FormField>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <motion.div whileTap={{ scale: 0.9 }}>
                <input {...register('is_active')} type="checkbox" id="is_active"
                  className="h-5 w-5 rounded-lg border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 cursor-pointer" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Tarjeta activa
              </span>
            </label>
          </div>
        </motion.div>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 pt-2"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" isLoading={loading} className="rounded-xl px-8 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25">
            {initialData?.id ? 'Guardar Cambios' : 'Crear Tarjeta'}
          </Button>
        </motion.div>
        {onCancel && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
              Cancelar
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.form>
  )
}
