/* eslint-disable */
// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from './ProductForm'
import styles from './products.module.css'
import { Trash2, Edit2 } from 'lucide-react'
import { deleteProduct } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const editId = params.edit;

  const supabase = await createClient()
  
  // Fetch products with their category details
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name
      )
    `)
    .order('created_at', { ascending: false })

  // Fetch categories for the form dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  let productToEdit = null;
  if (editId) {
    const { data } = await supabase.from('products').select('*').eq('id', editId).single();
    productToEdit = data;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Products</h1>
        <p className={styles.subtitle}>Add new inventory and manage your existing products.</p>
      </div>

      <div className={styles.content}>
        {/* Top/Left Area: Form */}
        <div className={styles.formSection}>
          <ProductForm categories={categories || []} initialData={productToEdit} />
          {productToEdit && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href="/admin/products">
                <Button variant="outline" type="button">Cancel Editing</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom/Right Area: List */}
        <div className={styles.listSection}>
          <div className={styles.listCard}>
            <h2 className={styles.cardTitle}>Inventory List</h2>
            
            {productsError ? (
              <div className={styles.error}>Failed to load products.</div>
            ) : products?.length === 0 ? (
              <p className={styles.emptyState}>No products found. Add your first product!</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th className={styles.textRight}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div className={styles.productCell}>
                            <p className={styles.prodName}>{prod.title}</p>
                            <span className={styles.prodSlug}>{prod.slug}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.badge}>{prod.categories?.name || 'Uncategorized'}</span>
                        </td>
                        <td className={styles.prodPrice}>TND {prod.price.toFixed(2)}</td>
                        <td>
                          <span className={prod.stock > 0 ? styles.stockIn : styles.stockOut}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className={styles.textRight}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Link href={`/admin/products?edit=${prod.id}`} className={styles.editBtn} title="Edit Product" style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                              <Edit2 size={18} />
                            </Link>
                            <form action={async () => {
                              'use server'
                              await deleteProduct(prod.id)
                            }}>
                              <button type="submit" className={styles.deleteBtn} title="Delete Product">
                                <Trash2 size={18} />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
