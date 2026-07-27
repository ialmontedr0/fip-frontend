import api from '@/lib/api'
import type {
  RoleListResponse, RoleCreate, RoleUpdate, RoleResponse,
  PermissionListResponse, AdminUserListData,
  UserRoleUpdateRequest, UserRoleUpdateResponse,
  UserStatusUpdateRequest, UserStatusUpdateResponse,
  UserCreateRequest, UserCreateResponse,
  UserUpdateRequest, UserDetailResponse,
  AuditLogListResponse, AuditLogFilters, AuditLogStatsResponse,
  SystemStatsResponse, AssignPermissionRequest,
} from '@/types/admin'

// ── Users ──

export function listUsers(skip = 0, limit = 20, role?: string) {
  return api.get<AdminUserListData>('/admin/users', {
    params: { skip, limit, ...(role && { role }) },
  })
}

export function getUser(userId: string) {
  return api.get<UserDetailResponse>(`/admin/users/${userId}`)
}

export function createUser(data: UserCreateRequest) {
  return api.post<UserCreateResponse>('/admin/users', data)
}

export function updateUser(userId: string, data: UserUpdateRequest) {
  return api.put<UserDetailResponse>(`/admin/users/${userId}`, data)
}

export function updateUserRole(userId: string, data: UserRoleUpdateRequest) {
  return api.put<UserRoleUpdateResponse>(`/admin/users/${userId}/role`, data)
}

export function updateUserStatus(userId: string, data: UserStatusUpdateRequest) {
  return api.put<UserStatusUpdateResponse>(`/admin/users/${userId}/status`, data)
}

// ── Roles ──

export function listRoles(includeInactive = false) {
  return api.get<RoleListResponse>('/admin/roles', {
    params: { include_inactive: includeInactive },
  })
}

export function createRole(data: RoleCreate) {
  return api.post<RoleResponse>('/admin/roles', data)
}

export function updateRole(roleId: string, data: RoleUpdate) {
  return api.put<RoleResponse>(`/admin/roles/${roleId}`, data)
}

export function deleteRole(roleId: string) {
  return api.delete<{ success: boolean; message: string }>(`/admin/roles/${roleId}`)
}

export function assignPermission(roleId: string, data: AssignPermissionRequest) {
  return api.post<{ success: boolean }>(`/admin/roles/${roleId}/permissions`, data)
}

export function removePermission(roleId: string, permissionId: string) {
  return api.delete<{ success: boolean }>(`/admin/roles/${roleId}/permissions/${permissionId}`)
}

// ── Permissions ──

export function listPermissions() {
  return api.get<PermissionListResponse>('/admin/permissions')
}

// ── Audit ──

export function listAuditLogs(filters: AuditLogFilters) {
  return api.get<AuditLogListResponse>('/admin/audit', { params: filters })
}

export function getAuditLogStats() {
  return api.get<AuditLogStatsResponse>('/admin/audit/stats')
}

// ── Stats ──

export function getSystemStats() {
  return api.get<SystemStatsResponse>('/admin/stats')
}
