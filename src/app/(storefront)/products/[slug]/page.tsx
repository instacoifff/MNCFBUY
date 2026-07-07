/* eslint-disable */
// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { ProductClient } from './ProductClient'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  return <ProductClient product={product} />
}
