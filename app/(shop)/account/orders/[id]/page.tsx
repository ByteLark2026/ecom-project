import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/constants'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Order, OrderItem } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

type OrderWithItems = Order & { order_items: OrderItem[] }

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawOrder } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  const { data: rawItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)

  if (!rawOrder) notFound()

  const order = rawOrder as unknown as OrderWithItems
  if (order.user_id !== user.id) notFound()

  const items = (rawItems ?? []) as unknown as OrderItem[]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/account/orders" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
          <ChevronLeft className="h-4 w-4 mr-1" />Back
        </Link>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
        <Badge className={ORDER_STATUS_COLORS[order.status]}>
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
              </div>
              <p className="font-medium">{formatPrice(item.total_price)}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{order.shipping_amount === 0 ? 'Free' : formatPrice(order.shipping_amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(order.tax_amount)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-muted-foreground">
          {order.shipping_name}<br />
          {order.shipping_address}<br />
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br />
          {order.shipping_country}
        </p>
      </div>
    </div>
  )
}
