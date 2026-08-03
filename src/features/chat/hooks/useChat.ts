import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as chatApi from '../api/chat'

export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  detail: (id: string) => [...chatKeys.all, 'detail', id] as const,
}

export function useChatSessions() {
  return useQuery({
    queryKey: chatKeys.lists(),
    queryFn: () => chatApi.listChatSessions().then((r) => r.data),
  })
}

export function useChatSession(id: string | undefined) {
  return useQuery({
    queryKey: chatKeys.detail(id!),
    queryFn: () => chatApi.getChatSession(id!).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateChatSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title?: string; chat_type?: string }) => chatApi.createChatSession(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.lists() }),
  })
}

export function useDeleteChatSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => chatApi.deleteChatSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatKeys.lists() })
      toast.success('Conversacion eliminada')
    },
  })
}
