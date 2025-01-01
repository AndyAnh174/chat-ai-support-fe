import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { generateChatResponse } from '../services/chatService'
import { getUserApiKey } from '../services/userService'
import { getUserPrompt } from '../services/promptService'
import ReactMarkdown from 'react-markdown'
import { Icon, IconSend, IconRobot } from '../components/Icons'

interface Message {
  role: 'user' | 'assistant'
  content: string
} 

const Chat = () => {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUserSettings = async () => {
      if (!token) return
      
      try {
        // Lấy API key của user
        const apiKeyData = await getUserApiKey(token)
        if (!apiKeyData.gemini_key) {
          setError('Vui lòng cài đặt Gemini API Key trong hồ sơ để bắt đầu chat')
          return
        }
        setApiKey(apiKeyData.gemini_key)
        
        // Lấy system prompt của user
        const promptData = await getUserPrompt(token)
        setSystemPrompt(promptData.system_prompt)
      } catch (err) {
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.')
      }
    }
    
    loadUserSettings()
  }, [token])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !apiKey || loading) return
    
    const userMessage = input.trim()
    setInput('')
    setError('')
    setLoading(true)
    setIsTyping(true)
    
    // Thêm tin nhắn của user
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    try {
      // Gọi API để lấy phản hồi
      const response = await generateChatResponse(userMessage, apiKey, systemPrompt)
      
      // Thêm phản hồi từ assistant
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể lấy phản hồi từ AI')
      }
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  if (!apiKey) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <Icon icon={IconRobot} size={48} className="mx-auto mb-4" />
            <h2 className="card-title justify-center mb-2">Chưa có API Key</h2>
            <p>Bạn cần cài đặt Google Gemini API Key trong trang Hồ sơ để bắt đầu chat.</p>
            <div className="card-actions justify-center mt-4">
              <a href="/profile" className="btn btn-primary">
                Đi đến Hồ sơ
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 flex flex-col">
      {/* Khu vực chat */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.role === 'assistant' ? 'chat-start' : 'chat-end'
              }`}
            >
              <div className="chat-bubble bg-base-100">
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat chat-start">
              <div className="chat-bubble bg-base-100">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Form nhập tin nhắn */}
      <div className="bg-base-100 p-4">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <input
            type="text"
            className="input input-bordered flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !input.trim()}
          >
            <Icon icon={IconSend} size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat 