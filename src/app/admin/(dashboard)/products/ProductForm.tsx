'use client'

import { useState } from 'react'
import { createProduct, updateProduct } from './actions'
import { Button } from '@/components/ui/Button'
import styles from './products.module.css'
import type { Category, Product } from '@/lib/types'

interface ProductFormProps {
  categories: Pick<Category, 'id' | 'name'>[]
  initialData?: Product | null
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isEditing = !!initialData

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    let result
    if (isEditing && initialData) {
      result = await updateProduct(initialData.id, formData)
    } else {
      result = await createProduct(formData)
    }

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
      if (!isEditing) {
        const formElement = document.getElementById(
          'product-form'
        ) as HTMLFormElement
        if (formElement) formElement.reset()
      }
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.cardTitle}>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form id="product-form" action={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Product {isEditing ? 'updated' : 'created'} successfully!
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Product Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={2}
              maxLength={100}
              defaultValue={initialData?.title || ''}
              placeholder="e.g. Apple Watch Ultra 2"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={initialData?.category_id || ''}
              className={styles.input}
            >
              <option value="">Select a category...</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="price">Price (TND)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={initialData?.price || ''}
              placeholder="0.00"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="stock">Stock Quantity</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              defaultValue={initialData?.stock ?? 10}
              placeholder="10"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="image_url">Main Image URL</label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={initialData?.image_url || ''}
            placeholder="https://..."
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Product Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={1000}
            defaultValue={initialData?.description || ''}
            placeholder="Describe the product..."
            className={styles.input}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            value="true"
            defaultChecked={initialData?.is_featured || false}
          />
          <label htmlFor="is_featured">
            Feature this product on the home page
          </label>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditing
              ? 'Updating...'
              : 'Saving...'
            : isEditing
            ? 'Update Product'
            : 'Create Product'}
        </Button>
      </form>
    </div>
  )
}
