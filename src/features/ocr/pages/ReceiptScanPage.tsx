import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ScanLine, Sparkles, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import ReceiptUploader from '../components/ReceiptUploader'
import ExtractedReceiptForm from '../components/ExtractedReceiptForm'
import { useOcrExtract, useOcrStatus } from '../hooks/useOcr'
import { useCreateTransaction } from '@/features/transactions/hooks/useTransactions'
import type { OcrExtractResponse } from '@/types/ocr'
import type { CreateTransactionRequest } from '@/types/transactions'

const CONFIDENCE_LABELS: Record<string, { label: string; className: string }> = {
  high: { label: 'Alta', className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
  medium: { label: 'Media', className: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
  low: { label: 'Baja', className: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' },
}

export default function ReceiptScanPage() {
  const navigate = useNavigate()
  const [result, setResult] = useState<OcrExtractResponse | null>(null)
  const extractMutation = useOcrExtract()
  const createTransaction = useCreateTransaction()
  const { data: status } = useOcrStatus()

  const handleFileSelected = async (file: File) => {
    try {
      const response = await extractMutation.mutateAsync(file)
      if (!response.success && response.data.amount === null && response.warnings.length > 0) {
        toast.error('No se pudo extraer el texto del archivo. Intenta con una imagen mas nitida.')
      }
      setResult(response)
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || err?.message || 'Error al procesar el recibo')
    }
  }

  const handleConfirm = async (data: CreateTransactionRequest) => {
    try {
      const created = await createTransaction.mutateAsync(data)
      navigate(`/transactions/${created.data.id}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Error al crear la transaccion')
    }
  }

  const confidence = result ? CONFIDENCE_LABELS[result.data.confidence] ?? CONFIDENCE_LABELS.low : null

  return (
    <div className="relative max-w-3xl mx-auto pb-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-200/20 to-emerald-300/10 blur-3xl dark:from-emerald-500/10 dark:to-emerald-500/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-teal-200/20 to-primary-200/10 blur-3xl dark:from-teal-500/10 dark:to-primary-500/5" />
      </div>

      <div className="relative flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate(-1)} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <ScanLine className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Escanear Recibo
            </h1>
          </div>
          <p className="mt-1 ml-14 text-sm text-gray-500 dark:text-gray-400">
            Sube una foto o PDF de tu recibo y crea la transaccion en segundos
          </p>
        </div>
      </div>

      {status && !status.enabled && (
        <div className="relative mb-6 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            El OCR esta deshabilitado en el servidor. La extraccion automatica de datos no estara disponible.
          </p>
        </div>
      )}

      {!result ? (
        <div className="relative space-y-4 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <ReceiptUploader onFileSelected={handleFileSelected} />

          {extractMutation.isPending && (
            <div className="rounded-2xl border border-gray-100/80 bg-white/80 dark:bg-gray-900/80 p-6 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-5 w-5 text-emerald-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analizando el recibo...
            </div>
          )}

          <div className="rounded-2xl border border-gray-100/80 bg-white/80 dark:bg-gray-900/80 p-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Como funciona</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-500 dark:text-gray-400 list-disc pl-4">
                  <li>Sube una foto del recibo (PNG, JPG, WebP) o un PDF.</li>
                  <li>El sistema extrae monto, fecha y comercio automaticamente.</li>
                  <li>Verifica los datos, elige tu cuenta y confirma para crear la transaccion.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Resultado del escaneo</span>
              {confidence && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${confidence.className}`}>
                  Confianza {confidence.label}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-sm text-emerald-500 hover:underline"
            >
              Escanear otro
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100/80 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm">
            <ExtractedReceiptForm
              suggestions={result.suggestions}
              warnings={result.warnings}
              rawText={result.data.text}
              onSubmit={handleConfirm}
              isPending={createTransaction.isPending}
            />
          </div>
        </div>
      )}
    </div>
  )
}
