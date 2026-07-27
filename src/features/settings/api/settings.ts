import api from '@/lib/api'
import type {
  UserProfileResponse, UpdateProfileRequest, UpdateProfileResponse,
  UserPreferencesResponse, UpdatePreferencesRequest, UpdatePreferencesResponse,
  SupportedValuesResponse, SessionInfo, MFASetupResponse,
  DisableMFARequest, LogoutSessionRequest,
} from '@/types/settings'

// ── Profile ──

export function getProfile() {
  return api.get<UserProfileResponse>('/users/me')
}

export function updateProfile(data: UpdateProfileRequest) {
  return api.patch<UpdateProfileResponse>('/users/me', data)
}

// ── Preferences ──

export function getPreferences() {
  return api.get<UserPreferencesResponse>('/users/me/preferences')
}

export function updatePreferences(data: UpdatePreferencesRequest) {
  return api.patch<UpdatePreferencesResponse>('/users/me/preferences', data)
}

export function getSupportedValues() {
  return api.get<SupportedValuesResponse>('/users/supported-values')
}

// ── MFA ──

export function enableMFA() {
  return api.post<MFASetupResponse>('/auth/mfa/enable')
}

export function disableMFA(data: DisableMFARequest) {
  return api.post<{ success: boolean; message: string }>('/auth/mfa/disable', data)
}

// ── Sessions ──

export function getSessions() {
  const params = { skip: 0, limit: 50 }
  return api.get<{ sessions: SessionInfo[]; total: number }>('/auth/sessions', { params })
}

export function logoutSession(data: LogoutSessionRequest) {
  return api.post<{ success: boolean; message: string }>('/auth/logout', data)
}

export function logoutAllSessions() {
  return api.post<{ success: boolean; message: string }>('/auth/logout-all')
}
