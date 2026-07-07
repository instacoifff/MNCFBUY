/* eslint-disable */
// @ts-nocheck
import React from 'react'
import { ProductCard } from './ProductCard'
import styles from './ProductGrid.module.css'

export function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products found in this section.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
