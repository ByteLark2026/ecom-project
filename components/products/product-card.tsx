import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]

  return (
    <div className="relative bg-white rounded-md border border-border hover:shadow-md transition-all group">
      {/* Image area */}
      <div className="relative aspect-square p-4 overflow-hidden bg-white">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        {/* Sale badge */}
        {product.compare_price && product.compare_price > product.price && (
          <span className="absolute top-2 left-2 bg-destructive text-white text-xs px-2 py-1 rounded font-medium">
            Sale
          </span>
        )}
        {/* Out of stock badge */}
        {product.stock_qty === 0 && (
          <span className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 border-t">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold text-base">{formatPrice(product.price)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-muted-foreground line-through text-sm">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        {/* Add to cart */}
        <AddToCartButton
          productId={product.id}
          disabled={product.stock_qty === 0}
          className="w-full"
        />
      </div>
    </div>
  )
}
