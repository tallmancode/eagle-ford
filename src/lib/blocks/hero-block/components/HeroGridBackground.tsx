const gridBackgroundClassName =
  'opacity-20 absolute -top-[40rem] left-1/2 -translate-x-1/2 rounded-full bg-[image:linear-gradient(to_right,_#e2e8f0_1px,_transparent_1px),_linear-gradient(to_bottom,_#e2e8f0_1px,_transparent_1px)] bg-[length:70px_70px] [mask-image:radial-gradient(circle,#000_10%,transparent_70%)]'

type HeroGridBackgroundProps = {
  className?: string
}

export const HeroGridBackground: React.FC<HeroGridBackgroundProps> = ({ className }) => (
  <div
    aria-hidden="true"
    className={`h-[80rem] w-[80rem] ${gridBackgroundClassName} ${className ?? ''}`}
  />
)
