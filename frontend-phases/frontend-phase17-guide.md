# Fase 17: Settings & User Profile

## Objetivos
- ProfilePage: edit name, email, phone, avatar, bio, address
- SecurityPage: change password (reset flow), MFA toggle (TOTP), active sessions
- PreferencesPage: language, timezone, currency, date/time format, theme, notification defaults
- Theme preference persistido (ya existe en theme-store.ts)
- Currency selector para display default
- Timezone selector con búsqueda

## Endpoints Backend

### Profile (`/users`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/users/me` | Perfil completo + perfil extendido |
| `PATCH` | `/users/me` | Actualizar perfil (phone, avatar_url, nombres, bio, dirección) |

### Security (`/auth`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/mfa/enable` | Habilitar MFA (genera secret + QR base64) |
| `POST` | `/auth/mfa/disable` | Deshabilitar MFA (requiere código TOTP) |
| `GET` | `/auth/sessions` | Listar sesiones activas |
| `POST` | `/auth/logout` | Cerrar sesión específica |
| `POST` | `/auth/logout-all` | Cerrar todas las sesiones |

### Preferences (`/users`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/users/me/preferences` | Obtener preferencias |
| `PATCH` | `/users/me/preferences` | Actualizar preferencias |
| `GET` | `/users/supported-values` | Valores soportados (currencies, timezones, languages) |

## Arquitectura

```
src/
  types/settings.ts              — Interfaces: Profile, Preferences, Session, MFA, etc.
  features/settings/
    api/settings.ts              — API functions
    hooks/useSettings.ts         — TanStack Query hooks
    components/
      SettingsNav.tsx            — Navegación interna (profile/security/preferences)
      ProfileForm.tsx            — Formulario de perfil
      AvatarUpload.tsx           — Subida de avatar con preview
      SecuritySection.tsx        — Sección de seguridad
      MFASetupDialog.tsx         — Modal setup MFA con QR
      SessionsList.tsx           — Lista de sesiones activas
      PreferencesForm.tsx        — Formulario de preferencias
      LanguageSelect.tsx         — Selector de idioma
      TimezoneSelect.tsx         — Selector de timezone con búsqueda
      CurrencySelect.tsx         — Selector de moneda
    pages/
      ProfilePage.tsx            — Página de perfil
      SecurityPage.tsx           — Página de seguridad
      PreferencesPage.tsx        — Página de preferencias
```

## Diseño
- Mismo patrón glassmorphism: `backdrop-blur-xl bg-white/80 dark:bg-gray-900/80`
- SettingsNav como ExpenseNav/AdminNav (tabs horizontales con pill animado)
- Formularios con Card, Button, Input de `components/ui/`
- Skeleton loading states
- Toast para feedback de guardado
- Dark mode soportado en todos los componentes

## Implementación Checklist
- [ ] `src/types/settings.ts`
- [ ] `src/features/settings/api/settings.ts`
- [ ] `src/features/settings/hooks/useSettings.ts`
- [ ] `SettingsNav.tsx`
- [ ] `AvatarUpload.tsx`
- [ ] `ProfileForm.tsx`
- [ ] `MFASetupDialog.tsx`
- [ ] `SessionsList.tsx`
- [ ] `SecuritySection.tsx`
- [ ] `LanguageSelect.tsx`
- [ ] `TimezoneSelect.tsx`
- [ ] `CurrencySelect.tsx`
- [ ] `PreferencesForm.tsx`
- [ ] `ProfilePage.tsx`
- [ ] `SecurityPage.tsx`
- [ ] `PreferencesPage.tsx`
- [ ] Update `SettingsPage.tsx` (hub)
- [ ] `lazy.ts` — lazy imports
- [ ] `index.tsx` — reemplazar PlaceholderPage
- [ ] `pnpm exec tsc --noEmit` — sin errores
