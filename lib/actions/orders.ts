'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { OrderStatus } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAdmin = any

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const admin = createAdminClient() as AnyAdmin
  const { error } = await admin
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return { error: (error as { message: string }).message }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/account/orders')
}
