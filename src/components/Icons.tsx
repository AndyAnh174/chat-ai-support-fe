import { lazy, Suspense } from 'react'

// Lazy load các icons
export const IconSend = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconSend 
})))

export const IconRobot = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconRobot 
})))

export const IconUser = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconUser 
})))

export const IconKey = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconKey 
})))

export const IconMessage = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconMessage 
})))

export const IconBrain = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconBrain 
})))

export const IconLock = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconLock 
})))

export const IconBrandGithub = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconBrandGithub 
})))

export const IconBrandFacebook = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconBrandFacebook 
})))

export const IconMail = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconMail 
})))

export const IconPencil = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconPencil 
})))

export const IconTrash = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconTrash 
})))

export const IconPlus = lazy(() => import('@tabler/icons-react').then(module => ({ 
  default: module.IconPlus 
})))

// Component wrapper để xử lý loading
interface IconProps {
  icon: React.LazyExoticComponent<React.ComponentType<any>>
  size?: number
  className?: string
}

export const Icon = ({ icon: IconComponent, size = 24, className = '' }: IconProps) => {
  return (
    <Suspense fallback={<div className="w-[24px] h-[24px]" />}>
      <IconComponent size={size} className={className} />
    </Suspense>
  )
} 