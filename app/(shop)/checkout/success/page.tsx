import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center space-y-6">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
      <h1 className="text-3xl font-bold">Order Placed!</h1>
      <p className="text-muted-foreground">
        Thank you for your order. We&apos;ll send you a confirmation email shortly.
      </p>
      {order && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm font-medium break-all">{order}</p>
          </CardContent>
        </Card>
      )}
      <div className="flex gap-3 justify-center">
        <Link href="/account/orders" className={cn(buttonVariants({ variant: 'outline' }))}>
          View Orders
        </Link>
        <Link href="/products" className={cn(buttonVariants())}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
