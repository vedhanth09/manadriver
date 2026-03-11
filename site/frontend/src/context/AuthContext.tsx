import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import api from "@/services/api"
import type { User, ApiResponse, SignupData, LoginCredentials } from "@/types"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  signup: (data: SignupData) => Promise<User>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export type { AuthContextValue }

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  // Fetch current user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get<ApiResponse<{ user: User }>>("/api/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await api.post<
      ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
    >("/api/auth/login", credentials)

    const { user: userData, accessToken, refreshToken } = res.data.data
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    setUser(userData)
    return userData
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    const res = await api.post<
      ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
    >("/api/auth/signup", data)

    const { user: userData, accessToken, refreshToken } = res.data.data
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    api.post("/api/auth/logout").catch(() => {})
  }, [])

  const refreshUser = useCallback(async () => {
    const res = await api.get<ApiResponse<{ user: User }>>("/api/auth/me")
    setUser(res.data.data.user)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
