# Fase 16: Admin Panel — Gu\u00eda de Implementaci\u00f3n

## Arquitectura General

### Resumen
Panel de administraci\u00f3n completo con gesti\u00f3n de usuarios, roles, permisos, auditor\u00eda y estad\u00edsticas del sistema. Todo protegido por `RequireAdmin` (role-based guard).

### Endpoints Backend (16 total)

Todos bajo `/api/v1/admin` y requieren `require_admin()`.

#### Users (3 endpoints)
| M\u00e9todo | Ruta | Descripci\u00f3n |
|-----------|------|-------------|
| `GET` | `/admin/users?skip=&limit=&role=` | Listar usuarios (server-side paginaci\u00f3n + filtro por rol) |
| `PUT` | `/admin/users/{user_id}/role` | Cambiar rol de usuario |
| `PUT` | `/admin/users/{user_id}/status` | Activar/desactivar usuario |

#### Roles (7 endpoints)
| M\u00e9todo | Ruta | Descripci\u00f3n |
|-----------|------|-------------|
| `GET` | `/admin/roles?include_inactive=` | Listar roles |
| `POST` | `/admin/roles` | Crear rol |
| `GET` | `/admin/roles/{role_id}` | Detalle de rol |
| `PUT` | `/admin/roles/{role_id}` | Actualizar rol |
| `DELETE` | `/admin/roles/{role_id}` | Eliminar rol (no system) |
| `POST` | `/admin/roles/{role_id}/permissions` | Asignar permiso a rol |
| `DELETE` | `/admin/roles/{role_id}/permissions/{permission_id}` | Remover permiso de rol |

#### Permissions (2 endpoints)
| M\u00e9todo | Ruta | Descripci\u00f3n |
|-----------|------|-------------|
| `GET` | `/admin/permissions` | Listar todos los permisos |
| `GET` | `/admin/permissions/{permission_id}` | Detalle de permiso |

#### Audit Logs (3 endpoints)
| M\u00e9todo | Ruta | Descripci\u00f3n |
|-----------|------|-------------|
| `GET` | `/admin/audit?user_id=&action=&resource=&status=&skip=&limit=` | Listar logs con filtros |
| `GET` | `/admin/audit/stats` | Estad\u00edsticas de auditor\u00eda |
| `GET` | `/admin/audit/{log_id}` | Detalle de log |

#### System Stats (1 endpoint)
| M\u00e9todo | Ruta | Descripci\u00f3n |
|-----------|------|-------------|
| `GET` | `/admin/stats` | Estad\u00edsticas del sistema |

### Esquemas del Backend (completos en `admin/schemas.py`)

```typescript
// Role
interface RoleResponse {
  id: string; display_name: string; name: string;
  description?: string; parent_role_id?: string;
  is_system: boolean; is_active: boolean; created_at: string;
}
interface RoleCreate { name: string; display_name: string; description?: string; parent_role_id?: string; }
interface RoleUpdate { display_name?: string; description?: string; is_active?: boolean; }

// Permission
interface PermissionResponse {
  id: string; name: string; resource: string; action: string; description?: string;
}

// User (admin view)
interface UserListResponse {
  id: string; email: string; role: string;
  is_active: boolean; is_verified: boolean; created_at: string;
}

// Audit
interface AuditLogResponse {
  id: string; user_id?: string; action: string; resource: string;
  resource_id?: string; details?: Record<string, unknown>;
  ip_address?: string; status: string; created_at: string;
}
interface AuditLogStatsResponse {
  total: number; by_action: Record<string, number>;
  by_resource: Record<string, number>; by_status: Record<string, number>;
}

// Stats
interface SystemStatsResponse {
  total_users: number; active_users: number; total_roles: number;
  total_permissions: number; total_audit_entries: number; recent_logins: number;
}
```

---

## 1. Tipos TypeScript

### `src/types/admin.ts`

Ver secci\u00f3n 1 en el c\u00f3digo implementado abajo.

---

## 2. API Layer

### `src/features/admin/api/admin.ts`

Funciones por categor\u00eda:
- `listUsers(skip, limit, role)` → GET /admin/users
- `updateUserRole(userId, role)` → PUT /admin/users/{id}/role
- `updateUserStatus(userId, isActive)` → PUT /admin/users/{id}/status
- `listRoles(includeInactive)` → GET /admin/roles
- `createRole(data)` → POST /admin/roles
- `updateRole(roleId, data)` → PUT /admin/roles/{id}
- `deleteRole(roleId)` → DELETE /admin/roles/{id}
- `listPermissions()` → GET /admin/permissions
- `assignPermission(roleId, permissionId)` → POST /admin/roles/{id}/permissions
- `removePermission(roleId, permissionId)` → DELETE /admin/roles/{id}/permissions/{permId}
- `listAuditLogs(filters)` → GET /admin/audit
- `getAuditLogStats()` → GET /admin/audit/stats
- `getSystemStats()` → GET /admin/stats

---

## 3. TanStack Query Hooks

### `src/features/admin/hooks/useAdmin.ts`

Query keys:
- `['admin', 'users', { skip, limit, role }]`
- `['admin', 'roles', { includeInactive }]`
- `['admin', 'permissions']`
- `['admin', 'audit-logs', filters]`
- `['admin', 'audit-stats']`
- `['admin', 'system-stats']`

Mutations with `invalidateQueries` on success.

---

## 4. Componentes (10 files)

### Estructura
```
src/features/admin/components/
  UsersTable.tsx          — Tabla de usuarios con search, filter, paginate
  UserRoleSelect.tsx      — Dropdown para cambiar rol
  UserStatusToggle.tsx    — Toggle switch activo/inactivo
  UserDetailSidebar.tsx   — Sidebar con detalle de usuario + acciones
  RolesTable.tsx          — Tabla de roles + CRUD
  RoleFormModal.tsx       — Modal crear/editar rol
  RolePermissionsPanel.tsx — Asignar/remover permisos de un rol
  PermissionBadge.tsx     — Badge de permiso con color por resource
  AuditLogViewer.tsx      — Tabla de logs con filtros
  AuditLogFilters.tsx     — Filtros para audit logs
  AuditLogStatsCards.tsx  — Cards con estad\u00edsticas de auditor\u00eda
  SystemStatsCards.tsx    — Cards con estad\u00edsticas del sistema
```

---

## 5. P\u00e1ginas (6 files)

| Ruta | P\u00e1gina | Descripci\u00f3n |
|------|-----------|-------------|
| `/admin/users` | `AdminUsersPage` | Lista de usuarios + b\u00fasqueda + filtro por rol |
| `/admin/users/:id` | `AdminUserDetailPage` | Detalle + cambiar rol + toggle status |
| `/admin/roles` | `AdminRolesPage` | CRUD de roles + asignar permisos |
| `/admin/permissions` | `AdminPermissionsPage` | Vista de todos los permisos del sistema |
| `/admin/audit-logs` | `AdminAuditLogsPage` | Visor de logs con filtros + stats |
| `/admin/stats` | `AdminStatsPage` | Dashboard de estad\u00edsticas del sistema |

---

## 6. Estrategia de Dise\u00f1o

- **Layout**: Sin layout especial — usa `MainLayout` existente con sidebar + header. El `RequireAdmin` wrapper ya est\u00e1 implementado en `routes/index.tsx`.
- **Sidebar**: Los enlaces de admin ya existen en el sidebar (users, roles, permissions, audit, stats).
- **Glassmorphism**: Mismo patr\u00f3n que el resto del app (`backdrop-blur-xl bg-white/80 dark:bg-gray-900/80`).
- **KPIs**: Cards con gradiente y colores por tipo (azul para users, p\u00farpura para roles, verde para activos, etc.).
- **Tablas**: Cabecera oscura con fondo indigo, filas zebra, paginaci\u00f3n server-side, b\u00fasqueda con debounce.
- **Badges de estado**: Verde para activo/completado, rojo para inactivo/fallido, \u00e1mbar para pendiente.
- **Responsive**: Cards en mobile, tablas scrollables horizontalmente.

---

## 7. Implementaci\u00f3n Checklist

### Types
- [ ] `src/types/admin.ts` — todas las interfaces

### API Layer
- [ ] `src/features/admin/api/admin.ts` — 13 funciones

### Hooks
- [ ] `src/features/admin/hooks/useAdmin.ts` — queries + mutations

### Admin Components
- [ ] `UsersTable.tsx`
- [ ] `UserRoleSelect.tsx`
- [ ] `UserStatusToggle.tsx`
- [ ] `UserDetailSidebar.tsx`
- [ ] `RolesTable.tsx`
- [ ] `RoleFormModal.tsx`
- [ ] `RolePermissionsPanel.tsx`
- [ ] `PermissionBadge.tsx`
- [ ] `AuditLogViewer.tsx`
- [ ] `AuditLogFilters.tsx`
- [ ] `AuditLogStatsCards.tsx`
- [ ] `SystemStatsCards.tsx`

### Pages
- [ ] `AdminUsersPage.tsx`
- [ ] `AdminUserDetailPage.tsx`
- [ ] `AdminRolesPage.tsx`
- [ ] `AdminPermissionsPage.tsx`
- [ ] `AdminAuditLogsPage.tsx`
- [ ] `AdminStatsPage.tsx`

### Routes
- [ ] `lazy.ts` — lazy imports
- [ ] `index.tsx` — reemplazar PlaceholderPage con componentes reales

### Verification
- [ ] `pnpm exec tsc --noEmit` — sin errores
- [ ] Navegar a /admin/users — ver lista de usuarios
- [ ] Cambiar rol de usuario
- [ ] Activar/desactivar usuario
- [ ] CRUD roles
- [ ] Asignar/remover permisos
- [ ] Ver audit logs con filtros
- [ ] Ver stats del sistema
