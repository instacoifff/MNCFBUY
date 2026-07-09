import React from 'react'
import Link from 'next/link'
import { ROUTES, SITE_CONFIG } from '@/lib/constants'
import styles from './Footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandSection}>
            <Link href={ROUTES.home} className={styles.logo}>
              Moncef<span>Buy</span>
            </Link>
            <p className={styles.description}>{SITE_CONFIG.description}</p>
          </div>

          {/* Quick Links */}
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Shop</h3>
            <Link href={ROUTES.allProducts} className={styles.link}>
              All Products
            </Link>
            <Link href={ROUTES.cart} className={styles.link}>
              Cart
            </Link>
          </div>

          {/* Customer Service */}
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Customer Service</h3>
            <span className={styles.textLink}>Contact Us</span>
            <span className={styles.textLink}>Shipping Policy</span>
            <span className={styles.textLink}>Returns & Exchanges</span>
          </div>

          {/* Admin */}
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Business</h3>
            <Link href={ROUTES.admin.root} className={styles.link}>
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
