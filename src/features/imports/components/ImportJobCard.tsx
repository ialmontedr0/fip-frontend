import { useNavigate } from 'react-router-dom'
import { formatRelativeTime } from '@/lib/utils'
import { FileText, ChevronRight } from 'lucide-react'
import ImportStatusBadge from './ImportStatusBadge'
import type { ImportJobResponse } from '@/types/imports'

interface ImportJobCardProps {
  job: ImportJobResponse
}

export default function ImportJobCard({ job }: ImportJobCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/imports/jobs/${job.id}`)}
      className="group relative rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
          <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {job.file_name}
            </p>
            <ImportStatusBadge status={job.status} />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatRelativeTime(job.created_at)} · {job.total_rows} filas · {job.valid_rows} v\u00e1lidas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {job.processed_rows}/{job.total_rows}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              {job.file_type.toUpperCase()}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  )
}
