/* eslint-disable */
// @ts-nocheck
'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import styles from './ProductCard.module.css'
import { useCart } from '@/context/CartContext'

type Product = {
  id: string
  title: string
  slug: string
  price: number
  stock: number
  image_url?: string
  category?: { name: string }
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageContainer}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}
      </Link>
      
      <div className={styles.info}>
        <div className={styles.category}>{product.category?.name || 'Uncategorized'}</div>
        <Link href={`/products/${product.slug}`} className={styles.title}>
          {product.title}
        </Link>
        <div className={styles.bottomRow}>
          <span className={styles.price}>{product.price.toFixed(2)} TND</span>
          <button 
            className={styles.addToCartBtn}
            aria-label="Add to cart"
            onClick={() => addToCart({
              product_id: product.id,
              title: product.title,
              price: product.price,
              quantity: 1,
              image_url: product.image_url || '',
              maxStock: product.stock
            })}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
