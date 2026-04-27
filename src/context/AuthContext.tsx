import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  exp: number
}

interface AuthContextValue {
  userId: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readToken(): string | null {
  const token = localStorage.getItem('fh_token')
  if (!token) return null
  try {
    const { exp } = jwtDecode<JwtPayload>(token)
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('fh_token')
      return null
    }
    return token
  } catch {
    localStorage.removeItem('fh_token')
    return null
  }
}

function extractUserId(token: string): string {
  return jwtDecode<JwtPayload>(token).sub
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  const login = useCallback((newToken: string) => {
    localStorage.setItem('fh_token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fh_token')
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userId: token ? extractUserId(token) : null,
        isAuthenticated: token !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
