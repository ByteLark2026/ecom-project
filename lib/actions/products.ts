'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils/format'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAdmin = any

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rawProfile } = await (supabase as AnyAdmin)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((rawProfile as { role: string } | null)?.role !== 'admin') redirect('/')
}

export async function createProduct(formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient() as AnyAdmin

  const name = formData.get('name') as string
  const images = (formData.get('images') as string || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const { error } = await admin.from('products').insert({
    name,
    slug: slugify(name),
    description: (formData.get('description') as string) || null,
    price: Number(formData.get('price')),
    compare_price: formData.get('compare_price') ? Number(formData.get('compare_price')) : null,
    sku: (formData.get('sku') as string) || null,
    stock_qty: Number(formData.get('stock_qty')) || 0,
    category_id: (formData.get('category_id') as string) || null,
    is_published: formData.get('is_published') === 'true',
    is_featured: formData.get('is_featured') === 'true',
    images,
  })

  if (error) return { error: (error as { message: string }).message }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient() as AnyAdmin

  const name = formData.get('name') as string
  const images = (formData.get('images') as string || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const { error } = await admin.from('products').update({
    name,
    slug: slugify(name),
    description: (formData.get('description') as string) || null,
    price: Number(formData.get('price')),
    compare_price: formData.get('compare_price') ? Number(formData.get('compare_price')) : null,
    sku: (formData.get('sku') as string) || null,
    stock_qty: Number(formData.get('stock_qty')) || 0,
    category_id: (formData.get('category_id') as string) || null,
    is_published: formData.get('is_published') === 'true',
    is_featured: formData.get('is_featured') === 'true',
    images,
  }).eq('id', id)

  if (error) return { error: (error as { message: string }).message }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  await assertAdmin()
  const admin = createAdminClient() as AnyAdmin
  await admin.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

export async function togglePublished(id: string, currentValue: boolean) {
  await assertAdmin()
  const admin = createAdminClient() as AnyAdmin
  await admin.from('products').update({ is_published: !currentValue }).eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/products')
}
