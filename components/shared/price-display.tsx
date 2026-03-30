import { formatPrice } from '@/lib/utils/format'

interface PriceDisplayProps {
  price: number
  comparePrice?: number | null
  className?: string
}

export function PriceDisplay({ price, comparePrice, className }: PriceDisplayProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <span className="font-semibold">{formatPrice(price)}</span>
      {comparePrice && comparePrice > price && (
        <span className="text-muted-foreground line-through text-sm">{formatPrice(comparePrice)}</span>
      )}
    </div>
  )
}
