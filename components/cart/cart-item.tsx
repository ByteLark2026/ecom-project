'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { removeFromCart, updateCartItemQuantity } from '@/lib/actions/cart'
import { formatPrice } from '@/lib/utils/format'
import type { CartItemWithProduct } from '@/types'

interface CartItemProps {
  item: CartItemWithProduct
}

export function CartItemRow({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition()
  const product = item.products

  const update = (qty: number) => {
    startTransition(() => updateCartItemQuantity(item.id, qty))
  }

  const remove = () => {
    startTransition(() => removeFromCart(item.id))
  }

  return (
    <div className={`flex gap-4 py-4 ${isPending ? 'opacity-50' : ''}`}>
      <div className="relative h-20 w-20 flex-shrink-0 bg-muted rounded overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">No image</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`} className="font-medium hover:underline line-clamp-2 text-sm">
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{formatPrice(product.price)} each</p>

        <div className="flex items-center gap-2 mt-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => update(item.quantity - 1)} disabled={isPending}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => update(item.quantity + 1)} disabled={isPending}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 ml-2 text-destructive hover:text-destructive" onClick={remove} disabled={isPending}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">{formatPrice(product.price * item.quantity)}</p>
      </div>
    </div>
  )
}
