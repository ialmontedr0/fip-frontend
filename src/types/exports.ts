export type ExportFormat = 'csv' | 'xlsx' | 'pdf'
export type ExportEntity = 'transactions' | 'budgets' | 'goals'
export type CalendarExportType = 'recurring' | 'goals'

export interface ExportTransactionsFilters {
  date_from?: string
  date_to?: string
  category?: string
  transaction_type?: string
  account_id?: string
}

export interface ExportBudgetFilters {
  month?: number
  year?: number
}

export interface ExportGoalsFilters {
  status?: string
}

export interface ExportFormatOption {
  value: ExportFormat
  label: string
  icon: string
  description: string
  mimeType: string
  extension: string
}

export const EXPORT_FORMAT_OPTIONS: ExportFormatOption[] = [
  {
    value: 'csv', label: 'CSV', icon: 'FileSpreadsheet',
    description: 'Formato compatible con Excel, Google Sheets y la mayor\u00eda de herramientas',
    mimeType: 'text/csv', extension: '.csv',
  },
  {
    value: 'xlsx', label: 'Excel', icon: 'FileSpreadsheet',
    description: 'Formato nativo de Excel con estilo profesional',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx',
  },
  {
    value: 'pdf', label: 'PDF', icon: 'FileText',
    description: 'Informe profesional listo para imprimir o compartir',
    mimeType: 'application/pdf', extension: '.pdf',
  },
]

export const EXPORT_FILE_NAMES: Record<string, string> = {
  'transactions_csv': 'transacciones',
  'transactions_xlsx': 'transacciones',
  'transactions_pdf': 'reporte_transacciones',
  'budgets_pdf': 'reporte_presupuestos',
  'goals_pdf': 'reporte_metas',
  'calendar_recurring': 'transacciones_recurrentes',
  'calendar_goals': 'metas_financieras',
}
