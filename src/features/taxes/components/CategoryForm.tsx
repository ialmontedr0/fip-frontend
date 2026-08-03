import { useEffect, useState } from 'react'
import { Loader2, Tags } from 'lucide-react'
import { TAX_YEAR_MAX, TAX_YEAR_MIN } from '@/types/taxes'
import type { CreateTaxCategoryRequest } from '@/types/taxes'

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTaxCategoryRequest) => Promise<void>
  defaultYear: number
  isPending?: boolean
}

export default function CategoryForm({
  open,
  onClose,
  onSubmit,
  defaultYear,
  isPending,
}: CategoryFormProps) {
  const [name, setName] = useState('')
  const [taxYear, setTaxYear] = useState(defaultYear)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setTaxYear(defaultYear)
      setError('')
    }
  }, [open, defaultYear])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose, isPending])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (taxYear < TAX_YEAR_MIN || taxYear > TAX_YEAR_MAX) {
      setError(`El año debe estar entre ${TAX_YEAR_MIN} y ${TAX_YEAR_MAX}`)
      return
    }
    try {
      await onSubmit({
        name: name.trim(),
        tax_year: taxYear,
        description: description.trim() || null,
      })
    } catch (err: any) {
      setError(err?.message || 'Error al crear la categoria')
    }
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={isPending ? undefined : onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nueva categoria"
        className="relative z-50 w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl p-6 animate-fade-in"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <Tags className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nueva Categoria</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Crea una categoria fiscal</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Gastos medicos"
              className={inputClasses}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Año Fiscal <span className="text-red-500">*</span>
            </label>
            <input
              value={taxYear}
              onChange={(e) => setTaxYear(Number(e.target.value))}
              type="number"
              min={TAX_YEAR_MIN}
              max={TAX_YEAR_MAX}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripcion</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descripcion opcional de la categoria..."
              className={`${inputClasses} resize-none`}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
