import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import PageTransition from '@/components/ui/PageTransition'
import { ErrorBoundary } from './ErrorBoundary'
import SkipLink from '@/components/ui/SkipLink'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useUIStore } from '@/stores/ui-store'
import OnboardingFlow from '@/features/onboarding/components/OnboardingFlow'

function MainLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen, setSearchOpen } = useUIStore()
  const location = useLocation()

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      preventDefault: true,
      handler: () => setSearchOpen(true),
    },
    {
      key: 'escape',
      handler: () => setSearchOpen(false),
    },
  ])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <SkipLink />
      <OnboardingFlow />

      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar mobile */}
      {mobileSidebarOpen && <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main-content" className="min-w-0 flex-1 overflow-y-scroll overflow-x-hidden p-4 lg:p-6">
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
