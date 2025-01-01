import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

interface User {
  username: string
  display_name: string
  role: string
  avatar: string
}

interface CreateUserData {
  username: string
  password: string
  display_name: string
  role: 'admin' | 'user'
}

interface UpdateUserData {
  display_name?: string
  role?: 'admin' | 'user'
  password?: string
}

interface ApiKey {
  gemini_key: string
  model: string
  is_active: boolean
}

export const getUsers = async (token: string): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const createUser = async (token: string, userData: CreateUserData): Promise<User> => {
  const response = await axios.post(`${API_URL}/api/users`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateUser = async (token: string, username: string, userData: UpdateUserData): Promise<User> => {
  const response = await axios.put(`${API_URL}/api/users/${username}`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const deleteUser = async (token: string, username: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const updateApiKey = async (token: string, username: string, gemini_key: string): Promise<void> => {
  await axios.post(`${API_URL}/api/update-api-key`, 
    { gemini_key },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

export const getUserApiKey = async (token: string): Promise<ApiKey> => {
  const response = await axios.get(`${API_URL}/api/get-api-key`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateUserApiKey = async (token: string, username: string, gemini_key: string): Promise<void> => {
  await axios.post(`${API_URL}/api/update-api-key`, 
    { username, gemini_key },
    { headers: { Authorization: `Bearer ${token}` } }
  )
} 