import { Icon, IconBrandGithub, IconBrandFacebook, IconMail } from './Icons'

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-300 text-base-content">
      <div>
        <div className="grid grid-flow-col gap-4">
          <a 
            href="https://github.com/andyanh174" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <Icon icon={IconBrandGithub} size={24} />
          </a>
          <a 
            href="https://facebook.com/hovietanh174" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <Icon icon={IconBrandFacebook} size={24} />
          </a>
          <a 
            href="mailto:hovietanh174@gmail.com"
            className="btn btn-ghost btn-circle"
          >
            <Icon icon={IconMail} size={24} />
          </a>
        </div>
      </div> 
      <div>
        <p>Copyright © {new Date().getFullYear()} - Developed by Hồ Việt Anh</p>
        <p className="text-sm opacity-70">Powered by Google Gemini</p>
      </div>
    </footer>
  )
}

export default Footer 