'use client'

import { useTransition } from 'react'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { addToCart } from '@/lib/actions/cart'
import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  productId: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ productId, disabled, className }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleAdd = () => {
    startTransition(async () => {
      await addToCart(productId)
      toast.success('Added to cart')
    })
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || isPending}
      className={className}
      size="lg"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isPending ? 'Adding…' : 'Add to cart'}
    </Button>
  )
}
