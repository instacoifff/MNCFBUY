/* eslint-disable */
// @ts-nocheck
'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import styles from './cart.module.css'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyCard}>
          <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
          <p className={styles.emptyDesc}>Looks like you haven't added any items to your cart yet.</p>
          <Link href="/categories/all">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart ({itemCount} items)</h1>
      
      <div className={styles.content}>
        <div className={styles.itemsSection}>
          <ul className={styles.itemList}>
            {items.map(item => (
              <li key={item.id} className={styles.item}>
                <div className={styles.itemImageContainer}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className={styles.itemImage} />
                  ) : (
                    <div className={styles.imagePlaceholder}>No Image</div>
                  )}
                </div>
                
                <div className={styles.itemInfo}>
                  <Link href={`/products/${item.product_id}`} className={styles.itemTitle}>
                    {item.title}
                  </Link>
                  <p className={styles.itemPrice}>{item.price.toFixed(2)} TND</p>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.quantityWrapper}>
                      <button 
                        className={styles.qtyBtn} 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn} 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        title={item.quantity >= item.maxStock ? "Maximum stock reached" : ""}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
                
                <div className={styles.itemTotal}>
                  {(item.price * item.quantity).toFixed(2)} TND
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{cartTotal.toFixed(2)} TND</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{cartTotal.toFixed(2)} TND</span>
            </div>
            
            <Link href="/checkout" className={styles.checkoutLink}>
              <Button fullWidth>
                Proceed to Checkout <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
