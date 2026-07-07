'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, CheckCircle, Minus, Plus } from 'lucide-react'
import styles from './productClient.module.css'

export function ProductClient({ product }: { product: any }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart({
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image_url: product.image_url || ''
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const inStock = product.stock > 0

  return (
    <div className={styles.container}>
      {/* Left: Image Gallery */}
      <div className={styles.imageSection}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className={styles.mainImage} />
        ) : (
          <div className={styles.imagePlaceholder}>No Image Available</div>
        )}
      </div>

      {/* Right: Info */}
      <div className={styles.infoSection}>
        <div className={styles.category}>{product.category?.name || 'Uncategorized'}</div>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>{product.price.toFixed(2)} TND</p>
        
        <div className={styles.description}>
          {product.description || 'No description provided.'}
        </div>

        <div className={styles.stockStatus}>
          {inStock ? (
            <span className={styles.inStock}>In Stock ({product.stock} available)</span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>

        {inStock && (
          <div className={styles.actions}>
            <div className={styles.quantityWrapper}>
              <button 
                className={styles.qtyBtn} 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button 
                className={styles.qtyBtn} 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              >
                <Plus size={16} />
              </button>
            </div>
            
            <Button onClick={handleAdd} className={styles.addBtn}>
              {added ? (
                <><CheckCircle size={20} /> Added to Cart</>
              ) : (
                <><ShoppingCart size={20} /> Add to Cart</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
