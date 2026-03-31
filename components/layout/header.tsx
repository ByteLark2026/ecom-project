import Link from 'next/link'
import { ShoppingCart, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'
import { buttonVariants } from '@/components/ui/button-variants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { HeaderSearch } from './header-search'
import type { Profile } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: Pick<Profile, 'full_name' | 'avatar_url' | 'role'> | null = null
  let cartCount = 0

  if (user) {
    const { data: rawProfile } = await (supabase as AnyClient)
      .from('profiles')
      .select('full_name, avatar_url, role')
      .eq('id', user.id)
      .single()
    profile = rawProfile as typeof profile

    const { data: rawCart } = await supabase
      .from('carts')
      .select('cart_items(quantity)')
      .eq('user_id', user.id)
      .single()
    const cart = rawCart as unknown as { cart_items: { quantity: number }[] } | null
    cartCount = cart?.cart_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  }

  const fullName = (profile as { full_name?: string | null } | null)?.full_name
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span>Free Shipping for all orders over $50</span>
          <div className="flex items-center gap-4">
            <Link href="/orders" className="hover:underline">Track Order</Link>
            {user ? null : (
              <>
                <Link href="/login" className="hover:underline">Login</Link>
                <Link href="/signup" className="hover:underline">Register</Link>
              </>
            )}
            {user && (
              <Link href="/account" className="hover:underline">My Account</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b py-3">
        <div className="container mx-auto px-4 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary flex-shrink-0">
            ShopNext
          </Link>

          {/* Search bar */}
          <div className="flex-1 flex justify-center">
            <HeaderSearch />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/cart" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full')}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(profile as { avatar_url?: string | null } | null)?.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/account" className="w-full">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account/orders" className="w-full">Orders</Link>
                  </DropdownMenuItem>
                  {(profile as { role?: string } | null)?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/admin" className="w-full">Admin Panel</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <form action={signOut} className="w-full">
                      <button type="submit" className="w-full text-left cursor-pointer">
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 flex items-center gap-6">
          <Link
            href="/products"
            className="bg-primary text-primary-foreground text-sm font-medium px-4 py-3 hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            All Categories
          </Link>
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            <Link href="/" className="px-3 py-3 text-foreground hover:text-primary transition-colors whitespace-nowrap">
              Home
            </Link>
            <Link href="/products" className="px-3 py-3 text-foreground hover:text-primary transition-colors whitespace-nowrap">
              Products
            </Link>
            <Link href="/about" className="px-3 py-3 text-foreground hover:text-primary transition-colors whitespace-nowrap">
              About
            </Link>
            <Link href="/contact" className="px-3 py-3 text-foreground hover:text-primary transition-colors whitespace-nowrap">
              Contact
            </Link>
            <Link href="/products?sale=true" className="px-3 py-3 text-destructive hover:text-destructive/80 transition-colors font-medium whitespace-nowrap">
              Sale
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
