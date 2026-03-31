import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/lib/queries/products'
import { getCategories } from '@/lib/queries/categories'
import { ProductGrid } from '@/components/products/product-grid'
import { buttonVariants } from '@/components/ui/button-variants'
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
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a6b26 0%, #2db83d 60%, #5dd46b 100%)' }}
      >
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center justify-between gap-8">
            <div className="max-w-xl space-y-6 text-white">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Fresh &amp; Natural Groceries
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Get the Best Deals on Premium Grocery Products
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-white text-primary hover:bg-white/90 font-semibold px-8'
                  )}
                >
                  Shop Now
                </Link>
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white text-white hover:bg-white/10 px-8'
                  )}
                >
                  View Categories
                </Link>
              </div>
            </div>
            {/* Decorative element */}
            <div className="hidden md:flex flex-shrink-0 w-64 h-64 rounded-full bg-white/20 items-center justify-center text-8xl select-none">
              🛒
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: 'Free Shipping', sub: 'On orders over $50' },
              { label: 'Easy Returns', sub: '30-day hassle-free' },
              { label: 'Secure Checkout', sub: 'SSL encrypted' },
              { label: 'Fresh Products', sub: 'Quality guaranteed' },
            ].map((item) => (
              <div key={item.label} className="py-5 px-6 text-center">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-border rounded-md hover:border-primary hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  {cat.image_url ? (
                    <Image src={cat.image_url} alt={cat.name} width={32} height={32} className="object-contain" />
                  ) : (
                    <span className="text-xl">🥦</span>
                  )}
                </div>
                <span className="text-xs font-medium text-center group-hover:text-primary transition-colors line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 bg-muted border border-border rounded-md"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      <section className="bg-secondary/40 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Best Sellers</h2>
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: 'outline' }), 'text-primary border-primary hover:bg-primary hover:text-white')}
            >
              View All
            </Link>
          </div>
          {featured.length > 0 ? (
            <ProductGrid products={featured} />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg mb-2">No products yet</p>
              <p className="text-sm">Add products via the <Link href="/admin" className="text-primary underline">admin panel</Link> to see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promo banners */}
      <section className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: green */}
          <div
            className="rounded-md p-8 flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #1a6b26 0%, #2db83d 100%)' }}
          >
            <p className="text-white/80 text-sm mb-1">Weekend Deal</p>
            <h3 className="text-white text-2xl font-bold mb-1">Fresh Vegetables</h3>
            <p className="text-white/90 text-lg mb-4">Up to 30% off</p>
            <Link
              href="/products?category=vegetables"
              className="inline-flex items-center bg-white text-primary font-semibold text-sm px-5 py-2 rounded-md hover:bg-white/90 transition-colors w-fit"
            >
              Shop Now
            </Link>
          </div>
          {/* Right: amber */}
          <div
            className="rounded-md p-8 flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)' }}
          >
            <p className="text-white/80 text-sm mb-1">New Arrivals</p>
            <h3 className="text-white text-2xl font-bold mb-1">Dairy Products</h3>
            <p className="text-white/90 text-lg mb-4">Fresh &amp; Organic</p>
            <Link
              href="/products?category=dairy"
              className="inline-flex items-center bg-white text-amber-700 font-semibold text-sm px-5 py-2 rounded-md hover:bg-white/90 transition-colors w-fit"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #1a6b26 0%, #2db83d 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-white text-3xl font-bold mb-2">Subscribe to our Newsletter</h2>
          <p className="text-white/80 mb-6">Get the latest deals and fresh arrivals straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" action="/newsletter" method="POST">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2.5 rounded-md text-sm bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  )
}
