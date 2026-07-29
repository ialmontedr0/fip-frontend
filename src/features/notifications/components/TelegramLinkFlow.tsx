import { useState, useCallback } from 'react'
import { Send, Check, Loader2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGenerateTelegramLinkCode, useCheckTelegramLink } from '../hooks/useNotifications'

interface TelegramLinkFlowProps {
  linked: boolean
  telegramChatId?: string | null
  onLinked: () => void
}

export default function TelegramLinkFlow({ linked, telegramChatId, onLinked }: TelegramLinkFlowProps) {
  const [step, setStep] = useState<'idle' | 'code' | 'linked'>(linked ? 'linked' : 'idle')
  const [code, setCode] = useState<string | null>(null)
  const generateCode = useGenerateTelegramLinkCode()
  const checkLink = useCheckTelegramLink()

  const handleStart = useCallback(async () => {
    try {
      const res = await generateCode.mutateAsync()
      setCode(res.code)
      setStep('code')
    } catch {
      /* error toast handled by hook */
    }
  }, [generateCode])

  if (step === 'linked' || linked) {
    return (
      <div className="ml-12 flex items-center gap-2 rounded-lg bg-emerald-100/80 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
        <Check className="h-4 w-4" />
        Telegram vinculado {telegramChatId && <span className="font-mono opacity-70">({telegramChatId})</span>}
      </div>
    )
  }

  if (step === 'code' && code) {
    const isVerified = checkLink.data?.linked
    if (isVerified) {
      onLinked()
      return null
    }
    return (
      <div className="ml-12 space-y-3 rounded-xl border border-purple-200/60 dark:border-purple-500/30 bg-purple-50/80 dark:bg-purple-500/10 p-4 animate-fade-in-up">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Envia este codigo al bot <span className="font-bold text-purple-600 dark:text-purple-400">@fip_platform_bot</span> en Telegram:
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="select-all rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-5 py-2.5 text-2xl font-black tracking-[0.3em] text-purple-600 dark:text-purple-400 shadow-inner">
            {code}
          </span>
          <a
            href={`https://t.me/fip_platform_bot`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-purple-600 text-white px-3 py-2.5 text-xs font-bold hover:bg-purple-700 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Abrir Telegram
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          Esperando vinculacion...
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          El codigo expira en 5 minutos. Si expira, genera uno nuevo.
        </p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={generateCode.isPending}
      className={cn(
        'ml-12 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm',
        generateCode.isPending
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:scale-[0.95]',
      )}
    >
      {generateCode.isPending ? (
        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generando...</>
      ) : (
        <><Send className="h-3.5 w-3.5" /> Vincular Telegram</>
      )}
    </button>
  )
}
