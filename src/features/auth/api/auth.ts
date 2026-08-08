import api from '@/lib/api'
import type {
  LoginRequest,
  RegisterRequest,
  MFAVerifyRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  MFASetupResponse,
  SessionListResponse,
  AuthResponseData,
} from '../types'

export function loginApi(data: LoginRequest) {
  return api.post<AuthResponseData>('/auth/login', data)
}

export function registerApi(data: RegisterRequest) {
  return api.post<AuthResponseData>('/auth/register', data)
}

export function verifyMFAApi(data: MFAVerifyRequest) {
  return api.post<AuthResponseData>('/auth/mfa/verify', data)
}

export function enableMFAApi() {
  return api.post<MFASetupResponse>('/auth/mfa/enable')
}

export function disableMFAApi(data: { code: string }) {
  return api.post<{ message: string }>('/auth/mfa/disable', data)
}

export function refreshTokenApi(refresh_token: string) {
  return api.post<{ tokens: { access_token: string; refresh_token: string } }>('/auth/refresh', { refresh_token })
}

export function logoutApi() {
  return api.post<{ message: string }>('/auth/logout-all')
}

export function requestPasswordResetApi(data: RequestPasswordResetRequest) {
  return api.post<{ message: string }>('/auth/request-password-reset', data)
}

export function resetPasswordApi(data: ResetPasswordRequest) {
  return api.post<{ message: string }>('/auth/reset-password', data)
}

export function verifyEmailApi(data: VerifyEmailRequest) {
  return api.post<{ message: string }>('/auth/verify-email', data)
}

export function requestEmailVerificationApi() {
  return api.post<{ message: string }>('/auth/request-email-verification')
}

export function getSessionsApi() {
  return api.get<SessionListResponse>('/auth/sessions')
}

export function revokeSessionApi(session_id: string) {
  return api.post<{ message: string }>('/auth/sessions/revoke', { session_id })
}
