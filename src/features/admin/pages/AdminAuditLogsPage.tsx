import { ScrollText } from 'lucide-react'
import AuditLogViewer from '../components/AuditLogViewer'
import AuditLogStatsCards from '../components/AuditLogStatsCards'
import AdminNav from '../components/AdminNav'

export default function AdminAuditLogsPage() {
  return (
    <div className="relative space-y-6 pb-8">
      <AdminNav />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-gray-100 bg-white/80 px-4 pb-5 pt-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <ScrollText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Auditor&iacute;a</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Registro de actividades del sistema</p>
          </div>
        </div>
      </div>

      <AuditLogStatsCards />
      <AuditLogViewer />
    </div>
  )
}
