import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateOrderStatus } from '@/lib/actions/orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/constants'
import { ChevronLeft } from 'lucide-react'
import type { Order, OrderItem, OrderStatus } from '@/types'

type OrderWithItems = Order & { order_items: OrderItem[] }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: rawOrder } = await admin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  const { data: rawItems } = await admin
    .from('order_items')
    .select('*')
    .eq('order_id', id)

  if (!rawOrder) notFound()

  const order = rawOrder as unknown as OrderWithItems
  const items = (rawItems ?? []) as unknown as OrderItem[]
  const statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Link href="/admin/orders" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order #{(order.id as string).slice(0, 8).toUpperCase()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Badge className={ORDER_STATUS_COLORS[order.status]}>
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
        <form action={async (formData: FormData) => {
          'use server'
          const status = formData.get('status') as OrderStatus
          await updateOrderStatus(id, status)
        }} className="flex items-center gap-2">
          <Select name="status" defaultValue={order.status}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" size="sm" variant="outline">Update</Button>
        </form>
      </div>

      <p className="text-sm text-muted-foreground">Placed {formatDate(order.created_at)}</p>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">Customer</h2>
        <p className="text-sm">{order.shipping_name}</p>
        <p className="text-sm text-muted-foreground">{order.shipping_email}</p>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Shipping Address</h2>
        <p className="text-sm text-muted-foreground">
          {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}, {order.shipping_country}
        </p>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
              </div>
              <p>{formatPrice(item.total_price)}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping_amount === 0 ? 'Free' : formatPrice(order.shipping_amount)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(order.tax_amount)}</span></div>
        <Separator />
        <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(order.total_amount)}</span></div>
      </div>
    </div>
  )
}
