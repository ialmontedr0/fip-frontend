import { Plus, Trash2, MessageSquare } from 'lucide-react'
import type { ChatSession } from '@/types/chat'

interface Props {
  sessions: ChatSession[]
  activeId?: string
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export default function ChatSidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isLoading,
}: Props) {
  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 h-[calc(100vh-120px)] flex flex-col">
      <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all"
      >
        <Plus className="h-4 w-4" />
        Nueva conversacion
      </button>

      <div className="mt-4 flex-1 overflow-y-auto space-y-1">
        {isLoading && <p className="text-xs text-gray-500 dark:text-gray-400">Cargando...</p>}
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              s.id === activeId
                ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                : 'hover:bg-gray-50 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => onSelect(s.id)}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-sm truncate">{s.title}</span>
            <button
              type="button"
              aria-label="Eliminar conversacion"
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(s.id)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {sessions.length === 0 && !isLoading && (
          <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
            Sin conversaciones aun.
          </p>
        )}
      </div>
    </aside>
  )
}
