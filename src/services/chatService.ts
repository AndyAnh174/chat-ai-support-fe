import axios from 'axios'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta'
const MODEL = 'gemini-pro'
const MAX_RETRIES = 3
const BASE_DELAY = 10000 // Tăng delay cơ bản lên 10 giây
const REQUEST_TIMEOUT = 30000 // 30 giây timeout

// Tạo instance axios riêng với timeout
const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Cache để lưu thời gian request cuối cùng
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 5000 // Tăng lên 5 giây

// Hàm tính thời gian chờ với exponential backoff
const getBackoffDelay = (retryCount: number): number => {
  return BASE_DELAY * Math.pow(2, retryCount) + Math.random() * 1000
}

export const generateChatResponse = async (
  message: string, 
  apiKey: string,
  systemPrompt?: string,
  retryCount = 0
): Promise<string> => {
  try {
    // Đảm bảo khoảng cách giữa các request
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
      console.log(`Waiting ${waitTime}ms before next request...`)
      await sleep(waitTime)
    }
    
    // Format prompt theo cấu trúc mới
    const prompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${message}`
      : message

    const response = await axiosInstance.post(
      `${GEMINI_API_URL}/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }
    )

    // Cập nhật thời gian request cuối
    lastRequestTime = Date.now()

    // Kiểm tra và xử lý response
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API')
    }

    // Lấy text từ response
    const generatedText = response.data.candidates[0].content.parts[0].text
    return generatedText
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Xử lý rate limit với exponential backoff
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        const backoffDelay = getBackoffDelay(retryCount)
        console.log(`Rate limit hit, retrying in ${backoffDelay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`)
        await sleep(backoffDelay)
        return generateChatResponse(message, apiKey, systemPrompt, retryCount + 1)
      }

      if (error.response?.status === 400) {
        throw new Error('API key không hợp lệ hoặc đã hết hạn')
      }

      // Thông báo lỗi rate limit nếu đã hết số lần retry
      if (error.response?.status === 429) {
        throw new Error('Đã vượt quá giới hạn request. Vui lòng đợi 1-2 phút rồi thử lại.')
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Vui lòng thử lại.')
      }

      throw new Error(error.response?.data?.error?.message || 'Lỗi khi gọi Gemini API')
    }
    throw error
  }
} 