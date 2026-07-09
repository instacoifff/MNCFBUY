'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  newStatus: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
})

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const parsed = updateOrderStatusSchema.safeParse({ orderId, newStatus })
  
  if (!parsed.success) {
    return { error: 'Invalid order status or ID.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: parsed.data.newStatus })
    .eq('id', parsed.data.orderId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}
