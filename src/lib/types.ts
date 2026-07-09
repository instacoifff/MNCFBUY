/**
 * Centralized TypeScript types for all MoncefBuy database entities.
 * Single source of truth for data shapes shared across server and client code.
 */

// ─── Database Entity Types ───────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  title: string
  slug: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  images: string[]
  is_featured: boolean
  created_at: string
}

/** Product with its joined category relation from Supabase */
export interface ProductWithCategory extends Product {
  category: { name: string } | null
}

/** Product row with the `categories` relation (as returned by admin queries) */
export interface ProductWithCategories extends Product {
  categories: { name: string } | null
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  zipCode: string
}

export interface Order {
  id: string
  user_id: string | null
  total_amount: number
  status: OrderStatus
  payment_method: string
  shipping_address: ShippingAddress
  contact_email: string
  contact_phone: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price_at_time: number
  created_at: string
}

/** Order item with joined product relation */
export interface OrderItemWithProduct extends OrderItem {
  product: { title: string } | null
}

/** Full order with items, as returned by the admin orders page */
export interface OrderWithItems extends Order {
  order_items: OrderItemWithProduct[]
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  product_id: string
  title: string
  price: number
  quantity: number
  image_url: string
  maxStock: number
}

export type CartItemInput = Omit<CartItem, 'id'>

// ─── Enum / Union Types ─────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

// ─── Server Action Return Types ─────────────────────────────────────────────

export interface ActionResult {
  error?: string
  success?: boolean
}

export interface CreateOrderResult extends ActionResult {
  orderId?: string
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface DashboardMetric {
  value: number
  growth: number
}

export interface DashboardMetrics {
  revenue: DashboardMetric
  orders: DashboardMetric
  aov: DashboardMetric
}

export interface StatusDataItem {
  name: string
  value: number
  color: string
}

export interface RankedItem {
  name: string
  sales: number
  percentage: number
}

export interface RecentOrder {
  id: string
  name: string
  total: number
  status: string
  date: string
}

export interface RevenueDataPoint {
  date: string
  revenue: number
}
