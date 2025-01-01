import { createContext, useContext, useState, ReactNode } from 'react'
import { login as loginApi } from '../services/authService'
import axios from 'axios'

interface User {
  email: string
  username: string
  role: string
  displayName: string
  avatar: string
  apiKey?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateApiKey: (apiKey: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password)
      
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      setToken(response.access_token)
      setUser({
        email: email,
        username: response.username,
        role: response.role,
        displayName: response.display_name,
        avatar: response.avatar
      })
      setIsAuthenticated(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Đăng nhập thất bại')
      }
      throw new Error('Đăng nhập thất bại')
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateApiKey = async (apiKey: string) => {
    if (!user || !token) return
    
    try {
      // Gọi API cập nhật API key
      await axios.post(`${import.meta.env.VITE_API_URL}/api/update-api-key`, 
        { gemini_key: apiKey },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setUser({ ...user, apiKey })
    } catch (error) {
      throw new Error('Cập nhật API key thất bại')
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      token,
      login, 
      logout,
      updateApiKey
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 