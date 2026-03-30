import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CartItemRow } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CartItemWithProduct, Product } from '@/types'

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Sign in to view your cart or start shopping.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }))}>Sign in</Link>
          <Link href="/products" className={cn(buttonVariants())}>Shop now</Link>
        </div>
      </div>
    )
  }

  const { data: rawCart } = await supabase
    .from('carts')
    .select('id, cart_items(id, cart_id, product_id, quantity, added_at, products(id, name, slug, price, compare_price, images, stock_qty, sku))')
    .eq('user_id', user.id)
    .single()

  const cart = rawCart as unknown as { id: string; cart_items: CartItemWithProduct[] } | null
  const items: CartItemWithProduct[] = (cart?.cart_items ?? []).map((item) => ({
    ...item,
    products: item.products as unknown as Product,
  }))

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className={cn(buttonVariants())}>Start shopping</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="divide-y">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
          <Separator className="my-4" />
          <Link href="/products" className={cn(buttonVariants({ variant: 'outline' }))}>
            Continue Shopping
          </Link>
        </div>
        <div>
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  )
}
