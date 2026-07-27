import { Download } from 'lucide-react'
import ExportPanel from '../components/ExportPanel'

export default function ExportPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="mb-8">
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30">
            <Download className="h-7 w-7 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Exportar Datos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Descarga tus datos financieros en m\u00faltiples formatos
            </p>
          </div>
        </div>
      </div>

      <ExportPanel />
    </div>
  )
}
