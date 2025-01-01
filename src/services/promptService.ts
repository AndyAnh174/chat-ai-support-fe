import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

interface Prompt {
  system_prompt: string
  is_active: boolean
}

export const getUserPrompt = async (token: string): Promise<Prompt> => {
  const response = await axios.get(`${API_URL}/api/prompt`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateUserPrompt = async (token: string, system_prompt: string): Promise<void> => {
  await axios.post(`${API_URL}/api/prompt`, 
    { system_prompt },
    { headers: { Authorization: `Bearer ${token}` } }
  )
} 