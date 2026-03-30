import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PriceDisplay } from '@/components/shared/price-display'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Sale
            </Badge>
          )}
          {product.stock_qty === 0 && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Out of stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
          <PriceDisplay price={product.price} comparePrice={product.compare_price} />
        </CardContent>
      </Card>
    </Link>
  )
}
