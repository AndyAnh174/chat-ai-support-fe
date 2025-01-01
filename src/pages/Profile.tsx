import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Icon, IconUser, IconKey } from '../components/Icons'

const Profile = () => {
  const { user, updateApiKey } = useAuth()
  const [apiKey, setApiKey] = useState(user?.apiKey || '')
  const [showApiKey, setShowApiKey] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      updateApiKey(apiKey.trim())
      setMessage('API Key đã được cập nhật thành công!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
              <Icon icon={IconUser} size={24} />
              Hồ Sơ Người Dùng
            </h2>

            {/* Thông tin cơ bản */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm font-semibold">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Tên</label>
                <p className="text-lg">{user?.name}</p>
              </div>
            </div>

            {/* Form API Key */}
            <div className="divider">API Key</div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Icon icon={IconKey} size={20} />
                    Google Gemini API Key
                  </span>
                </label>
                <div className="join">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Nhập Google Gemini API Key của bạn"
                    className="input input-bordered join-item flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="btn join-item"
                  >
                    {showApiKey ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt">
                    Lấy API key tại: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="link link-primary">Google AI Studio</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Lưu API Key
              </button>

              {message && (
                <div className="alert alert-success">
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 