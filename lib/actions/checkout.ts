'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clearCart } from '@/lib/actions/cart'
import { checkoutSchema } from '@/lib/validations/checkout'
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/utils/constants'
import type { CartItemWithProduct, Product } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function placeOrder(_state: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = checkoutSchema.safeParse({
    shipping_name: formData.get('shipping_name'),
    shipping_email: formData.get('shipping_email'),
    shipping_phone: formData.get('shipping_phone') || undefined,
    shipping_address: formData.get('shipping_address'),
    shipping_city: formData.get('shipping_city'),
    shipping_state: formData.get('shipping_state'),
    shipping_zip: formData.get('shipping_zip'),
    shipping_country: formData.get('shipping_country') || 'US',
    notes: formData.get('notes') || undefined,
  })

  if (!parsed.success) {
    const issues = parsed.error.issues
    return { error: issues[0]?.message ?? 'Validation error' }
  }

  const db = supabase as AnyClient

  const { data: rawCart } = await db
    .from('carts')
    .select('id, cart_items(id, cart_id, product_id, quantity, added_at, products(id, name, slug, price, compare_price, images, stock_qty, sku))')
    .eq('user_id', user.id)
    .single()

  const items: CartItemWithProduct[] = ((rawCart?.cart_items ?? []) as CartItemWithProduct[]).map((item) => ({
    ...item,
    products: item.products as unknown as Product,
  }))

  if (items.length === 0) return { error: 'Your cart is empty.' }

  const subtotal = items.reduce((sum, item) => sum + item.products.price * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({ user_id: user.id, subtotal, tax_amount: tax, shipping_amount: shipping, total_amount: total, ...parsed.data })
    .select('id')
    .single()

  if (orderError || !order) return { error: 'Failed to create order. Please try again.' }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.products.name,
    product_sku: item.products.sku,
    unit_price: item.products.price,
    quantity: item.quantity,
    total_price: item.products.price * item.quantity,
  }))

  const { error: itemsError } = await db.from('order_items').insert(orderItems)
  if (itemsError) return { error: 'Failed to save order items.' }

  if (rawCart?.id) await clearCart(rawCart.id)

  redirect(`/checkout/success?order=${order.id}`)
}
