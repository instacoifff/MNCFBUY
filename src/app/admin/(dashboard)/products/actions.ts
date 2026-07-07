'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string, 10)
  const category_id = formData.get('category_id') as string
  const image_url = formData.get('image_url') as string
  const is_featured = formData.get('is_featured') === 'true'

  const { error } = await supabase.from('products').insert({
    title,
    slug,
    description,
    price,
    stock,
    category_id,
    image_url,
    is_featured
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { success: true }
}
