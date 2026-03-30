import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Cart = Database['public']['Tables']['carts']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export type OrderStatus = Database['public']['Enums']['order_status']
export type UserRole = Database['public']['Enums']['user_role']

// Composed types for joined queries
export type CartItemWithProduct = CartItem & {
  products: Product
}

export type CartWithItems = Cart & {
  cart_items: CartItemWithProduct[]
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Product | null })[]
}

export type ProductWithCategory = Product & {
  categories: Category | null
}

// Filter types
export type ProductFilters = {
  category?: string
  min_price?: number
  max_price?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name_asc'
  search?: string
  page?: number
  featured?: boolean
}
