import api from '@/lib/api'
import type { OcrExtractResponse, OcrStatus } from '@/types/ocr'

export const ocrApi = {
  status: () => api.get<OcrStatus>('/ocr/status').then((r) => r.data),

  extract: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<OcrExtractResponse>('/ocr/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
