import { useEffect, useState } from 'react'
import { Loader2, FileText } from 'lucide-react'
import type { CreateInsurancePolicyRequest } from '@/types/insurance'

interface PolicyFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateInsurancePolicyRequest) => Promise<void>
  isPending?: boolean
}

export default function PolicyForm({ open, onClose, onSubmit, isPending }: PolicyFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverageDetails, setCoverageDetails] = useState('')
  const [deductible, setDeductible] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setCoverageDetails('')
      setDeductible('')
      setError('')
    }
  }, [open])

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
      setError('El nombre de la poliza es requerido')
      return
    }
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        coverage_details: coverageDetails.trim() || null,
        deductible: deductible === '' ? null : Number(deductible),
      })
    } catch (err: any) {
      setError(err?.message || 'Error al crear la poliza')
    }
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={isPending ? undefined : onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nueva poliza"
        className="relative z-50 w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl p-6 animate-fade-in"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nueva Poliza</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Agrega una poliza bajo este seguro</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Cobertura amplia"
              className={inputClasses}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripcion</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripcion breve (opcional)"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Detalles de Cobertura</label>
            <textarea
              value={coverageDetails}
              onChange={(e) => setCoverageDetails(e.target.value)}
              rows={3}
              placeholder="Que cubre esta poliza..."
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deducible</label>
            <input
              value={deductible}
              onChange={(e) => setDeductible(e.target.value)}
              type="number"
              step="0.01"
              min="0"
              placeholder="Opcional"
              className={inputClasses}
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
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
