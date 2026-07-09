'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import styles from './ProductCard.module.css'
import { useCart } from '@/context/CartContext'
import type { ProductWithCategory } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

interface ProductCardProps {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image_url: product.image_url || '',
      maxStock: product.stock,
    })
  }

  return (
    <div className={styles.card}>
      <Link href={ROUTES.product(product.slug)} className={styles.imageContainer}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            className={styles.image}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}
      </Link>

      <div className={styles.info}>
        <div className={styles.category}>
          {product.category?.name || 'Uncategorized'}
        </div>
        <Link href={ROUTES.product(product.slug)} className={styles.title}>
          {product.title}
        </Link>
        <div className={styles.bottomRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <button
            className={styles.addToCartBtn}
            aria-label={`Add ${product.title} to cart`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
