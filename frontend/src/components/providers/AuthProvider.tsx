'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
import type { User } from '@/types/auth'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/auth/tokens'
import { logout as logoutApi } from '@/lib/api/auth'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loginUser: (user: User, access: string, refresh: string) => void
  logoutUser: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser({ id: Number(payload.user_id), email: '', created_at: '', updated_at: '' })
      } catch {
        clearTokens()
      }
    }
    setIsLoading(false)
  }, [])

  const loginUser = useCallback((user: User, access: string, refresh: string) => {
    setTokens(access, refresh)
    setUser(user)
  }, [])

  const logoutUser = useCallback(() => {
    const refresh = getRefreshToken()
    if (refresh) {
      logoutApi(refresh).catch(() => {})
    }
    clearTokens()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
