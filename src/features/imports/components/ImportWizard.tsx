import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Check, CheckCircle2 } from 'lucide-react'
import { useUploadImportFile, useConfirmImport } from '../hooks/useImports'
import DropZone from './DropZone'
import PreviewTable from './PreviewTable'
import ColumnMappingStep from './ColumnMappingStep'
import ConfirmStep from './ConfirmStep'
import { IMPORT_WIZARD_STEPS } from '../constants'
import type { ImportWizardStep } from '../constants'
import type { ImportPreviewResponse, ColumnMapping } from '@/types/imports'

export default function ImportWizard() {
  const [currentStep, setCurrentStep] = useState<ImportWizardStep>('upload')
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null)
  const [mappings, setMappings] = useState<ColumnMapping[]>([])

  const uploadMutation = useUploadImportFile()
  const confirmMutation = useConfirmImport()

  const handleFileSelect = useCallback(async (file: File) => {
    const result = await uploadMutation.mutateAsync(file)
    setPreview(result)
    const autoMappings = result.columns_found.map((col) => ({
      sourceColumn: col,
      targetField: '',
    }))
    setMappings(autoMappings)
    if (result.validation_errors.some((e) => e.field === 'columns')) {
      setCurrentStep('mapping')
    } else {
      setCurrentStep('preview')
    }
  }, [uploadMutation])

  const handleMappingConfirm = useCallback((newMappings: ColumnMapping[]) => {
    setMappings(newMappings)
    setCurrentStep('confirm')
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!preview) return
    const result = await confirmMutation.mutateAsync({ job_id: preview.job_id })
    if (result.success) {
      setTimeout(() => {
        setPreview(null)
        setCurrentStep('upload')
      }, 2000)
    }
  }, [preview, confirmMutation])

  const currentStepIndex = IMPORT_WIZARD_STEPS.findIndex((s) => s.id === currentStep)
  const isValid = preview && preview.validation_errors.length === 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        {IMPORT_WIZARD_STEPS.map((step, idx) => {
          const StepIcon = step.icon
          const isActive = idx <= currentStepIndex
          const isCurrent = step.id === currentStep
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                isCurrent
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 scale-110'
                  : isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400',
              )}>
                {isActive && idx < currentStepIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span className={cn(
                'text-xs font-semibold hidden sm:block',
                isCurrent ? 'text-gray-900 dark:text-white' : isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500',
              )}>
                {step.label}
              </span>
              {idx < IMPORT_WIZARD_STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-2',
                  isActive ? 'bg-gradient-to-r from-purple-500/50 to-indigo-500/50' : 'bg-gray-200 dark:bg-gray-700',
                )} />
              )}
            </div>
          )
        })}
      </div>

      <div className="animate-fade-in-up">
        {currentStep === 'upload' && (
          <DropZone
            onFileSelect={handleFileSelect}
            isLoading={uploadMutation.isPending}
          />
        )}

        {currentStep === 'preview' && preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Vista previa — {preview.file_name}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep('mapping')}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all"
                >
                  Ajustar mapeo
                </button>
                <button
                  onClick={() => setCurrentStep('confirm')}
                  disabled={!isValid}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white disabled:opacity-50 hover:shadow-md transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
            <PreviewTable
              columns={preview.columns_found}
              rows={preview.preview_rows}
              errors={preview.validation_errors}
              duplicatesCount={preview.duplicates_found}
            />
          </div>
        )}

        {currentStep === 'mapping' && preview && (
          <ColumnMappingStep
            sourceColumns={preview.columns_found}
            initialMappings={mappings}
            onConfirm={handleMappingConfirm}
          />
        )}

        {currentStep === 'confirm' && preview && (
          <ConfirmStep
            preview={preview}
            onConfirm={handleConfirm}
            isLoading={confirmMutation.isPending}
            errorRows={preview.validation_errors.length}
          />
        )}
      </div>

      {confirmMutation.isSuccess && confirmMutation.data?.success && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            \u00a1Importaci\u00f3n completada!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {confirmMutation.data.valid_rows} transacciones importadas exitosamente
          </p>
        </div>
      )}
    </div>
  )
}
