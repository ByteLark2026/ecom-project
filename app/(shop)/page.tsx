import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/lib/queries/products'
import { getCategories } from '@/lib/queries/categories'
import { ProductGrid } from '@/components/products/product-grid'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ])

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Shop the Latest
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Discover our curated collection of premium products.
          </p>
          <Link href="/products" className={cn(buttonVariants({ size: 'lg' }))}>
            Browse All Products
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat: Category) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm bg-gradient-to-br from-muted to-muted/50">
                        {cat.name}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{cat.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className={cn(buttonVariants({ variant: 'outline' }))}>
              View all
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}
    </div>
  )
}
