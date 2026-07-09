'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '1rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          We encountered an unexpected error. Please try again, or return to the
          home page.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button onClick={() => unstable_retry()}>Try Again</Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
