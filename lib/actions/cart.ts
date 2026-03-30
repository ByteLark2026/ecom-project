'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateCart } from '@/lib/queries/cart'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function addToCart(productId: string, quantity = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const cartId = await getOrCreateCart(user.id)
  const db = supabase as AnyClient

  const { data: existing } = await db
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await db
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
  } else {
    await db
      .from('cart_items')
      .insert({ cart_id: cartId, product_id: productId, quantity })
  }

  revalidatePath('/', 'layout')
  revalidatePath('/cart')
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const db = supabase as AnyClient
  await db.from('cart_items').delete().eq('id', cartItemId)

  revalidatePath('/', 'layout')
  revalidatePath('/cart')
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const db = supabase as AnyClient
  if (quantity <= 0) {
    await db.from('cart_items').delete().eq('id', cartItemId)
  } else {
    await db.from('cart_items').update({ quantity }).eq('id', cartItemId)
  }

  revalidatePath('/', 'layout')
  revalidatePath('/cart')
}

export async function clearCart(cartId: string) {
  const supabase = await createClient()
  const db = supabase as AnyClient
  await db.from('cart_items').delete().eq('cart_id', cartId)
  revalidatePath('/', 'layout')
  revalidatePath('/cart')
}
