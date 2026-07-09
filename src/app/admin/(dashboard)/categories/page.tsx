import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from './CategoryForm'
import styles from './categories.module.css'
import { Trash2, Edit2 } from 'lucide-react'
import { deleteCategory } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/lib/types'

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const params = await searchParams
  const editId = params.edit

  const supabase = await createClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  let categoryToEdit: Category | null = null
  if (editId) {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('id', editId)
      .single()
    categoryToEdit = data as Category
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Categories</h1>
        <p className={styles.subtitle}>
          Create and organize your product categories.
        </p>
      </div>

      <div className={styles.content}>
        {/* Left Column: Form */}
        <div className={styles.column}>
          <CategoryForm initialData={categoryToEdit} />
          {categoryToEdit && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href="/admin/categories">
                <Button variant="outline" type="button">
                  Cancel Editing
                </Button>
              </Link>
            </div>
          )}
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
                {categories?.map((cat: any) => (
                  <li key={cat.id} className={styles.categoryItem}>
                    <div>
                      <h3 className={styles.catName}>{cat.name}</h3>
                      <span className={styles.catSlug}>/{cat.slug}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <Link
                        href={`/admin/categories?edit=${cat.id}`}
                        className={styles.editBtn}
                        title="Edit Category"
                        style={{
                          color: '#3b82f6',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                        }}
                      >
                        <Edit2 size={18} />
                      </Link>
                      <form
                        action={async () => {
                          'use server'
                          await deleteCategory(cat.id)
                        }}
                      >
                        <button
                          type="submit"
                          className={styles.deleteBtn}
                          title="Delete Category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
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
