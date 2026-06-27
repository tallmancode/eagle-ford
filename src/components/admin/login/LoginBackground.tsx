import Image from 'next/image'
import background_1 from '@/assets/Media/login/login-bg-1.webp'
import background_2 from '@/assets/Media/login/login-bg-2.webp'
import background_3 from '@/assets/Media/login/login-bg-3.webp'
import background_4 from '@/assets/Media/login/login-bg-4.webp'

const LOGIN_BG_IMAGES = [background_1, background_2, background_3, background_4]
const bgImage = LOGIN_BG_IMAGES[Math.floor(Math.random() * LOGIN_BG_IMAGES.length)]

export const LoginBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <Image
        className="object-cover object-center"
        fill
        src={bgImage}
        alt="Login background image"
        placeholder="blur"
      />
    </div>
  )
}
