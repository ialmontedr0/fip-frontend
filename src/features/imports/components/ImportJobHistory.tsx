import { useImportJobs } from '../hooks/useImports'
import ImportJobCard from './ImportJobCard'
import { Loader2, Inbox } from 'lucide-react'

export default function ImportJobHistory() {
  const { data, isLoading } = useImportJobs()
  const jobs = data?.jobs ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 mb-4">
          <Inbox className="h-7 w-7 text-purple-400" />
        </div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No hay importaciones previas</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Las importaciones que realices aparecer\u00e1n aqu\u00ed</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <ImportJobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
