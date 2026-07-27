import api from '@/lib/api'
import type {
  ImportPreviewResponse, ImportConfirmRequest,
  ImportConfirmResponse, ImportJobResponse, ImportJobListResponse,
} from '@/types/imports'

export function uploadImportFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<ImportPreviewResponse>('/imports/transactions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
}

export function confirmImport(data: ImportConfirmRequest) {
  return api.post<ImportConfirmResponse>('/imports/confirm', data)
}

export function listImportJobs(skip = 0, limit = 20) {
  return api.get<ImportJobListResponse>('/imports/jobs', {
    params: { skip, limit },
  })
}

export function getImportJob(jobId: string) {
  return api.get<ImportJobResponse>(`/imports/jobs/${jobId}`)
}
