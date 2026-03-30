import { createClient } from '@/lib/supabase/server'
import type { Product, ProductFilters } from '@/types'
import { ITEMS_PER_PAGE } from '@/lib/utils/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = await createClient()
  const { category, min_price, max_price, sort, search, page = 1 } = filters

  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug)', { count: 'exact' })
    .eq('is_published', true)

  if (category) {
    const { data: catRaw } = await (supabase as AnyClient)
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    const cat = catRaw as { id: string } | null
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (min_price !== undefined) query = query.gte('price', min_price)
  if (max_price !== undefined) query = query.lte('price', max_price)

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'name_asc':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    products: (data ?? []) as Product[],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    page,
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, compare_price, cost_price, sku, stock_qty, category_id, is_published, is_featured, weight_grams, images, tags, metadata, created_at, updated_at, categories(id, name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data as Product
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price, compare_price, sku, stock_qty, category_id, is_published, is_featured, images, tags, created_at, updated_at, categories(id, name, slug)')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
