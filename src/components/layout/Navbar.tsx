import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Mobile Menu Button */}
        <button className={styles.mobileMenu}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Moncef<span>Buy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/categories/electronics" className={styles.navLink}>Electronics</Link>
          <Link href="/categories/fashion" className={styles.navLink}>Fashion</Link>
          <Link href="/categories/home-garden" className={styles.navLink}>Home & Garden</Link>
          <Link href="/categories/health-beauty" className={styles.navLink}>Health & Beauty</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.iconButton} aria-label="Search">
            <Search size={20} />
          </button>
          <button className={styles.iconButton} aria-label="Account">
            <User size={20} />
          </button>
          <Link href="/cart" className={styles.cartButton}>
            <ShoppingCart size={20} />
            <span className={styles.cartCount}>0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
