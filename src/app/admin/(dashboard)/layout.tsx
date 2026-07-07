/* eslint-disable */
// @ts-nocheck
import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings, LogOut } from 'lucide-react'
import styles from './adminLayout.module.css'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Link href="/admin" className={styles.logo}>
            Moncef<span>Admin</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </Link>
          <Link href="/admin/products" className={styles.navItem}>
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/categories" className={styles.navItem}>
            <Tags size={20} />
            <span>Categories</span>
          </Link>
          <Link href="/admin/orders" className={styles.navItem}>
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
        </nav>

        <div className={styles.bottomNav}>
          <div className={styles.userInfo}>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <form action={async () => {
            'use server'
            const sb = await createClient()
            await sb.auth.signOut()
            redirect('/admin/login')
          }}>
            <button className={styles.logoutButton}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
