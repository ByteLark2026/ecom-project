'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type State = { error?: string; success?: string } | null

export default function SettingsPage() {
  const [state, action, pending] = useActionState<State, FormData>(
    updateProfile as (state: State, payload: FormData) => Promise<State>,
    null
  )

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action={action} className="space-y-4">
        {state?.error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">{state.success}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  )
}
