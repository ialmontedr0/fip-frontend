import api from '@/lib/api'
import type {
  UploadAttachmentResponse, ListAttachmentsResponse, DeleteAttachmentResponse,
} from '@/types/transactions'

export function uploadAttachment(transactionId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<UploadAttachmentResponse>(
    `/transactions/${transactionId}/attachments`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
}

export function listAttachments(transactionId: string) {
  return api.get<ListAttachmentsResponse>(`/transactions/${transactionId}/attachments`)
}

export function deleteAttachment(transactionId: string, attachmentId: string) {
  return api.delete<DeleteAttachmentResponse>(
    `/transactions/${transactionId}/attachments/${attachmentId}`,
  )
}
