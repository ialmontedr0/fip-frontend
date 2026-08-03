import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export default function ChatInput({ onSend, disabled, isLoading }: Props) {
  const [text, setText] = useState<string>('')

  const submit = () => {
    const value = text.trim()
    if (!value || disabled) return
    onSend(value)
    setText('')
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        rows={1}
        placeholder="Pregunta sobre tus finanzas..."
        className="flex-1 resize-none px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !text.trim()}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
    </div>
  )
}
