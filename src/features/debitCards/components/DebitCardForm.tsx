import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CreditCard, Hash, Palette, Building } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import type { CreateDebitCardRequest, DebitCardResponse } from '@/types/debitCards'

const NETWORKS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
]

const PREDEFINED_COLORS = ['#6B21A8', '#2563EB', '#059669', '#D97706', '#DC2626', '#1E293B']

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  account_id: z.string().min(1, 'Debe seleccionar una cuenta'),
  last_four_digits: z.string().max(4).optional().or(z.literal('')),
  card_network: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: CreateDebitCardRequest) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<DebitCardResponse>
  loading?: boolean
  accountId?: string
}

export default function DebitCardForm({ onSubmit, onCancel, initialData, loading, accountId }: Props) {
  const [showNotes, setShowNotes] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || '',
      account_id: accountId || initialData?.account_id || '',
      last_four_digits: initialData?.last_four_digits || '',
      card_network: initialData?.card_network || '',
      color: initialData?.color || '',
      notes: initialData?.notes || '',
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const selectedColor = watch('color')

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      name: data.name,
      account_id: data.account_id,
      last_four_digits: data.last_four_digits || null,
      card_network: data.card_network || null,
      color: data.color || null,
      notes: data.notes || null,
    })
  }

  const inputClass = 'w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-4 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20'

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {!accountId && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Building className="h-3.5 w-3.5 inline mr-1" />
            Cuenta <span className="text-red-400">*</span>
          </label>
          <AccountPicker
            value={watch('account_id') || ''}
            onChange={(id) => setValue('account_id', id, { shouldValidate: true })}
            error={errors.account_id?.message}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <CreditCard className="h-3.5 w-3.5 inline mr-1" />
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="ej: Debito Principal"
            className={inputClass}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Hash className="h-3.5 w-3.5 inline mr-1" />
            Ultimos 4 digitos
          </label>
          <input
            {...register('last_four_digits')}
            maxLength={4}
            placeholder="1234"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Red</label>
        <div className="flex gap-2">
          {NETWORKS.map((net) => (
            <label key={net.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={net.value}
                {...register('card_network')}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{net.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <Palette className="h-3.5 w-3.5 inline mr-1" />
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', selectedColor === color ? '' : color)}
              className={cn(
                'h-7 w-7 rounded-lg border-2 transition-all',
                selectedColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent',
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showNotes ? 'Ocultar notas' : '+ Agregar notas'}
        </button>
        {showNotes && (
          <textarea
            {...register('notes')}
            rows={2}
            className={cn(inputClass, 'resize-none mt-2')}
            placeholder="Notas opcionales..."
          />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading} className="rounded-xl">
          {initialData?.id ? 'Guardar' : 'Agregar Tarjeta'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancelar
          </Button>
        )}
      </div>
    </motion.form>
  )
}
