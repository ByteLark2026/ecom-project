import { createAdminClient } from '@/lib/supabase/admin'
import { createProduct } from '@/lib/actions/products'
import { ProductForm } from '@/components/products/product-form'

export default async function NewProductPage() {
  const admin = createAdminClient()
  const { data: categories } = await admin.from('categories').select('*').order('name')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Product</h1>
      <ProductForm categories={categories ?? []} action={createProduct} />
    </div>
  )
}
