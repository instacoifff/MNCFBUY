'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  LogOut,
  Store,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: ROUTES.admin.root, icon: LayoutDashboard },
    { label: 'Orders', href: ROUTES.admin.orders, icon: ShoppingCart },
    { label: 'Products', href: ROUTES.admin.products, icon: Package },
    { label: 'Categories', href: ROUTES.admin.categories, icon: Tags },
  ]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: 'var(--color-bg-primary)',
          borderRight: '1px solid rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '2rem 1.5rem' }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-brand-primary)',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Moncef<span style={{ color: 'var(--color-brand-accent)' }}>Buy</span>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(15, 23, 42, 0.05)',
                padding: '0.25rem 0.5rem',
                borderRadius: '999px',
                marginLeft: 'auto',
              }}
            >
              Admin
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--border-radius-md)',
                    color: isActive
                      ? 'var(--color-brand-primary)'
                      : 'var(--color-text-secondary)',
                    backgroundColor: isActive
                      ? 'rgba(15, 23, 42, 0.05)'
                      : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
          <Link
            href={ROUTES.home}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              marginBottom: '0.5rem',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <Store size={18} />
            Storefront
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-error)',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
