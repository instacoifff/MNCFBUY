'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData, items: any[], totalAmount: number) {
  const supabase = await createClient()

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zipCode = formData.get('zipCode') as string

  const orderId = crypto.randomUUID()

  // 1. Create the Order
  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    total_amount: totalAmount,
    status: 'pending',
    payment_method: 'cash_on_delivery',
    contact_email: email,
    contact_phone: phone,
    shipping_address: {
      fullName,
      address,
      city,
      zipCode
    }
  })

  if (orderError) {
    return { error: 'Failed to create order.' }
  }

  // 2. Create the Order Items
  const orderItemsData = items.map(item => ({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)

  if (itemsError) {
    return { error: 'Failed to save order items.' }
  }

  // 3. Optional: Deduct stock from products (simplified)
  // For a production app, we would use an RPC or a database trigger to ensure consistency.

  revalidatePath('/admin')
  return { success: true, orderId }
}
