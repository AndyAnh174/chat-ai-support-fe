import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUsers, createUser, updateUser, deleteUser, updateApiKey, getUserApiKey } from '../services/userService'
import { Icon, IconPlus, IconPencil, IconTrash, IconKey, IconMessage } from '../components/Icons'

interface User {
  username: string
  display_name: string
  role: string
  avatar: string
  gemini_key?: string
  system_prompt?: string
}

interface CreateUserForm {
  username: string
  password: string
  display_name: string
  role: 'admin' | 'user'
}

const Admin = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    username: '',
    password: '',
    display_name: '',
    role: 'user'
  })
  const [editForm, setEditForm] = useState({
    display_name: '',
    role: 'user' as 'admin' | 'user',
    password: ''
  })
  const [apiKeyForm, setApiKeyForm] = useState({
    gemini_key: ''
  })
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({})
  const [promptForm, setPromptForm] = useState({
    system_prompt: ''
  })

  const fetchUsers = async () => {
    if (!token) return
    try {
      const data = await getUsers(token)
      setUsers(data)
      
      const keys: {[key: string]: string} = {}
      for (const user of data) {
        try {
          const apiKey = await getUserApiKey(token)
          keys[user.username] = apiKey.gemini_key
        } catch (err) {
          keys[user.username] = ''
        }
      }
      setApiKeys(keys)
    } catch (err) {
      setError('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      await createUser(token, createForm)
      await fetchUsers()
      setShowCreateModal(false)
      setCreateForm({ username: '', password: '', display_name: '', role: 'user' })
    } catch (err) {
      setError('Không thể tạo người dùng')
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedUser) return

    try {
      await updateUser(token, selectedUser.username, editForm)
      await fetchUsers()
      setShowEditModal(false)
    } catch (err) {
      setError('Không thể cập nhật người dùng')
    }
  }

  const handleUpdateApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedUser) return

    try {
      await updateUserApiKey(token, selectedUser.username, apiKeyForm.gemini_key)
      await fetchUsers()
      setShowApiKeyModal(false)
    } catch (err) {
      setError('Không thể cập nhật API key')
    }
  }

  const handleUpdatePrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedUser) return

    try {
      await updateUserPrompt(token, promptForm.system_prompt)
      await fetchUsers()
      setShowPromptModal(false)
    } catch (err) {
      setError('Không thể cập nhật System Prompt')
    }
  }

  const handleDeleteUser = async (username: string) => {
    if (!token) return
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return

    try {
      await deleteUser(token, username)
      await fetchUsers()
    } catch (err) {
      setError('Không thể xóa người dùng')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl">Quản lý người dùng</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Icon icon={IconPlus} size={20} />
                Thêm người dùng
              </button>
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
                <button className="btn btn-ghost btn-xs" onClick={() => setError('')}>×</button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Tên hiển thị</th>
                    <th>Vai trò</th>
                    <th>API Key</th>
                    <th>Prompt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.display_name}</td>
                      <td>
                        <div className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </div>
                      </td>
                      <td>
                        {apiKeys[user.username] ? (
                          <div className="badge badge-success">Đã cài đặt</div>
                        ) : (
                          <div className="badge badge-ghost">Chưa cài đặt</div>
                        )}
                      </td>
                      <td>
                        {user.system_prompt ? (
                          <div className="badge badge-success">Đã cài đặt</div>
                        ) : (
                          <div className="badge badge-ghost">Chưa cài đặt</div>
                        )}
                      </td>
                      <td className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setEditForm({
                              display_name: user.display_name,
                              role: user.role as 'admin' | 'user',
                              password: ''
                            })
                            setShowEditModal(true)
                          }}
                        >
                          <Icon icon={IconPencil} size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setApiKeyForm({ gemini_key: apiKeys[user.username] || '' })
                            setShowApiKeyModal(true)
                          }}
                        >
                          <Icon icon={IconKey} size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setPromptForm({ system_prompt: user.system_prompt || '' })
                            setShowPromptModal(true)
                          }}
                        >
                          <Icon icon={IconMessage} size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          <Icon icon={IconTrash} size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal tạo user mới */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Thêm người dùng mới</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Tên hiển thị</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={createForm.display_name}
                  onChange={(e) => setCreateForm({...createForm, display_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Mật khẩu</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Vai trò</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({...createForm, role: e.target.value as 'admin' | 'user'})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Tạo</button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa user */}
      {showEditModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Chỉnh sửa người dùng</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Tên hiển thị</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Vai trò</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Mật khẩu mới (để trống nếu không đổi)</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal cập nhật API key */}
      {showApiKeyModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Cập nhật API Key</h3>
            <form onSubmit={handleUpdateApiKey}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Gemini API Key</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={apiKeyForm.gemini_key}
                  onChange={(e) => setApiKeyForm({...apiKeyForm, gemini_key: e.target.value})}
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setShowApiKeyModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal cập nhật Prompt */}
      {showPromptModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Cập nhật System Prompt cho {selectedUser.display_name}
            </h3>
            <form onSubmit={handleUpdatePrompt}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">System Prompt</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={promptForm.system_prompt}
                  onChange={(e) => setPromptForm({...promptForm, system_prompt: e.target.value})}
                  placeholder="Nhập system prompt cho chat"
                />
                <label className="label">
                  <span className="label-text-alt text-info">
                    Prompt này sẽ định hướng cách AI trả lời các câu hỏi
                  </span>
                </label>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setShowPromptModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin 