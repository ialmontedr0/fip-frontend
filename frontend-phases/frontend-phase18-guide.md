# Fase 18: Polish & Performance

## Objetivos
- Loading states: skeleton components everywhere
- Error boundaries por feature
- Empty states con ilustracion + mensaje + CTA
- Responsive design audit
- Dark mode audit
- Keyboard navigation audit
- Accessibility audit (ARIA labels, focus management)
- Performance audit: bundle size, re-renders, lazy loading
- Add react-helmet-async para SEO/page titles
- Add page transitions (framer-motion)
- Add toast notifications system-wide
- Add confirmation dialogs for destructive actions
- Add undo snackbar for soft-deletes

## Entregables
- UX pulido
- Performance optimizado
- Accesibilidad mejorada

## Archivos Creados/Modificados

### Nuevos Componentes UI
- `src/components/ui/ConfirmDialog.tsx` — Modal de confirmación con variante destructiva
- `src/components/ui/UndoSnackbar.tsx` — Snackbar con botón de deshacer para soft-deletes
- `src/components/ui/SEOHead.tsx` — Componente react-helmet-async para títulos SEO
- `src/components/ui/PageTransition.tsx` — Wrapper de animación con framer-motion
- `src/components/ui/SkeletonVariants.tsx` — Skeletons específicos (TableSkeleton, CardSkeleton, ChartSkeleton, FormSkeleton, KPISkeleton, ProfileSkeleton, PageSkeleton, ListSkeleton)

### Mejoras a Componentes Existentes
- `src/components/ui/Modal.tsx` — ARIA mejorado, focus trap básico, aria-label por defecto
- `src/components/ui/Button.tsx` — aria-label, role, keyboard support
- `src/components/ui/EmptyState.tsx` — Variantes: default, search, error, loading; iconos por defecto
- `src/components/ui/Skeleton.tsx` — Variantes extendidas, className passthrough mejorado
- `src/components/ui/index.ts` — Export all new components

### Modificaciones Globales
- `src/App.tsx` — HelmetProvider wrapper, UndoSnackbar global
- `src/routes/index.tsx` — PageTransition wrapper en rutas de layout principal

## Estrategia de Implementacion

### 1. PageTransition + SEO
Cada ruta dentro del MainLayout se envuelve en:
```tsx
<PageTransition>
  <SuspenseWrapper>
    <PageComponent />
  </SuspenseWrapper>
</PageTransition>
```
Cada PageComponent incluye <SEOHead title="..." description="..." />.

### 2. ConfirmDialog
Se usa para todas las acciones destructivas (eliminar, desactivar, archivar).
Patron:
```tsx
const [confirmOpen, setConfirmOpen] = useState(false)
// ...
<ConfirmDialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Eliminar cuenta"
  message="Esta accion no se puede deshacer."
  confirmLabel="Eliminar"
  destructive
/>
```

### 3. UndoSnackbar
Integrado en el Toaster global. Se usa desde mutations:
```tsx
import toast from 'react-hot-toast'
import { undoToast } from '@/components/ui/UndoSnackbar'

// En onSuccess de mutation:
undoToast({
  message: 'Transaccion eliminada',
  onUndo: () => restoreMutate(data.id),
  duration: 6000,
})
```

### 4. Skeletons
- `TableSkeleton` — 5 filas animadas con columnas variadas
- `CardSkeleton` — Card con header + body placeholder
- `ChartSkeleton` — Area rectangular con gradient animation
- `FormSkeleton` — 4-5 campos de formulario placeholder
- `KPISkeleton` — Card con numero + label placeholder
- `ProfileSkeleton` — Avatar + campos de perfil
- `PageSkeleton` — Header + breadcrumb + contenido
- `ListSkeleton` — Lista vertical de items

### 5. React.memo
Aplicado a:
- List item components (TransactionItem, AccountItem, etc.)
- Chart components (AreaChart, BarChart, PieChart, etc.)
- Card components (KPICard, BudgetCard, GoalCard, etc.)
- Badge, Avatar, StatusIndicator

### 6. Enhanced Button Keyboard
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    props.onClick?.(e as any)
  }
}}
```

### 7. ARIA Labels
- Icon-only buttons: `<button aria-label="Cerrar sesion">`
- Modals: role="dialog", aria-modal, aria-labelledby
- Tabs: role="tablist", role="tab", aria-selected
- Live regions: aria-live="polite" for dynamic content

### 8. EmptyState variants
- `variant="default"` — icon + title + description + CTA (crear primero)
- `variant="search"` — lupa + "No se encontraron resultados" + limpiar filtros
- `variant="error"` — warning + mensaje de error + retry
- `variant="loading"` — skeleton/spinner animado

## Uso en Features

Cada feature page debe:
1. Importar y usar skeleton de su tipo mientras carga
2. Importar y usar EmptyState cuando no hay datos
3. Importar ErrorBoundary de feature
4. Incluir <SEOHead> para title
5. Usar ConfirmDialog para acciones destructivas
6. Usar undoToast para soft-deletes

## Bundle Analysis Setup

```bash
pnpm add -D vite-bundle-analyzer
```

En vite.config.ts:
```ts
import { visualizer } from 'rollup-plugin-visualizer'
// ...
plugins: [
  react(),
  visualizer({ open: true, filename: 'dist/stats.html' }),
],
```
