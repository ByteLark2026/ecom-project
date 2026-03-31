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
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #CA8A04 0%, transparent 50%), radial-gradient(circle at 80% 20%, #CA8A04 0%, transparent 40%)',
          }}
        />
        <div className="container mx-auto px-6 py-28 md:py-40 relative z-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em]">
              New Season Arrivals
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Crafted for<br />the Discerning.
            </h1>
            <p className="text-background/60 text-lg md:text-xl max-w-xl leading-relaxed">
              Discover premium products curated for quality, style, and lasting value.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: 'lg' }), 'bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12 text-base font-semibold')}
              >
                Shop Collection
              </Link>
              <Link
                href="/categories"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-background/20 text-background hover:bg-background/10 px-8 h-12 text-base')}
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: 'Free Shipping', sub: 'On orders over $50' },
              { label: 'Easy Returns', sub: '30-day hassle-free' },
              { label: 'Secure Checkout', sub: 'SSL encrypted' },
              { label: 'Premium Quality', sub: 'Curated selection' },
            ].map((item) => (
              <div key={item.label} className="py-5 px-6 text-center">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-2">Collections</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
            </div>
            <Link href="/categories" className="text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors hidden md:block">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat: Category) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
                <div className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-3">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/60 flex items-end p-4">
                      <span className="text-muted-foreground text-sm font-medium">{cat.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                </div>
                <p className="font-semibold text-sm group-hover:text-accent transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-secondary/40 py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-2">Handpicked</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Products</h2>
              </div>
              <Link href="/products" className={cn(buttonVariants({ variant: 'outline' }), 'hidden md:flex')}>
                View all products
              </Link>
            </div>
            <ProductGrid products={featured} />
            <div className="mt-10 text-center md:hidden">
              <Link href="/products" className={cn(buttonVariants({ variant: 'outline' }))}>
                View all products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-foreground rounded-2xl px-8 py-14 md:px-16 text-center text-background space-y-5">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest">Members Only</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Get 10% Off Your First Order</h2>
          <p className="text-background/60 text-lg max-w-md mx-auto">
            Create an account and unlock exclusive deals, early access to new arrivals, and more.
          </p>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'lg' }), 'bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-12 text-base font-semibold')}
          >
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  )
}
