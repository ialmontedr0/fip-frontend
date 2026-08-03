import type { ChatMessage } from '@/types/chat'

interface Props {
  message: Pick<ChatMessage, 'role' | 'content'>
  isStreaming?: boolean
}

export default function ChatMessageBuble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 rounded-bl-sm'
        }`}
      >
        {message.content}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse align-middle" />
        )}
      </div>
    </div>
  )
}
