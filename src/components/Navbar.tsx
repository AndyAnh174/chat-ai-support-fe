import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Icon, IconUser } from './Icons'

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <nav className="bg-base-100 shadow-lg">
      <div className="navbar max-w-7xl mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">AI Chat Support</Link>
        </div>
        <div className="flex-none gap-4">
          <Link to="/" className="btn btn-ghost">Trang chủ</Link>
          <Link to="/chat" className="btn btn-ghost">Chat AI</Link>
          <Link to="/about" className="btn btn-ghost">Giới thiệu</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-ghost">
                  Quản lý
                </Link>
              )}
              <Link to="/profile" className="btn btn-ghost">
                <Icon icon={IconUser} size={20} />
                Hồ sơ
              </Link>
              <button onClick={logout} className="btn btn-error">
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 