import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/ProductGrid'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './home.module.css'

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('is_featured', true)
    .limit(8)

  // Fetch recent products
  const { data: newArrivals } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Premium Quality.<br/>World Class Design.</h1>
          <p className={styles.heroSubtitle}>
            Discover our curated collection of extraordinary products designed to elevate your everyday life.
          </p>
          <div className={styles.heroActions}>
            <Link href="/categories/all" className={styles.primaryButton}>
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Collection</h2>
          <Link href="/categories/all" className={styles.viewAllLink}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={featuredProducts || []} />
      </section>

      {/* New Arrivals */}
      <section className={styles.section} style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>New Arrivals</h2>
        </div>
        <ProductGrid products={newArrivals || []} />
      </section>
    </div>
  )
}
