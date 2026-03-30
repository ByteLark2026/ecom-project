import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'

export default async function AdminDashboard() {
  const admin = createAdminClient()

  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: rawRevenue },
  ] = await Promise.all([
    admin.from('products').select('*', { count: 'exact', head: true }),
    admin.from('orders').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('orders').select('total_amount').neq('status', 'cancelled'),
  ])

  const revenue = rawRevenue as unknown as { total_amount: number }[] | null
  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total_amount, 0) ?? 0

  const stats = [
    { label: 'Total Products', value: productCount ?? 0, icon: Package },
    { label: 'Total Orders', value: orderCount ?? 0, icon: ShoppingBag },
    { label: 'Total Customers', value: userCount ?? 0, icon: Users },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
