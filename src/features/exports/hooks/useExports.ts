import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { downloadExport, downloadExportFromUrl } from '../api/exports'
import type { ExportTransactionsFilters, ExportFormat } from '@/types/exports'

interface ProgressState {
  inProgress: boolean
  percentage: number
  fileName: string
}

export function useExportDownload() {
  const [progress, setProgress] = useState<ProgressState>({
    inProgress: false, percentage: 0, fileName: '',
  })

  const exportData = useCallback(async (
    entity: string,
    format: ExportFormat | string,
    filters?: ExportTransactionsFilters,
    customFileName?: string,
  ) => {
    const fileName = customFileName || `${entity}_${new Date().toISOString().slice(0, 10)}.${format}`
    setProgress({ inProgress: true, percentage: 0, fileName })

    try {
      await downloadExport(entity, format, filters, (pct) => {
        setProgress((prev) => ({ ...prev, percentage: pct }))
      })
      toast.success(`Exportaci\u00f3n completada: ${fileName}`)
    } catch {
      toast.error('Error al exportar. Intenta de nuevo.')
    } finally {
      setTimeout(() => setProgress({ inProgress: false, percentage: 0, fileName: '' }), 2000)
    }
  }, [])

  const exportFromUrl = useCallback(async (
    url: string,
    fileName: string,
  ) => {
    setProgress({ inProgress: true, percentage: 0, fileName })

    try {
      await downloadExportFromUrl(url, fileName, (pct) => {
        setProgress((prev) => ({ ...prev, percentage: pct }))
      })
      toast.success(`Exportaci\u00f3n completada: ${fileName}`)
    } catch {
      toast.error('Error al exportar. Intenta de nuevo.')
    } finally {
      setTimeout(() => setProgress({ inProgress: false, percentage: 0, fileName: '' }), 2000)
    }
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({ inProgress: false, percentage: 0, fileName: '' })
  }, [])

  return { progress, exportData, exportFromUrl, resetProgress }
}
