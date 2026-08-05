/// <reference types="vite/client" />

declare module '*.css' {
  const content: string
  export default content
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
  }): (reloadPage?: boolean) => void
}
