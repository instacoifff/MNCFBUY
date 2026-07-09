'use client'

import { useState } from 'react'
import { createCategory, updateCategory } from './actions'
import { Button } from '@/components/ui/Button'
import styles from './categories.module.css'
import type { Category } from '@/lib/types'

interface CategoryFormProps {
  initialData?: Category | null
}

export function CategoryForm({ initialData }: CategoryFormProps) {
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
      result = await updateCategory(initialData.id, formData)
    } else {
      result = await createCategory(formData)
    }

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
      if (!isEditing) {
        const formElement = document.getElementById(
          'category-form'
        ) as HTMLFormElement
        if (formElement) formElement.reset()
      }
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.cardTitle}>
        {isEditing ? 'Edit Category' : 'Add New Category'}
      </h2>
      <form id="category-form" action={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Category {isEditing ? 'updated' : 'created'} successfully!
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="name">Category Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            defaultValue={initialData?.name || ''}
            placeholder="e.g. Smart Watches"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={500}
            defaultValue={initialData?.description || ''}
            placeholder="A brief description of this category..."
            className={styles.input}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Category'
            : 'Create Category'}
        </Button>
      </form>
    </div>
  )
}
