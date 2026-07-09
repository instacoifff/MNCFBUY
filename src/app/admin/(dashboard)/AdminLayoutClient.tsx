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
  Users,
  LineChart,
  Box,
  Megaphone,
  Ticket,
  Settings,
  HelpCircle,
  Search,
  Filter,
  Calendar,
  Bell,
  ChevronDown
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: ROUTES.admin.root, icon: LayoutDashboard },
    { label: 'Orders', href: ROUTES.admin.orders, icon: ShoppingCart },
    { label: 'Products', href: ROUTES.admin.products, icon: Package },
    { label: 'Categories', href: ROUTES.admin.categories, icon: Tags }, // we mapped this from "Customers" etc.
    { label: 'Customers', href: '#customers', icon: Users },
    { label: 'Revenue', href: '#revenue', icon: LineChart },
    { label: 'Warehouse', href: '#warehouse', icon: Box },
    { label: 'Analytics', href: '#analytics', icon: LineChart },
    { label: 'Marketing', href: '#marketing', icon: Megaphone },
    { label: 'Discounts', href: '#discounts', icon: Ticket },
    { label: 'Settings', href: '#settings', icon: Settings },
  ]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-brand-primary)',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Northbay icon mock */}
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '8px' }} />
            Moncef<span style={{ color: '#10b981' }}>Buy</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, overflowY: 'auto' }}>
            {navItems.map((item) => {
              // Exact match or sub-path logic. For mocks, we just do exact.
              const isActive = pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href) && item.href !== ROUTES.admin.root) || (item.href === ROUTES.admin.root && pathname === ROUTES.admin.root)
              
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 1rem',
                    borderRadius: '8px',
                    color: isActive ? '#10b981' : '#64748b',
                    backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          
          {/* Bottom Sidebar */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <HelpCircle size={16} color="#64748b" />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Need help?</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>View docs</p>
                </div>
              </div>
            </div>

            <Link
              href={ROUTES.home}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#64748b',
                textDecoration: 'none',
                marginBottom: '0.25rem',
                fontSize: '0.9375rem',
                fontWeight: 500,
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
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '80px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Search */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: '#f8fafc',
            padding: '0.625rem 1rem',
            borderRadius: '99px',
            width: '320px',
            gap: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                flex: 1,
                fontSize: '0.9375rem',
                color: '#0f172a'
              }}
            />
            <div style={{ 
              background: '#ffffff', 
              padding: '0.125rem 0.375rem', 
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              fontWeight: 500
            }}>⌘ K</div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#0f172a',
              cursor: 'pointer'
            }}>
              <Filter size={16} /> Filter
            </button>

            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#0f172a',
              cursor: 'pointer'
            }}>
              May 25 - Jun 23, 2025 <Calendar size={16} color="#64748b" />
            </button>

            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }} />

            <button style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <Bell size={22} color="#64748b" />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#10b981',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginLeft: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                 <Image src="https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff" width={36} height={36} alt="Admin" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Admin</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Administrator</span>
              </div>
              <ChevronDown size={16} color="#64748b" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
