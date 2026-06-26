import Image from 'next/image'
import background from '@/assets/Media/login/login-bg.webp'

export const LoginBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <Image className="object-cover" fill src={background} alt="Login background image" />
    </div>
  )
}
