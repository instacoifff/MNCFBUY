/**
 * Application-wide constants. Import these instead of using hardcoded strings.
 */

import type { OrderStatus } from './types'

// ─── Order Statuses ──────────────────────────────────────────────────────────

export const ORDER_STATUSES: Record<
  OrderStatus,
  { label: string; color: string; dotClass: string; badgeClass: string }
> = {
  pending: {
    label: 'Pending',
    color: '#f59e0b',
    dotClass: 'dot-pending',
    badgeClass: 'status-pending',
  },
  confirmed: {
    label: 'Confirmed',
    color: '#3b82f6',
    dotClass: 'dot-processing',
    badgeClass: 'status-processing',
  },
  shipped: {
    label: 'Shipped',
    color: '#a855f7',
    dotClass: 'dot-shipped',
    badgeClass: 'status-shipped',
  },
  delivered: {
    label: 'Delivered',
    color: '#10b981',
    dotClass: 'dot-paid',
    badgeClass: 'status-paid',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
    dotClass: 'dot-cancelled',
    badgeClass: 'status-cancelled',
  },
} as const

export const VALID_ORDER_STATUSES = Object.keys(ORDER_STATUSES) as OrderStatus[]

/** Allowed status transitions. Key is current status, values are valid next statuses. */
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [], // Terminal state
  cancelled: ['pending'], // Allow re-opening
}

// ─── Currency ────────────────────────────────────────────────────────────────

export const CURRENCY = {
  code: 'TND',
  symbol: 'TND',
  locale: 'en-TN',
} as const

// ─── Site Configuration ──────────────────────────────────────────────────────

export const SITE_CONFIG = {
  name: 'MoncefBuy',
  tagline: 'Premium E-Commerce',
  description: 'World-class e-commerce experience.',
  maxProductsPerPage: 24,
  maxCartItemQuantity: 99,
} as const

// ─── Route Definitions ───────────────────────────────────────────────────────

export const ROUTES = {
  home: '/',
  cart: '/cart',
  checkout: '/checkout',
  allProducts: '/categories/all',
  category: (slug: string) => `/categories/${slug}` as const,
  product: (slug: string) => `/products/${slug}` as const,
  admin: {
    root: '/admin',
    login: '/admin/login',
    products: '/admin/products',
    categories: '/admin/categories',
    orders: '/admin/orders',
  },
} as const
