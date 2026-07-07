import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'
import { Package, Tags, ShoppingCart, DollarSign } from 'lucide-react'
import { DashboardCharts } from './DashboardCharts'
import { format, subDays, isAfter } from 'date-fns'

export default async function AdminDashboardOverview() {
  const supabase = await createClient()

  // 1. Quick Stats
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })

  // 2. Fetch all orders for rich data
  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at, shipping_address')
    .order('created_at', { ascending: false })

  const orders = allOrders || []

  // Total Revenue (Delivered only)
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.total_amount), 0)

  // 3. Status Breakdown Data
  const statusCounts = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  const statusData = [
    { name: 'Pending', value: statusCounts['pending'] || 0, color: '#f59e0b' },
    { name: 'Shipped', value: statusCounts['shipped'] || 0, color: '#3b82f6' },
    { name: 'Delivered', value: statusCounts['delivered'] || 0, color: '#10b981' },
    { name: 'Cancelled', value: statusCounts['cancelled'] || 0, color: '#ef4444' },
  ].filter(s => s.value > 0) // Only show statuses that have orders

  // 4. Revenue Over Time (Last 30 Days)
  const thirtyDaysAgo = subDays(new Date(), 30)
  const recentDeliveredOrders = orders.filter(o => o.status === 'delivered' && isAfter(new Date(o.created_at), thirtyDaysAgo))
  
  // Initialize last 30 days array with 0 revenue
  const revenueMap = new Map()
  for (let i = 29; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd')
    revenueMap.set(dateStr, 0)
  }

  // Populate actual revenue
  recentDeliveredOrders.forEach(order => {
    const dateStr = format(new Date(order.created_at), 'MMM dd')
    if (revenueMap.has(dateStr)) {
      revenueMap.set(dateStr, revenueMap.get(dateStr) + Number(order.total_amount))
    }
  })

  const revenueData = Array.from(revenueMap, ([date, revenue]) => ({ date, revenue }))

  // 5. Recent Activity (Latest 5 orders)
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.id,
    name: (order.shipping_address as any)?.fullName || 'Unknown',
    total: Number(order.total_amount),
    status: order.status,
    date: format(new Date(order.created_at), 'MMM dd, yyyy')
  }))

  // 6. Top Products (Need to fetch order items)
  // Disable type checking on the join strictly since supabase inference might be tricky
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('quantity, products(title)')

  const productSales = new Map()
  if (orderItems) {
    orderItems.forEach((item: any) => {
      // Depending on Supabase setup, products could be an object or array
      const product = Array.isArray(item.products) ? item.products[0] : item.products
      const title = product?.title || 'Unknown'
      productSales.set(title, (productSales.get(title) || 0) + item.quantity)
    })
  }
  
  const topProducts = Array.from(productSales, ([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  return (
    <div>
      <h1 className={styles.title}>Dashboard Overview</h1>
      <p className={styles.subtitle}>Welcome back to your super admin panel.</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Revenue</p>
            <p className={styles.statValue}>TND {totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <ShoppingCart size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Orders</p>
            <p className={styles.statValue}>{orderCount || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Products</p>
            <p className={styles.statValue}>{productCount || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Tags size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Categories</p>
            <p className={styles.statValue}>{categoryCount || 0}</p>
          </div>
        </div>
      </div>

      <DashboardCharts 
        revenueData={revenueData} 
        statusData={statusData} 
        topProducts={topProducts} 
        recentOrders={recentOrders} 
      />
    </div>
  )
}
