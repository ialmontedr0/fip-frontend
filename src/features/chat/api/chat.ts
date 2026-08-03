import api from '@/lib/api'
import type { ChatSession, ChatSessionDetail, ChatSessionListResponse } from '@/types/chat'

export async function listChatSessions() {
  return api.get<ChatSessionListResponse>('/chat/sessions')
}

export async function createChatSession(data: { title?: string; chat_type?: string }) {
  const response = await api.post<ChatSession>('/chat/sessions', data)
  return response.data
}

export async function getChatSession(id: string) {
  return api.get<ChatSessionDetail>(`/chat/sessions/${id}`)
}

export async function deleteChatSession(id: string) {
  return api.delete(`/chat/sessions/${id}`)
}

export async function streamChatMessage(
  sessionId: string,
  content: string,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const token = (await import('@/stores/auth-store')).useAuthStore.getState().accessToken
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '')

  const res = await fetch(`${base}/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
    signal,
  })

  if (!res.ok || !res.body) {
    throw new Error(`Chat stream fallido: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let sep = buffer.indexOf('\n\n')
    while (sep !== -1) {
      const rawEvent = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      const eventName = rawEvent.split('\n').find((l) => l.startsWith('event: '))?.slice(7)
      const dataLine = rawEvent.split('\n').find((l) => l.startsWith('data: '))
      if (eventName === 'done' && dataLine) {
        try {
          const payload = JSON.parse(dataLine.slice(6))
          if (typeof payload.content === 'string') full = payload.content
        } catch {
          // ignore
        }
      } else if (eventName === 'delta' && dataLine) {
        try {
          const payload = JSON.parse(dataLine.slice(6))
          if (payload.content) {
            full += payload.content
            onDelta(payload.content)
          }
        } catch {
          // ignore
        }
      }
      sep = buffer.indexOf('\n\n')
    }
  }
  return full
}
