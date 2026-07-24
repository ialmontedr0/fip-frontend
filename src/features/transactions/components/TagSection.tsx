import { cn } from '@/lib/utils'
import { useAddTags, useRemoveTag } from '../hooks/useTransactions'
import TagInput from './TagInput'
import { X, Tag } from 'lucide-react'
import type { TransactionDetailResponse } from '@/types/transactions'

interface Props {
  transaction: TransactionDetailResponse
  className?: string
}

export default function TagSection({ transaction, className }: Props) {
  const addTags = useAddTags()
  const removeTag = useRemoveTag()

  const handleAddTags = (tags: string[]) => {
    if (tags.length === 0) return
    addTags.mutate({ transactionId: transaction.id, data: { tags } })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Etiquetas ({transaction.tags.length})
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {transaction.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 px-2.5 py-1 text-xs font-medium border border-primary-200/50 dark:border-primary-500/20 group"
          >
            {tag}
            <button
              onClick={() => removeTag.mutate({ transactionId: transaction.id, tagName: tag })}
              className="hover:bg-primary-200/50 dark:hover:bg-primary-500/20 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <TagInput
        value={[]}
        onChange={(tags) => handleAddTags(tags)}
        suggestions={[]}
        placeholder="Agregar etiqueta..."
      />
    </div>
  )
}
