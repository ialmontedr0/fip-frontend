import type { LucideIcon } from 'lucide-react'
import {
  FileSpreadsheet, FileText, Calendar,
} from 'lucide-react'
import type { ExportFormat } from '@/types/exports'

export interface ExportTypeConfig {
  id: string
  label: string
  description: string
  icon: LucideIcon
  formats: ExportFormat[]
  hasCalendar: boolean
  endpoint: string
}

export const EXPORT_TYPES: ExportTypeConfig[] = [
  {
    id: 'transactions', label: 'Transacciones',
    description: 'Exporta tus transacciones en el formato que prefieras',
    icon: FileSpreadsheet, formats: ['csv', 'xlsx', 'pdf'],
    hasCalendar: false, endpoint: '/exports/transactions',
  },
  {
    id: 'budgets', label: 'Presupuestos',
    description: 'Informe de presupuestos en PDF',
    icon: FileText, formats: ['pdf'],
    hasCalendar: false, endpoint: '/exports/budgets',
  },
  {
    id: 'goals', label: 'Metas',
    description: 'Informe de progreso de metas en PDF',
    icon: FileText, formats: ['pdf'],
    hasCalendar: false, endpoint: '/exports/goals',
  },
  {
    id: 'calendar_recurring', label: 'Calendario Recurrentes',
    description: 'Exporta transacciones recurrentes como archivo .ics',
    icon: Calendar, formats: [],
    hasCalendar: true, endpoint: '/exports/calendar/recurring',
  },
  {
    id: 'calendar_goals', label: 'Calendario Metas',
    description: 'Exporta fechas l\u00edmite de metas como archivo .ics',
    icon: Calendar, formats: [],
    hasCalendar: true, endpoint: '/exports/calendar/goals',
  },
]

export interface ExportProgressState {
  inProgress: boolean
  percentage: number
  fileName: string
}
