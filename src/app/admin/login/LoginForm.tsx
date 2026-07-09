'use client'

import { useState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/Button'
import styles from './login.module.css'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email Address</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          placeholder="admin@moncefbuy.com"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className={styles.input}
        />
      </div>

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
      </Button>
    </form>
  )
}
