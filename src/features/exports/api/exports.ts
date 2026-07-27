import api from '@/lib/api'
import type { ExportTransactionsFilters } from '@/types/exports'

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
  const formatPart = format ? `/${format}` : ''
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

async function fetchBlob(url: string, onProgress?: (pct: number) => void) {
  onProgress?.(25)
  const response = await api.get(url, { responseType: 'blob' })
  onProgress?.(75)
  const disposition = (response.headers as Record<string, string>)['content-disposition']
  let filename = url.split('/').pop() || 'export'
  if (disposition) {
    const match = disposition.match(/filename="?(.+?)"?\s*(?:;|$)/)
    if (match) filename = match[1]
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
  const { blob, filename } = await fetchBlob(url, onProgress)
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
  const { blob, filename } = await fetchBlob(url, onProgress)
  const blobUrl = window.URL.createObjectURL(blob)
  triggerDownload(blobUrl, filename || fallbackFilename)
  onProgress?.(100)
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000)
}
