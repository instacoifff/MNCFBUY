'use client'

import { useState } from 'react'
import { createProduct } from './actions'
import { Button } from '@/components/ui/Button'
import styles from './products.module.css'

export function ProductForm({ categories }: { categories: any[] }) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    const result = await createProduct(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
      const formElement = document.getElementById('product-form') as HTMLFormElement;
      if (formElement) formElement.reset();
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.cardTitle}>Add New Product</h2>
      <form id="product-form" action={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Product created successfully!</div>}
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Product Title</label>
            <input id="title" name="title" type="text" required placeholder="e.g. Apple Watch Ultra 2" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="category_id">Category</label>
            <select id="category_id" name="category_id" required className={styles.input}>
              <option value="">Select a category...</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="price">Price (TND)</label>
            <input id="price" name="price" type="number" step="0.01" min="0" required placeholder="0.00" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="stock">Stock Quantity</label>
            <input id="stock" name="stock" type="number" min="0" required placeholder="10" className={styles.input} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="image_url">Main Image URL</label>
          <input id="image_url" name="image_url" type="url" placeholder="https://..." className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Product Description</label>
          <textarea id="description" name="description" rows={4} placeholder="Describe the product..." className={styles.input} />
        </div>

        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="is_featured" name="is_featured" value="true" />
          <label htmlFor="is_featured">Feature this product on the home page</label>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Create Product'}
        </Button>
      </form>
    </div>
  )
}
