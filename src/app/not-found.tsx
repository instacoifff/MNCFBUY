import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
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
            fontSize: '6rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--color-text-tertiary)',
            marginBottom: '1rem',
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
