import { useState } from 'react'
import { Plus, Trash2, Divide, DollarSign, Calendar } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'

interface SplitLine {
  id: string
  amount: string
  description: string
  account_id: string
}

interface Props {
  onSubmit: (data: {
    total_amount: string
    description: string
    effective_date: string
    splits: Array<{ amount: string; description: string; account_id?: string | null }>
  }) => Promise<void>
  isSubmitting?: boolean
}

export default function SplitExpenseCreator({ onSubmit, isSubmitting }: Props) {
  const [description, setDescription] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [splits, setSplits] = useState<SplitLine[]>([
    { id: crypto.randomUUID(), amount: '', description: '', account_id: '' },
  ])

  const addSplit = () => {
    setSplits([...splits, { id: crypto.randomUUID(), amount: '', description: '', account_id: '' }])
  }

  const removeSplit = (id: string) => {
    if (splits.length <= 1) return
    setSplits(splits.filter((s) => s.id !== id))
  }

  const updateSplit = (id: string, field: keyof SplitLine, value: string) => {
    setSplits(splits.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const distributeEqually = () => {
    if (!totalAmount || splits.length === 0) return
    const each = (Number(totalAmount) / splits.length).toFixed(2)
    setSplits(splits.map((s) => ({ ...s, amount: each })))
  }

  const splitTotal = splits.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
  const isBalanced = Math.abs(splitTotal - Number(totalAmount)) < 0.01
  const canSubmit = description && totalAmount && effectiveDate && splits.every((s) => s.amount && s.description) && isBalanced

  const handleSubmit = async () => {
    if (!canSubmit) return
    await onSubmit({
      total_amount: totalAmount,
      description,
      effective_date: effectiveDate,
      splits: splits.map((s) => ({
        amount: s.amount,
        description: s.description,
        account_id: s.account_id || null,
      })),
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gasto Dividido</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descripcion General</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Cena entre amigos" className="rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Total</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} type="number" step="0.01" placeholder="0.00" className="rounded-xl pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} type="date" className="rounded-xl pl-9" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Divisiones</h4>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={distributeEqually} className="rounded-xl h-8 text-xs gap-1.5">
              <Divide className="h-3.5 w-3.5" />
              Distribuir
            </Button>
            <Button type="button" variant="outline" onClick={addSplit} className="rounded-xl h-8 text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </Button>
          </div>
        </div>

        {!isBalanced && Number(totalAmount) > 0 && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            La suma de las divisiones ({splitTotal.toFixed(2)}) no coincide con el total ({Number(totalAmount).toFixed(2)})
          </div>
        )}

        {splits.map((split, index) => (
          <div key={split.id} className="rounded-xl bg-gray-50/50 dark:bg-gray-700/30 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">#{index + 1}</span>
              <button
                type="button"
                onClick={() => removeSplit(split.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={splits.length <= 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400">Descripcion</label>
                <Input
                  value={split.description}
                  onChange={(e) => updateSplit(split.id, 'description', e.target.value)}
                  placeholder="Ej: Plato principal"
                  className="rounded-lg h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400">Monto</label>
                <Input
                  value={split.amount}
                  onChange={(e) => updateSplit(split.id, 'amount', e.target.value)}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-lg h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-400">Cuenta (opcional)</label>
              <AccountPicker
                value={split.account_id}
                onChange={(id) => updateSplit(split.id, 'account_id', id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="rounded-xl min-w-[160px]">
          {isSubmitting ? 'Procesando...' : 'Crear Gasto Dividido'}
        </Button>
      </div>
    </div>
  )
}
