'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkoutFormSchema } from '@/lib/validation'
import type { CartItem, CreateOrderResult } from '@/lib/types'

/**
 * Server action to create a new order.
 * 
 * SECURITY: Server-side total recalculation from DB prices.
 * We do NOT trust the client-sent totalAmount.
 */
export async function createOrder(
  formData: FormData,
  items: CartItem[],
  _clientTotal: number // Intentionally ignored — recalculated server-side
): Promise<CreateOrderResult> {
  // 1. Validate form input
  const rawData: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    rawData[key] = value
  })

  const parsed = checkoutFormSchema.safeParse(rawData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { error: firstError?.message ?? 'Invalid form data.' }
  }

  const { fullName, email, phone, address, city, zipCode } = parsed.data

  if (!items || items.length === 0) {
    return { error: 'Your cart is empty.' }
  }

  const supabase = await createClient()

  // 2. Pre-checkout stock verification AND server-side price lookup
  const productIds = items.map((item) => item.product_id)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, stock, price')
    .in('id', productIds)

  if (productsError || !products) {
    return { error: 'Failed to verify inventory. Please try again.' }
  }

  // Verify stock AND calculate real total from DB prices
  let serverTotal = 0
  for (const item of items) {
    const dbProduct = products.find((p) => p.id === item.product_id)
    if (!dbProduct) {
      return { error: `Product "${item.title}" no longer exists.` }
    }
    if (item.quantity > dbProduct.stock) {
      return {
        error: `Sorry, only ${dbProduct.stock} left in stock for "${dbProduct.title}".`,
      }
    }
    if (item.quantity < 1) {
      return { error: `Invalid quantity for "${item.title}".` }
    }
    // Use the DB price, not the client-sent price
    serverTotal += dbProduct.price * item.quantity
  }

  const orderId = crypto.randomUUID()

  // 3. Create the Order with server-calculated total
  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    total_amount: serverTotal,
    status: 'pending',
    payment_method: 'cash_on_delivery',
    contact_email: email,
    contact_phone: phone,
    shipping_address: {
      fullName,
      address,
      city,
      zipCode,
    },
  })

  if (orderError) {
    return { error: 'Failed to create order. Please try again.' }
  }

  // 4. Create the Order Items with DB prices
  const orderItemsData = items.map((item) => {
    const dbProduct = products.find((p) => p.id === item.product_id)!
    return {
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: dbProduct.price, // DB price, not client price
    }
  })

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    // Attempt to clean up the orphaned order
    await supabase.from('orders').delete().eq('id', orderId)
    return { error: 'Failed to save order items. Please try again.' }
  }

  // Stock deduction is handled by the database trigger (trg_decrement_stock)

  revalidatePath('/admin')
  return { success: true, orderId }
}
