import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function getCartWithItems(userId: string) {
  const supabase = await createClient()
  const db = supabase as AnyClient

  const { data: cart } = await db
    .from('carts')
    .select('id, user_id, cart_items(id, cart_id, product_id, quantity, added_at, products(id, name, slug, price, compare_price, images, stock_qty, sku))')
    .eq('user_id', userId)
    .single()

  return cart
}

export async function getOrCreateCart(userId: string): Promise<string> {
  const supabase = await createClient()
  const db = supabase as AnyClient

  const { data: existing } = await db
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing?.id) return existing.id as string

  const { data: created, error } = await db
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single()

  if (error) throw new Error((error as { message: string }).message)
  return created.id as string
}
