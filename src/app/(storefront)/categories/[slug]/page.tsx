import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/ProductGrid'
import { notFound } from 'next/navigation'
import styles from './category.module.css'
import type { ProductWithCategory } from '@/lib/types'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  let title = 'All Products'
  let description = 'Browse our complete collection.'
  let products = []

  if (slug === 'all') {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false })
    products = data || []
  } else {
    // Fetch specific category
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!category) {
      notFound()
    }

    title = category.name
    description = category.description || `Browse products in ${category.name}.`

    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false })

    products = data || []
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>

      <ProductGrid products={products as ProductWithCategory[]} />
    </div>
  )
}
