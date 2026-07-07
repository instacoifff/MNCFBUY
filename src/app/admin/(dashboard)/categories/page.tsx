import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from './CategoryForm'
import styles from './categories.module.css'
import { Trash2 } from 'lucide-react'
import { deleteCategory } from './actions'
import { Button } from '@/components/ui/Button'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Categories</h1>
        <p className={styles.subtitle}>Create and organize your product categories.</p>
      </div>

      <div className={styles.content}>
        {/* Left Column: Form */}
        <div className={styles.column}>
          <CategoryForm />
        </div>

        {/* Right Column: List */}
        <div className={styles.column}>
          <div className={styles.listCard}>
            <h2 className={styles.cardTitle}>Existing Categories</h2>
            
            {error ? (
              <div className={styles.error}>Failed to load categories.</div>
            ) : categories?.length === 0 ? (
              <p className={styles.emptyState}>No categories found.</p>
            ) : (
              <ul className={styles.categoryList}>
                {categories?.map((cat) => (
                  <li key={cat.id} className={styles.categoryItem}>
                    <div>
                      <h3 className={styles.catName}>{cat.name}</h3>
                      <span className={styles.catSlug}>/{cat.slug}</span>
                    </div>
                    
                    <form action={async () => {
                      'use server'
                      await deleteCategory(cat.id)
                    }}>
                      <button type="submit" className={styles.deleteBtn} title="Delete Category">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
