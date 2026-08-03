import { useQuery, useMutation } from '@tanstack/react-query'
import { ocrApi } from '../api/ocr'

const keys = {
  all: ['ocr'] as const,
  status: () => [...keys.all, 'status'] as const,
}

export function useOcrStatus() {
  return useQuery({
    queryKey: keys.status(),
    queryFn: () => ocrApi.status(),
  })
}

export function useOcrExtract() {
  return useMutation({
    mutationFn: (file: File) => ocrApi.extract(file),
  })
}
