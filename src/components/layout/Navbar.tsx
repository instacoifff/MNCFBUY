'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import styles from './Navbar.module.css'
import { useCart } from '@/context/CartContext'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface NavbarProps {
  categories?: { name: string; slug: string }[]
}

export function Navbar({ categories }: NavbarProps) {
  const { itemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenu}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href={ROUTES.home} className={styles.logo}>
          Moncef<span>Buy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.slug}
                href={ROUTES.category(cat.slug)}
                className={styles.navLink}
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <Link href={ROUTES.allProducts} className={styles.navLink}>
              All Products
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href={ROUTES.cart} className={styles.cartButton} aria-label="Shopping cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className={styles.cartCount}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobileMenu}>
          <nav
            className={styles.mobileNav}
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={ROUTES.category(cat.slug)}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <Link
                href={ROUTES.allProducts}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                All Products
              </Link>
            )}
            <Link
              href={ROUTES.cart}
              className={styles.mobileNavLink}
              onClick={closeMobileMenu}
            >
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
