import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  activeDropdown: string | null
  searchOpen: boolean

  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setActiveDropdown: (id: string | null) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  activeDropdown: null,
  searchOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  setActiveDropdown: (id) => set({ activeDropdown: id }),

  setSearchOpen: (open) => set({ searchOpen: open }),
}))
