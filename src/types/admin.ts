export interface RoleResponse {
  id: string
  name: string
  display_name: string
  description: string | null
  parent_role_id: string | null
  is_system: boolean
  is_active: boolean
  created_at: string
}

export interface RoleCreate {
  name: string
  display_name: string
  description?: string
  parent_role_id?: string
}

export interface RoleUpdate {
  display_name?: string
  description?: string
  is_active?: boolean
}

export interface RoleListResponse {
  roles: RoleResponse[]
  total: number
}

export interface PermissionResponse {
  id: string
  name: string
  resource: string
  action: string
  description: string | null
}

export interface PermissionListResponse {
  permissions: PermissionResponse[]
  total: number
}

export interface AdminUserListResponse {
  id: string
  email: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export interface AdminUserListData {
  users: AdminUserListResponse[]
  total: number
}

export interface UserDetailResponse {
  id: string
  email: string
  role: string
  is_active: boolean
  is_verified: boolean
  phone: string | null
  avatar_url: string | null
  mfa_enabled: boolean
  last_login_at: string | null
  login_count: number
  created_at: string
  updated_at: string
}

export interface UserCreateRequest {
  email: string
  password: string
  role: string
  phone?: string
}

export interface UserCreateResponse {
  id: string
  email: string
  role: string
  is_active: boolean
  is_verified: boolean
  phone: string | null
  created_at: string
}

export interface UserUpdateRequest {
  email?: string
  role?: string
  is_active?: boolean
  is_verified?: boolean
  phone?: string | null
}

export interface UserRoleUpdateRequest {
  role: string
}

export interface UserRoleUpdateResponse {
  success: boolean
  old_role: string
  new_role: string
}

export interface UserStatusUpdateRequest {
  is_active: boolean
}

export interface UserStatusUpdateResponse {
  success: boolean
  is_active: boolean
}

export interface AuditLogResponse {
  id: string
  user_id: string | null
  action: string
  resource: string
  resource_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  status: string
  created_at: string
}

export interface AuditLogListResponse {
  logs: AuditLogResponse[]
  total: number
}

export interface AuditLogFilters {
  user_id?: string
  action?: string
  resource?: string
  status?: string
  skip?: number
  limit?: number
}

export interface AuditLogStatsResponse {
  total: number
  by_action: Record<string, number>
  by_resource: Record<string, number>
  by_status: Record<string, number>
}

export interface SystemStatsResponse {
  total_users: number
  active_users: number
  total_roles: number
  total_permissions: number
  total_audit_entries: number
  recent_logins: number
}

export interface AssignPermissionRequest {
  permission_id: string
}

export type UserRole = 'admin' | 'moderator' | 'user'
