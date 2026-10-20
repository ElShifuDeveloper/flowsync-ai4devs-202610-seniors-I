import { apiRequest } from '@/lib/api'

const TOKEN_KEY = 'flowsync.token'

/**
 * Forma del usuario que expone el backend (`UserTransformer`).
 * Nunca incluye `password`.
 */
export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
  initials: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type SignupPayload = {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginPayload = {
  email: string
  password: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function fetchProfile(): Promise<User> {
  return apiRequest<User>('/api/v1/account/profile', { token: getToken() })
}

export function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/api/v1/account/logout', {
    method: 'POST',
    token: getToken(),
  })
}
