'use client'

import React, { useState } from 'react'
import { updateOrderStatus } from './actions'
import styles from './orders.module.css'
import type { OrderStatus } from '@/lib/types'

interface StatusUpdaterProps {
  orderId: string
  currentStatus: OrderStatus
}

export function StatusUpdater({ orderId, currentStatus }: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true)
    const newStatus = e.target.value as OrderStatus
    await updateOrderStatus(orderId, newStatus)
    setIsUpdating(false)
  }

  return (
    <div className={styles.statusUpdater}>
      <label htmlFor={`status-${orderId}`} className={styles.statusLabel}>
        Status:
      </label>
      <select
        id={`status-${orderId}`}
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`${styles.statusSelect} ${styles[`status_${currentStatus}`]}`}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {isUpdating && <span className={styles.updatingSpinner}>...</span>}
    </div>
  )
}
