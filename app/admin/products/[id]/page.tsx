import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateProduct } from '@/lib/actions/products'
import { ProductForm } from '@/components/products/product-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const admin = createAdminClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    admin.from('products').select('*').eq('id', id).single(),
    admin.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  const action = async (formData: FormData) => {
    'use server'
    return updateProduct(id, formData)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm product={product} categories={categories ?? []} action={action} />
    </div>
  )
}
