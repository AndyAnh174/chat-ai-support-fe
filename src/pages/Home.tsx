import { Link } from 'react-router-dom'
import { Icon, IconMessage, IconBrain, IconRobot, IconLock } from '../components/Icons'

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse gap-8">
          <div className="max-w-sm lg:max-w-xl">
            <img src="/robot-chat.svg" className="w-full" alt="AI Chat" />
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">AI Chat Support</h1>
            <p className="py-6 text-lg">
              Trải nghiệm cuộc trò chuyện thông minh với AI Assistant được hỗ trợ bởi công nghệ 
              Google Gemini - Mô hình AI tiên tiến nhất hiện nay.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link to="/chat" className="btn btn-primary">
                <Icon icon={IconMessage} size={20} />
                Bắt đầu chat
              </Link>
              <Link to="/about" className="btn btn-ghost">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <Icon icon={IconBrain} size={48} className="text-primary mb-4" />
                <h3 className="card-title">Trí tuệ nhân tạo</h3>
                <p>Được hỗ trợ bởi Google Gemini - Mô hình ngôn ngữ lớn tiên tiến nhất</p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <Icon icon={IconRobot} size={48} className="text-primary mb-4" />
                <h3 className="card-title">Hỗ trợ thông minh</h3>
                <p>Trả lời nhanh chóng, chính xác và phù hợp với ngữ cảnh</p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <Icon icon={IconLock} size={48} className="text-primary mb-4" />
                <h3 className="card-title">Bảo mật & Riêng tư</h3>
                <p>Bảo vệ thông tin và dữ liệu của bạn một cách an toàn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-content py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng trải nghiệm?</h2>
          <p className="mb-8 text-lg">
            Bắt đầu cuộc trò chuyện với AI Assistant của chúng tôi ngay hôm nay
          </p>
          <Link to="/chat" className="btn btn-secondary btn-lg">
            <Icon icon={IconMessage} size={20} />
            Bắt đầu ngay
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home 