export type ChatRole = 'user' | 'assistant'
export type ChatType = 'general' | 'finance'

export interface ChatSession {
  id: string
  title: string
  chat_type: ChatType
  created_at: string | null
  updated_at: string | null
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  created_at: string
}

export interface ChatSessionDetail {
  id: string
  title: string
  chat_type: ChatType
  messages: ChatMessage[]
}

export interface ChatSessionListResponse {
  sessions: ChatSession[]
  total: number
}
