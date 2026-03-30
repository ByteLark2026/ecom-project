import { createClient } from '@/lib/supabase/server'

export async function getOrdersByUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id, user_id, status, subtotal, tax_amount, shipping_amount, total_amount, currency, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, notes, created_at, updated_at, order_items(id, product_id, product_name, product_sku, unit_price, quantity, total_price)')
    .eq('id', orderId)
    .single()

  if (error) return null
  return data
}

export async function getAllOrders() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
