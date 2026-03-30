import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/queries/categories'
import { getProducts } from '@/lib/queries/products'
import { ProductGrid } from '@/components/products/product-grid'
import { Pagination } from '@/components/shared/pagination'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string>>
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams
  const page = sp.page ? Number(sp.page) : 1

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const { products, pages } = await getProducts({ category: slug, page })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mb-6">{category.description}</p>
      )}
      <ProductGrid products={products} />
      <Suspense>
        <Pagination page={page} totalPages={pages} />
      </Suspense>
    </div>
  )
}
