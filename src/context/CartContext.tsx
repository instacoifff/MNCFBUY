'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { CartItem, CartItemInput } from '@/lib/types'

const STORAGE_KEY = 'mncfbuy_cart'

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItemInput) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[]
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {
      console.error('Failed to parse cart from localStorage')
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isMounted])

  const addToCart = useCallback((newItem: CartItemInput) => {
    setItems((current) => {
      const existingItem = current.find(
        (item) => item.product_id === newItem.product_id
      )
      if (existingItem) {
        return current.map((item) =>
          item.product_id === newItem.product_id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + newItem.quantity,
                  item.maxStock
                ),
              }
            : item
        )
      }
      return [
        ...current,
        {
          ...newItem,
          quantity: Math.min(newItem.quantity, newItem.maxStock),
          id: crypto.randomUUID(),
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items]
  )

  const value = useMemo<CartContextType>(
    () => ({
      items: isMounted ? items : [],
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal: isMounted ? cartTotal : 0,
      itemCount: isMounted ? itemCount : 0,
    }),
    [
      isMounted,
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
