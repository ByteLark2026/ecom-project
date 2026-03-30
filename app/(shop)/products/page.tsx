import { Suspense } from 'react'
import { getProducts } from '@/lib/queries/products'
import { getCategories } from '@/lib/queries/categories'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { Pagination } from '@/components/shared/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProductFilters as Filters } from '@/types'

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: Filters = {
    category: params.category,
    search: params.search,
    sort: params.sort as Filters['sort'],
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    page: params.page ? Number(params.page) : 1,
  }

  const [{ products, pages, page }, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="mb-6">
        <Suspense>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>
      <ProductGrid products={products} />
      <Suspense>
        <Pagination page={page} totalPages={pages} />
      </Suspense>
    </div>
  )
}

export function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  )
}
