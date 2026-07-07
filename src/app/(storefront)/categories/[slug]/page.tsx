import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/ProductGrid'
import { notFound } from 'next/navigation'
import styles from './category.module.css'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Find the category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category && params.slug !== 'all') {
    notFound()
  }

  // Fetch products
  let query = supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false })
  
  if (params.slug !== 'all') {
    query = query.eq('category_id', category.id)
  }

  const { data: products } = await query

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{category ? category.name : 'All Products'}</h1>
        {category?.description && (
          <p className={styles.description}>{category.description}</p>
        )}
      </div>

      <div className={styles.gridContainer}>
        <ProductGrid products={products || []} />
      </div>
    </div>
  )
}
