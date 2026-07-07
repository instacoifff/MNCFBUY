import { createClient } from '@/lib/supabase/server'
import { ProductClient } from './ProductClient'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('slug', params.slug)
    .single()

  if (!product) {
    notFound()
  }

  return <ProductClient product={product} />
}
