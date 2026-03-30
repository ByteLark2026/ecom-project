import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/account')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        <aside>
          <nav className="space-y-1">
            {[
              { href: '/account', label: 'Overview' },
              { href: '/account/orders', label: 'Orders' },
              { href: '/account/settings', label: 'Settings' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
