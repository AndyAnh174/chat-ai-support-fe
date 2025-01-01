import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  role: string
  display_name: string
  avatar: string
  username: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, {
    username: email,
    password: password
  })
  return response.data
} 