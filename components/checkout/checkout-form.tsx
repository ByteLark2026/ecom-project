'use client'

import { useActionState } from 'react'
import { placeOrder } from '@/lib/actions/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import type { Profile } from '@/types'

type State = { error?: string } | null

export function CheckoutForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState<State, FormData>(
    placeOrder as (state: State, payload: FormData) => Promise<State>,
    null
  )

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {state.error}
        </p>
      )}

      <div>
        <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shipping_name">Full name</Label>
            <Input id="shipping_name" name="shipping_name" defaultValue={profile?.full_name ?? ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_email">Email</Label>
            <Input id="shipping_email" name="shipping_email" type="email" defaultValue={profile?.email ?? ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_phone">Phone (optional)</Label>
            <Input id="shipping_phone" name="shipping_phone" type="tel" defaultValue={profile?.phone ?? ''} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipping_address">Street address</Label>
            <Input id="shipping_address" name="shipping_address" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipping_city">City</Label>
              <Input id="shipping_city" name="shipping_city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_state">State / Province</Label>
              <Input id="shipping_state" name="shipping_state" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_zip">ZIP / Postal code</Label>
              <Input id="shipping_zip" name="shipping_zip" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_country">Country</Label>
              <Input id="shipping_country" name="shipping_country" defaultValue="US" required />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="notes">Order notes (optional)</Label>
        <Textarea id="notes" name="notes" placeholder="Any special instructions…" rows={3} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? 'Placing order…' : 'Place Order'}
      </Button>
    </form>
  )
}
