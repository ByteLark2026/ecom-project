import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteProduct, togglePublished } from '@/lib/actions/products'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/lib/utils/format'
import { Plus, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

export default async function AdminProductsPage() {
  const admin = createAdminClient()
  const { data: rawProducts } = await admin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const products = (rawProducts ?? []) as unknown as Product[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4 mr-2" />New Product
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.stock_qty}</TableCell>
              <TableCell>
                <form action={async () => {
                  'use server'
                  await togglePublished(product.id, product.is_published)
                }}>
                  <button type="submit">
                    <Badge variant={product.is_published ? 'default' : 'secondary'}>
                      {product.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </button>
                </form>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/products/${product.id}`} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={async () => {
                    'use server'
                    await deleteProduct(product.id)
                  }}>
                    <button type="submit" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-destructive hover:text-destructive')}>
                      ×
                    </button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
