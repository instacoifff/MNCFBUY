import { createClient } from '@/lib/supabase/server'
import styles from './orders.module.css'
import { StatusUpdater } from './StatusUpdater'
import type { ShippingAddress, OrderStatus } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'

export default async function OrdersPage() {
  const supabase = await createClient()

  // Fetch all orders with their items and products
  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price_at_time,
        product:products (
          title
        )
      )
    `
    )
    .order('created_at', { ascending: false })

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Orders</h1>
        <p className={styles.subtitle}>View and update customer orders.</p>
      </div>

      <div className={styles.content}>
        {error ? (
          <div className={styles.error}>
            Failed to load orders: {error.message}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className={styles.emptyState}>No orders found.</div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order: any) => {
              const address = order.shipping_address as ShippingAddress
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h2 className={styles.orderId}>
                        Order #{order.id.split('-')[0]}
                      </h2>
                      <p className={styles.orderDate}>
                        {format(new Date(order.created_at), 'PPP pp')}
                      </p>
                    </div>
                    <div className={styles.statusSection}>
                      <StatusUpdater
                        orderId={order.id}
                        currentStatus={order.status as OrderStatus}
                      />
                    </div>
                  </div>

                  <div className={styles.orderDetails}>
                    <div className={styles.customerInfo}>
                      <h3>Customer Information</h3>
                      <p>
                        <strong>Name:</strong> {address?.fullName || 'N/A'}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.contact_email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.contact_phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {address?.address},{' '}
                        {address?.city}, {address?.zipCode}
                      </p>
                    </div>

                    <div className={styles.itemsList}>
                      <h3>Order Items</h3>
                      <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.order_items?.map((item: any) => (
                              <tr key={item.id}>
                                <td>
                                  {item.product?.title || 'Unknown Product'}
                                </td>
                                <td>{item.quantity}</td>
                                <td>{formatPrice(item.price_at_time)}</td>
                                <td>
                                  {formatPrice(
                                    item.quantity * item.price_at_time
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3} className={styles.totalLabel}>
                                Total:
                              </td>
                              <td className={styles.totalAmount}>
                                {formatPrice(order.total_amount)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
