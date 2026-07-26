import { useState, useEffect, useRef } from 'react'
import { Send, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSendTestNotification } from '../hooks/useNotifications'
import type { NotificationChannel } from '@/types/notifications'

interface TestNotificationButtonProps {
  channel: NotificationChannel
}

export default function TestNotificationButton({ channel }: TestNotificationButtonProps) {
  const sendTest = useSendTestNotification()
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)
  const [sending, setSending] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (feedback) {
      timeoutRef.current = setTimeout(() => setFeedback(null), 3000)
      return () => clearTimeout(timeoutRef.current)
    }
  }, [feedback])

  const handleTest = async () => {
    if (sending) return
    setSending(true)
    setFeedback(null)
    try {
      const result = await sendTest.mutateAsync()
      const chResult = result.results.find((r) => r.channel === channel)
      setFeedback(chResult?.success ? 'success' : 'error')
    } catch {
      setFeedback('error')
    } finally {
      setSending(false)
    }
  }

  if (feedback === 'success') {
    return (
      <span className="ml-12 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-500/30 shadow-sm animate-fade-in-up">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-2.5 w-2.5" />
        </span>
        Notificación enviada
      </span>
    )
  }

  if (feedback === 'error') {
    return (
      <span className="ml-12 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-300 bg-red-100/80 dark:bg-red-500/15 border border-red-200/60 dark:border-red-500/30 shadow-sm animate-fade-in-up">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20">
          <X className="h-2.5 w-2.5" />
        </span>
        Error al enviar
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleTest}
      disabled={sending}
      className={cn(
        'ml-12 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm',
        sending
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:scale-[0.95]',
      )}
    >
      {sending ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Enviando...
        </>
      ) : (
        <>
          <Send className="h-3.5 w-3.5" />
          Probar
        </>
      )}
    </button>
  )
}
