import { createClient } from '@/lib/supabase/server'
import { getOrdersByUser } from '@/lib/queries/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/format'
import type { Profile } from '@/types'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: rawProfile }, orders] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    getOrdersByUser(user.id),
  ])

  const profile = rawProfile as unknown as Profile | null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Account</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{profile?.full_name ?? 'No name set'}</p>
            <p className="text-muted-foreground">{user.email}</p>
            {profile?.phone && <p className="text-muted-foreground">{profile.phone}</p>}
            <p className="text-muted-foreground text-xs mt-2">
              Member since {formatDate(user.created_at)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-3xl font-bold">{orders.length}</p>
            <p className="text-muted-foreground">total orders placed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
