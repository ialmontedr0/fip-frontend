import type { LucideIcon } from 'lucide-react'
import {
  Upload, FileSpreadsheet, CheckCircle2,
  Clock, XCircle, Loader2, Columns,
} from 'lucide-react'
import type { ImportJobStatus } from '@/types/imports'

export const ACCEPTED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const MAX_FILE_SIZE_LABEL = '10MB'

export interface JobStatusConfig {
  icon: LucideIcon
  label: string
  color: string
  bgColor: string
}

export const JOB_STATUS_CONFIG: Record<ImportJobStatus, JobStatusConfig> = {
  pending: {
    icon: Clock, label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
  },
  processing: {
    icon: Loader2, label: 'Procesando', color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
  },
  completed: {
    icon: CheckCircle2, label: 'Completado', color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
  },
  failed: {
    icon: XCircle, label: 'Fallido', color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
  },
}

export const IMPORT_WIZARD_STEPS = [
  { id: 'upload', label: 'Subir archivo', icon: Upload },
  { id: 'preview', label: 'Vista previa', icon: FileSpreadsheet },
  { id: 'mapping', label: 'Mapeo de columnas', icon: Columns, optional: true },
  { id: 'confirm', label: 'Confirmar', icon: CheckCircle2 },
] as const

export type ImportWizardStep = typeof IMPORT_WIZARD_STEPS[number]['id']
