import logo from '@/assets/Media/logo/eagle-icon.png'
import Image from 'next/image'

export default function AdminIcon() {
  return (
    <div>
      <Image className="object-cover" src={logo} alt="Login background image" loading={'eager'} />
    </div>
  )
}
