import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getOrdersByUser } from '@/lib/queries/orders'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/constants'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const orders = await getOrdersByUser(user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Your orders will appear here once you make a purchase." />
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <Badge className={ORDER_STATUS_COLORS[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                <Link href={`/account/orders/${order.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
