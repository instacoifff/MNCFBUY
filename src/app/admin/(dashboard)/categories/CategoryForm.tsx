'use client'

import { useState } from 'react'
import { createCategory } from './actions'
import { Button } from '@/components/ui/Button'
import styles from './categories.module.css'

export function CategoryForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    const result = await createCategory(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
      // Reset form handled by DOM element via ref or simply rely on controlled states (omitted for brevity, let's reset target)
      const formElement = document.getElementById('category-form') as HTMLFormElement;
      if (formElement) formElement.reset();
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.cardTitle}>Add New Category</h2>
      <form id="category-form" action={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Category created successfully!</div>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="name">Category Name</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
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
            placeholder="A brief description of this category..."
            className={styles.input}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Category'}
        </Button>
      </form>
    </div>
  )
}
