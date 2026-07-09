/**
 * Zod validation schemas for all form inputs and server action parameters.
 * Centralizes input validation to prevent invalid data from reaching the database.
 */

import { z } from 'zod'
import { VALID_ORDER_STATUSES } from './constants'
import type { OrderStatus } from './types'

// ─── Checkout Form ───────────────────────────────────────────────────────────

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .transform((v) => v.trim()),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters')
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .transform((v) => v.trim()),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .transform((v) => v.trim()),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .transform((v) => v.trim()),
  zipCode: z
    .string()
    .min(3, 'Zip code must be at least 3 characters')
    .max(10, 'Zip code must not exceed 10 characters')
    .transform((v) => v.trim()),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>

// ─── Product Form ────────────────────────────────────────────────────────────

export const productFormSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must not exceed 200 characters')
    .transform((v) => v.trim()),
  category_id: z.string().uuid('Please select a valid category'),
  price: z.coerce
    .number()
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price must not exceed 999,999.99'),
  stock: z.coerce
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock must not exceed 999,999'),
  image_url: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .transform((v) => v.trim() || null),
  description: z
    .string()
    .max(5000, 'Description must not exceed 5,000 characters')
    .transform((v) => v.trim() || null),
  is_featured: z.boolean().default(false),
})

export type ProductFormData = z.infer<typeof productFormSchema>

// ─── Category Form ───────────────────────────────────────────────────────────

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .transform((v) => v.trim()),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .transform((v) => v.trim() || null),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>

// ─── Login Form ──────────────────────────────────────────────────────────────

export const loginFormSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters'),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

// ─── Order Status Update ─────────────────────────────────────────────────────

export const orderStatusSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  newStatus: z.enum(VALID_ORDER_STATUSES as [OrderStatus, ...OrderStatus[]], {
    message: 'Invalid order status'
  }),
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse form data with a Zod schema.
 * Returns `{ data, error }` — never throws.
 */
export function parseFormData<T extends z.ZodType>(
  schema: T,
  formData: FormData
): { data: z.infer<T>; error: null } | { data: null; error: string } {
  const rawData: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    rawData[key] = value
  })

  const result = schema.safeParse(rawData)
  if (!result.success) {
    const firstError = result.error.issues[0]
    return { data: null, error: firstError?.message ?? 'Validation failed' }
  }

  return { data: result.data, error: null }
}
