import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'

export default async function AdminOrdersPage() {
  const admin = createAdminClient()
  const { data: rawOrders } = await admin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const orders = (rawOrders ?? []) as unknown as Order[]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</TableCell>
              <TableCell className="text-sm">
                <p className="text-muted-foreground text-xs">{order.shipping_email}</p>
              </TableCell>
              <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
              <TableCell>{formatPrice(order.total_amount)}</TableCell>
              <TableCell>
                <Badge className={ORDER_STATUS_COLORS[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/orders/${order.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
