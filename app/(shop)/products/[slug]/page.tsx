import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PriceDisplay } from '@/components/shared/price-display'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import type { Product, Category } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

type ProductWithCategory = Product & { categories: Category | null }

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawProduct } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!rawProduct) notFound()

  const product = rawProduct as unknown as ProductWithCategory
  const category = product.categories

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square bg-muted rounded overflow-hidden">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" sizes="10vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {category && (
            <Link href={`/categories/${category.slug}`} className="text-sm text-muted-foreground hover:text-foreground">
              {category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <PriceDisplay price={product.price} comparePrice={product.compare_price} className="text-xl" />

          {product.stock_qty === 0 ? (
            <Badge variant="secondary">Out of stock</Badge>
          ) : (
            <p className="text-sm text-green-600">In stock ({product.stock_qty} available)</p>
          )}

          {product.description && (
            <>
              <Separator />
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </>
          )}

          <AddToCartButton productId={product.id} disabled={product.stock_qty === 0} />

          {product.sku && (
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          )}
        </div>
      </div>
    </div>
  )
}
