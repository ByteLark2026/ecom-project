import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { CartSummary } from '@/components/cart/cart-summary'
import type { CartItemWithProduct, Profile, Product } from '@/types'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/checkout')

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

  if (items.length === 0) redirect('/cart')

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = rawProfile as unknown as Profile | null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm profile={profile} />
        </div>
        <div>
          <CartSummary items={items} showCheckoutButton={false} />
        </div>
      </div>
    </div>
  )
}
