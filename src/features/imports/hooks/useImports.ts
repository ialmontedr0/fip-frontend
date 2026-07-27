import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as importsApi from '../api/imports'
import type { ImportConfirmRequest } from '@/types/imports'

export const importKeys = {
  all: ['imports'] as const,
  jobs: () => [...importKeys.all, 'jobs'] as const,
  jobList: (skip?: number, limit?: number) => [...importKeys.jobs(), { skip, limit }] as const,
  job: (id: string) => [...importKeys.jobs(), id] as const,
}

export function useImportJobs(skip = 0, limit = 20) {
  return useQuery({
    queryKey: importKeys.jobList(skip, limit),
    queryFn: () => importsApi.listImportJobs(skip, limit).then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

export function useImportJob(jobId: string | undefined) {
  return useQuery({
    queryKey: importKeys.job(jobId!),
    queryFn: () => importsApi.getImportJob(jobId!).then((r) => r.data),
    enabled: !!jobId,
  })
}

export function useUploadImportFile() {
  return useMutation({
    mutationFn: (file: File) => importsApi.uploadImportFile(file).then((r) => r.data),
    onError: (err: Error) => toast.error(err.message || 'Error al subir archivo'),
  })
}

export function useConfirmImport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ImportConfirmRequest) => importsApi.confirmImport(data).then((r) => r.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: importKeys.jobs() })
      if (res.success) {
        toast.success(`Importaci\u00f3n completada: ${res.valid_rows} registros v\u00e1lidos`)
      } else {
        toast.error(`Importaci\u00f3n completada con ${res.error_rows} errores`)
      }
    },
    onError: () => toast.error('Error al confirmar importaci\u00f3n'),
  })
}
