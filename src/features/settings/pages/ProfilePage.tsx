import { User } from 'lucide-react'
import SettingsNav from '../components/SettingsNav'
import ProfileForm from '../components/ProfileForm'

export default function ProfilePage() {
  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
      </div>

      <SettingsNav />

      <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-gray-100 bg-white/80 px-6 pb-5 pt-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-500/20">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Perfil</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Informaci&oacute;n personal y de contacto</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  )
}
