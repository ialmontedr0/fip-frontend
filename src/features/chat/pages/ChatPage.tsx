import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
import ChatSidebar from '../components/ChatSidebar'
import ChatMessageBubble from '../components/ChatMessageBubble'
import ChatInput from '../components/ChatInput'
import {
  useChatSessions,
  useChatSession,
  useCreateChatSession,
  useDeleteChatSession,
  chatKeys,
} from '../hooks/useChat'
import { streamChatMessage } from '../api/chat'
import type { ChatMessage, ChatSessionDetail } from '@/types/chat'
import useConfirm from '@/hooks/useConfirm'

interface LocalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: sessionsData } = useChatSessions()
  const { data: session, isLoading: sessionLoading } = useChatSession(id)
  const createMutation = useCreateChatSession()
  const deleteMutation = useDeleteChatSession()

  const [pending, setPending] = useState<LocalMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const seqRef = useRef(0)
  const { confirm, confirmDialog } = useConfirm()

  const sessions = sessionsData?.sessions ?? []

  const messages = useMemo<LocalMessage[]>(() => {
    const persisted: LocalMessage[] = (session?.messages ?? []).map((m: ChatMessage) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }))
    return [...persisted, ...pending]
  }, [session, pending])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  useEffect(() => () => abortRef.current?.abort(), [])

  const handleNew = async () => {
    setPending([])
    const created = await createMutation.mutateAsync({ chat_type: 'finance' })
    navigate(`/chat/${created.id}`)
  }

  const handleDelete = async (sessionId: string) => {
    const ok = await confirm({
      title: 'Eliminar conversación',
      message: 'Eliminar esta conversación?',
      confirmLabel: 'Eliminar',
      destructive: true,
    })
    if (!ok) return
    await deleteMutation.mutateAsync(sessionId)
    if (sessionId === id) {
      setPending([])
      navigate('/chat')
    }
  }

  const handleSend = async (text: string) => {
    if (!id) return
    seqRef.current += 1
    const seq = seqRef.current
    const userMsg: LocalMessage = { id: `u-${seq}`, role: 'user', content: text }
    const assistantMsg: LocalMessage = { id: `a-${seq}`, role: 'assistant', content: '' }
    setPending((prev) => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    let streamed = ''
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const full = await streamChatMessage(
        id,
        text,
        (delta) => {
          streamed += delta
          setPending((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.id === assistantMsg.id) {
              next[next.length - 1] = { ...last, content: last.content + delta }
            }
            return next
          })
        },
        controller.signal,
      )
      const assistantContent =
        full || streamed || 'Lo siento, no hubo respuesta. Revisa tu API key de Groq (LLM_API_KEY).'
      commitMessages(id, userMsg, assistantMsg, assistantContent)
    } catch {
      commitMessages(id, userMsg, assistantMsg, streamed || 'Conexión interrumpida.')
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  const commitMessages = (
    sessionId: string,
    userMsg: LocalMessage,
    assistantMsg: LocalMessage,
    assistantContent: string,
  ) => {
    const existing =
      queryClient.getQueryData<ChatSessionDetail>(chatKeys.detail(sessionId))?.messages ??
      session?.messages ??
      []
    const newMessages: ChatSessionDetail['messages'] = [
      ...existing.map((m: ChatMessage) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        created_at: m.created_at,
      })),
      { id: userMsg.id, role: 'user', content: userMsg.content, created_at: new Date().toISOString() },
      {
        id: assistantMsg.id,
        role: 'assistant',
        content: assistantContent,
        created_at: new Date().toISOString(),
      },
    ]
    const cached: ChatSessionDetail = {
      id: session?.id ?? sessionId,
      title: session?.title ?? 'Nueva conversación',
      chat_type: session?.chat_type ?? 'finance',
      messages: newMessages,
    }
    queryClient.setQueryData(chatKeys.detail(sessionId), cached)
    queryClient.invalidateQueries({ queryKey: chatKeys.lists() })
    setPending([])
  }

  return (
    <div className="flex gap-4">
      <ChatSidebar
        sessions={sessions}
        activeId={id}
        onSelect={(sid) => {
          setPending([])
          navigate(`/chat/${sid}`)
        }}
        onNew={handleNew}
        onDelete={handleDelete}
        isLoading={!sessionsData}
      />

      <main className="flex-1 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 h-[calc(100vh-120px)] flex flex-col">
        {!id ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-violet-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Asistente Financiero
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              Pregunta sobre tus cuentas, presupuestos, metas y gastos. Crea una conversación para
              comenzar.
            </p>
            <button
              type="button"
              onClick={handleNew}
              className="mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700"
            >
              Nueva conversación
            </button>
          </div>
        ) : (
          <>
            <header className="pb-4 border-b border-gray-100 dark:border-gray-700/50">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {session?.title ?? 'Nueva conversación'}
              </h1>
            </header>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {sessionLoading && pending.length === 0 && (
                <p className="text-sm text-gray-500">Cargando historial...</p>
              )}
              {messages.map((m) => (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  isStreaming={
                    streaming &&
                    m.role === 'assistant' &&
                    m.content === '' &&
                    m.id === messages[messages.length - 1]?.id
                  }
                />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
              <ChatInput onSend={handleSend} disabled={streaming} isLoading={streaming} />
            </div>
          </>
        )}
      </main>

      {confirmDialog}
    </div>
  )
}
