import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
}

export default function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeId === tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeId === tab.id
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-700'
            } disabled:opacity-50`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4">{items.find((t) => t.id === activeId)?.content}</div>
    </div>
  )
}
