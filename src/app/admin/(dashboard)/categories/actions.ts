'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { categoryFormSchema } from '@/lib/validation'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
  }

  const parsed = categoryFormSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, description } = parsed.data
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
  }

  const parsed = categoryFormSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, description } = parsed.data
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const { error } = await supabase
    .from('categories')
    .update({
      name,
      slug,
      description,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}
