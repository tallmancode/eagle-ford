'use client'

type Props = {
  heading: string
}

export function StockArchiveHeader({ heading }: Props) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">{heading}</h2>
    </div>
  )
}
