import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import PageTransition from '@/components/ui/PageTransition'
import { ErrorBoundary } from './ErrorBoundary'
import { useUIStore } from '@/stores/ui-store'

function MainLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar mobile */}
      {mobileSidebarOpen && <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-scroll p-4 lg:p-6">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
