'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { productFormSchema } from '@/lib/validation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const rawData: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    rawData[key] = value
  })
  
  // Convert specific fields to correct types before validation
  if (typeof rawData.price === 'string') rawData.price = parseFloat(rawData.price)
  if (typeof rawData.stock === 'string') rawData.stock = parseInt(rawData.stock, 10)
  if (typeof rawData.is_featured === 'string') rawData.is_featured = rawData.is_featured === 'true'

  const parsed = productFormSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { title, description, price, stock, category_id, image_url, is_featured } = parsed.data
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { error } = await supabase.from('products').insert({
    title,
    slug,
    description,
    price,
    stock,
    category_id,
    image_url,
    is_featured,
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

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    rawData[key] = value
  })
  
  // Convert specific fields to correct types before validation
  if (typeof rawData.price === 'string') rawData.price = parseFloat(rawData.price)
  if (typeof rawData.stock === 'string') rawData.stock = parseInt(rawData.stock, 10)
  if (typeof rawData.is_featured === 'string') rawData.is_featured = rawData.is_featured === 'true'

  const parsed = productFormSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { title, description, price, stock, category_id, image_url, is_featured } = parsed.data
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { error } = await supabase
    .from('products')
    .update({
      title,
      slug,
      description,
      price,
      stock,
      category_id,
      image_url,
      is_featured,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { success: true }
}
