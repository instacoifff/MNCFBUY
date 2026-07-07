'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: string
  product_id: string
  title: string
  price: number
  quantity: number
  image_url: string
  maxStock: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  // We must always wrap children in the Provider, even during SSR.
  // To avoid hydration mismatch, we can just return null for the actual UI
  // inside the components that consume the cart, OR just let the context
  // be empty initially.
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem('mncfbuy_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart')
      }
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('mncfbuy_cart', JSON.stringify(items))
    }
  }, [items, isMounted])

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems(current => {
      const existingItem = current.find(item => item.product_id === newItem.product_id)
      if (existingItem) {
        return current.map(item => 
          item.product_id === newItem.product_id 
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxStock) }
            : item
        )
      }
      return [...current, { ...newItem, quantity: Math.min(newItem.quantity, newItem.maxStock), id: Math.random().toString(36).substring(7) }]
    })
  }

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setItems(current => 
      current.map(item => item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item)
    )
  }

  const clearCart = () => setItems([])

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items: isMounted ? items : [], addToCart, removeFromCart, updateQuantity, clearCart, cartTotal: isMounted ? cartTotal : 0, itemCount: isMounted ? itemCount : 0 }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
