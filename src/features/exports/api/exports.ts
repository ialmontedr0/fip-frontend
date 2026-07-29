import api from '@/lib/api'
import type { ExportTransactionsFilters } from '@/types/exports'
import { EXPORT_FILE_NAMES } from '@/types/exports'

const FORMAT_MAP: Record<string, string> = {
  xlsx: 'excel',
  csv: 'csv',
  pdf: 'pdf',
}

function buildExportUrl(
  entity: string,
  format: string,
  filters?: Record<string, unknown>,
): string {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value))
      }
    })
  }
  const qs = params.toString()
  const mappedFormat = FORMAT_MAP[format] || format
  const formatPart = mappedFormat ? `/${mappedFormat}` : ''
  return `/exports/${entity}${formatPart}${qs ? `?${qs}` : ''}`
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getExportUrl(
  entity: string,
  format: string,
  filters?: Record<string, unknown>,
): string {
  return buildExportUrl(entity, format, filters)
}

function getDateSuffix(): string {
  return new Date().toISOString().slice(0, 10)
}

function buildFallbackFilename(entity: string, format: string): string {
  const nameKey = `${entity}_${format}`
  const baseName = EXPORT_FILE_NAMES[nameKey] || entity
  const ext = format === 'xlsx' ? 'xlsx' : format
  return `${baseName}_${getDateSuffix()}.${ext}`
}

async function fetchBlob(
  entity: string,
  format: string,
  url: string,
  onProgress?: (pct: number) => void,
) {
  onProgress?.(25)
  const response = await api.get(url, { responseType: 'blob' })
  onProgress?.(75)
  const disposition = (response.headers as Record<string, string>)['content-disposition']
  let filename = buildFallbackFilename(entity, format)
  if (disposition) {
    const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/)
    if (!match) {
      const match2 = disposition.match(/filename="?(.+?)"?\s*(?:;|$)/)
      if (match2) filename = match2[1]
    } else {
      filename = decodeURIComponent(match[1])
    }
  }
  return { blob: response.data as Blob, filename }
}

export async function downloadExport(
  entity: string,
  format: string,
  filters?: ExportTransactionsFilters,
  onProgress?: (pct: number) => void,
): Promise<void> {
  const url = buildExportUrl(entity, format, filters as Record<string, unknown>)
  const { blob, filename } = await fetchBlob(entity, format, url, onProgress)
  const blobUrl = window.URL.createObjectURL(blob)
  triggerDownload(blobUrl, filename)
  onProgress?.(100)
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000)
}

export async function downloadExportFromUrl(
  url: string,
  fallbackFilename: string,
  onProgress?: (pct: number) => void,
): Promise<void> {
  const entity = 'export'
  const format = url.split('.').pop() || fallbackFilename.split('.').pop() || 'ics'
  const { blob, filename } = await fetchBlob(entity, format, url, onProgress)
  const blobUrl = window.URL.createObjectURL(blob)
  triggerDownload(blobUrl, filename || fallbackFilename)
  onProgress?.(100)
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000)
}
