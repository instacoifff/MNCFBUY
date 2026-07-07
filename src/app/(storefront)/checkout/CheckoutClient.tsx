/* eslint-disable */
// @ts-nocheck
'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createOrder } from './actions'
import styles from './checkout.module.css'
import { CheckCircle } from 'lucide-react'

export function CheckoutClient() {
  const { items, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (items.length === 0 && !success) {
    router.push('/cart')
    return null
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    
    const result = await createOrder(formData, items, cartTotal)
    
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      setSuccess(true)
      clearCart()
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className={styles.successContainer}>
        <CheckCircle size={64} className={styles.successIcon} />
        <h1 className={styles.title}>Order Confirmed!</h1>
        <p className={styles.subtitle}>Thank you for your purchase. We will contact you soon to arrange delivery.</p>
        <Button onClick={() => router.push('/')}>Return to Store</Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      
      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Shipping Information</h2>
            <form id="checkout-form" action={handleSubmit} className={styles.form}>
              
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.inputGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" required className={styles.input} />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" required className={styles.input} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="address">Street Address</label>
                <input type="text" id="address" name="address" required className={styles.input} />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" required className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="zipCode">Zip / Postal Code</label>
                  <input type="text" id="zipCode" name="zipCode" required className={styles.input} />
                </div>
              </div>
              
              <div className={styles.paymentInfo}>
                <p><strong>Payment Method:</strong> Cash on Delivery (Pay when you receive the order)</p>
              </div>

              <Button type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Order Summary</h2>
            <div className={styles.summaryItems}>
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemName}>{item.title}</span>
                    <span className={styles.itemQty}>x{item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} TND</span>
                </div>
              ))}
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total to Pay</span>
              <span>{cartTotal.toFixed(2)} TND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
