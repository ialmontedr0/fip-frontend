import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as adminApi from '../api/admin'
import type {
  RoleCreate, RoleUpdate, UserRoleUpdateRequest,
  UserStatusUpdateRequest, UserCreateRequest, UserUpdateRequest,
  AssignPermissionRequest, AuditLogFilters,
} from '@/types/admin'

// ── Query Keys ──

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (skip?: number, limit?: number, role?: string) =>
    [...adminKeys.users(), { skip, limit, role }] as const,
  userDetail: (userId: string) =>
    [...adminKeys.users(), 'detail', userId] as const,
  roles: () => [...adminKeys.all, 'roles'] as const,
  roleList: (includeInactive?: boolean) =>
    [...adminKeys.roles(), { includeInactive }] as const,
  permissions: () => [...adminKeys.all, 'permissions'] as const,
  auditLogs: () => [...adminKeys.all, 'audit-logs'] as const,
  auditLogList: (filters?: AuditLogFilters) =>
    [...adminKeys.auditLogs(), filters] as const,
  auditStats: () => [...adminKeys.all, 'audit-stats'] as const,
  systemStats: () => [...adminKeys.all, 'system-stats'] as const,
}

// ── Users ──

export function useAdminUsers(skip = 0, limit = 20, role?: string) {
  return useQuery({
    queryKey: adminKeys.userList(skip, limit, role),
    queryFn: () => adminApi.listUsers(skip, limit, role).then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & UserRoleUpdateRequest) =>
      adminApi.updateUserRole(userId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users() })
      toast.success('Rol actualizado')
    },
    onError: () => toast.error('Error al actualizar rol'),
  })
}

export function useUpdateUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & UserStatusUpdateRequest) =>
      adminApi.updateUserStatus(userId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users() })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('Error al actualizar estado'),
  })
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminKeys.userDetail(userId),
    queryFn: () => adminApi.getUser(userId).then((r) => r.data),
    enabled: !!userId,
    staleTime: 1000 * 30,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UserCreateRequest) => adminApi.createUser(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users() })
      toast.success('Usuario creado')
    },
    onError: () => toast.error('Error al crear usuario'),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & UserUpdateRequest) =>
      adminApi.updateUser(userId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users() })
      qc.invalidateQueries({ queryKey: adminKeys.all })
      toast.success('Usuario actualizado')
    },
    onError: () => toast.error('Error al actualizar usuario'),
  })
}

// ── Roles ──

export function useAdminRoles(includeInactive = false) {
  return useQuery({
    queryKey: adminKeys.roleList(includeInactive),
    queryFn: () => adminApi.listRoles(includeInactive).then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RoleCreate) => adminApi.createRole(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.roles() })
      toast.success('Rol creado')
    },
    onError: () => toast.error('Error al crear rol'),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, ...data }: { roleId: string } & RoleUpdate) =>
      adminApi.updateRole(roleId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.roles() })
      toast.success('Rol actualizado')
    },
    onError: () => toast.error('Error al actualizar rol'),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (roleId: string) => adminApi.deleteRole(roleId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.roles() })
      toast.success('Rol eliminado')
    },
    onError: () => toast.error('Error al eliminar rol'),
  })
}

export function useAssignPermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, ...data }: { roleId: string } & AssignPermissionRequest) =>
      adminApi.assignPermission(roleId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.roles() })
      toast.success('Permiso asignado')
    },
    onError: () => toast.error('Error al asignar permiso'),
  })
}

export function useRemovePermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      adminApi.removePermission(roleId, permissionId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.roles() })
      toast.success('Permiso removido')
    },
    onError: () => toast.error('Error al remover permiso'),
  })
}

// ── Permissions ──

export function useAdminPermissions() {
  return useQuery({
    queryKey: adminKeys.permissions(),
    queryFn: () => adminApi.listPermissions().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

// ── Audit ──

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: adminKeys.auditLogList(filters),
    queryFn: () => adminApi.listAuditLogs(filters).then((r) => r.data),
    staleTime: 1000 * 15,
  })
}

export function useAuditLogStats() {
  return useQuery({
    queryKey: adminKeys.auditStats(),
    queryFn: () => adminApi.getAuditLogStats().then((r) => r.data),
    staleTime: 1000 * 30,
  })
}

// ── Stats ──

export function useSystemStats() {
  return useQuery({
    queryKey: adminKeys.systemStats(),
    queryFn: () => adminApi.getSystemStats().then((r) => r.data),
    staleTime: 1000 * 30,
  })
}
