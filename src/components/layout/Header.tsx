import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { useUIStore } from '@/stores/ui-store'
import { Avatar, Badge } from '@/components/ui'
import {
  Bell,
  Menu,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  Search,
  Command,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Dropdown from '@/components/ui/Dropdown'
import NotificationDrawer from '@/features/notifications/components/NotificationDrawer'
import GlobalSearch from '@/features/search/components/GlobalSearch'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () =>
      api
        .get<{ unread_count: number }>('/notifications/stats')
        .then((r) => r.data.unread_count ?? 0)
        .catch(() => 0),
    refetchInterval: 30000,
    retry: false,
  })
}

function Header() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { setMobileSidebarOpen, searchOpen, setSearchOpen } = useUIStore()
  const { data: unreadCount = 0 } = useUnreadCount()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Global Search */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <Search className="h-4 w-4" />
          <span>Buscar...</span>
          <kbd className="ml-4 hidden items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500 md:inline-flex">
            <Command className="h-3 w-3" />
            K
          </kbd>
        </button>
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setNotifDrawerOpen(true)}
          className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <Badge
              variant="danger"
              size="sm"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center px-1 text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </button>

        <NotificationDrawer
          open={notifDrawerOpen}
          onClose={() => setNotifDrawerOpen(false)}
        />

        {/* User dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Avatar src={user?.avatar_url} alt={user?.email} size="sm" />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.email?.split('@')[0] || 'Usuario'}
              </span>
            </button>
          }
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
          <Dropdown.Item onClick={() => navigate('/settings/profile')}>
            <User className="mr-2 h-4 w-4" />
            Mi Perfil
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Configuracion
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout} danger>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesion
          </Dropdown.Item>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
