import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'
import { apiClient } from '@/lib/api/client'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login/', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register/', data)
  return response.data
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', { refresh })
  return response.data
}

export async function logout(refresh: string): Promise<void> {
  await apiClient.post('/auth/logout/', { refresh })
}
