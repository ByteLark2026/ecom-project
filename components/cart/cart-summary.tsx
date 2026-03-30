import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils/format'
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/utils/constants'
import { cn } from '@/lib/utils'
import type { CartItemWithProduct } from '@/types'

interface CartSummaryProps {
  items: CartItemWithProduct[]
  showCheckoutButton?: boolean
}

export function CartSummary({ items, showCheckoutButton = true }: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.products.price * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  return (
    <div className="bg-muted/40 rounded-lg p-6 space-y-4">
      <h2 className="font-semibold text-lg">Order Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="text-xs text-muted-foreground">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
        </p>
      )}
      {showCheckoutButton && (
        <Link href="/checkout" className={cn(buttonVariants({ size: 'lg' }), 'w-full text-center')}>
          Proceed to Checkout
        </Link>
      )}
    </div>
  )
}
