import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'
import { DashboardCharts } from './DashboardCharts'
import { format, subDays, subMonths, isAfter, startOfMonth, endOfMonth, format as dateFnsFormat } from 'date-fns'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardOverview() {
  const supabase = await createClient()

  // 1. Core Metrics Data Fetch
  const [
    { count: totalProducts },
    { count: outOfStockProducts },
    { data: allOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock', 0),
    supabase.from('orders').select('id, total_amount, status, created_at, contact_email').order('created_at', { ascending: false })
  ])

  const orders = allOrders || []

  // Total Revenue (Delivered only)
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.total_amount), 0)

  // Total Customers (Unique Emails)
  const uniqueCustomers = new Set(orders.map(o => o.contact_email).filter(Boolean))
  const totalCustomers = uniqueCustomers.size

  // Average Order Value
  const aov = orders.length > 0 ? (totalRevenue / orders.filter(o => o.status === 'delivered').length) || 0 : 0

  // 2. Growth Metrics (Last 30 Days vs Previous 30 Days)
  const thirtyDaysAgo = subDays(new Date(), 30)
  const sixtyDaysAgo = subDays(new Date(), 60)

  const currentOrders = orders.filter((o) => isAfter(new Date(o.created_at), thirtyDaysAgo))
  const currentDelivered = currentOrders.filter((o) => o.status === 'delivered')
  const currentRevenue = currentDelivered.reduce((sum, o) => sum + Number(o.total_amount), 0)

  const prevOrders = orders.filter(
    (o) => isAfter(new Date(o.created_at), sixtyDaysAgo) && !isAfter(new Date(o.created_at), thirtyDaysAgo)
  )
  const prevDelivered = prevOrders.filter((o) => o.status === 'delivered')
  const prevRevenue = prevDelivered.reduce((sum, o) => sum + Number(o.total_amount), 0)

  const calcGrowth = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0
    return ((current - prev) / prev) * 100
  }

  const metrics = {
    revenueGrowth: calcGrowth(currentRevenue, prevRevenue),
    ordersGrowth: calcGrowth(currentOrders.length, prevOrders.length),
    customersGrowth: calcGrowth(
      new Set(currentOrders.map(o => o.contact_email)).size,
      new Set(prevOrders.map(o => o.contact_email)).size
    ),
  }

  // 3. Status Breakdown Data
  const statusCounts = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  const statusData = [
    { name: 'Delivered', value: statusCounts['delivered'] || 0, color: '#10b981' },
    { name: 'Pending', value: statusCounts['pending'] || 0, color: '#f59e0b' },
    { name: 'Confirmed', value: statusCounts['confirmed'] || 0, color: '#3b82f6' },
    { name: 'Shipped', value: statusCounts['shipped'] || 0, color: '#8b5cf6' },
    { name: 'Cancelled', value: statusCounts['cancelled'] || 0, color: '#ef4444' },
  ].filter((s) => s.value > 0)

  // 4. Top Products & Categories Data
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('quantity, products(title, categories(name))')

  let productSalesTotal = 0
  const productSales = new Map<string, number>()
  const categorySales = new Map<string, number>()

  if (orderItems) {
    orderItems.forEach((item: any) => {
      const product = Array.isArray(item.products) ? item.products[0] : item.products
      const title = product?.title || 'Unknown'
      const categoryName = product?.categories?.name || 'Uncategorized'
      const qty = item.quantity

      productSales.set(title, (productSales.get(title) || 0) + qty)
      categorySales.set(categoryName, (categorySales.get(categoryName) || 0) + qty)
      productSalesTotal += qty
    })
  }

  const topProducts = Array.from(productSales, ([name, sales]) => ({
    name,
    sales,
    percentage: Math.round((sales / (productSalesTotal || 1)) * 100),
  }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  const topCategories = Array.from(categorySales, ([name, sales]) => ({
    name,
    sales,
    percentage: Math.round((sales / (productSalesTotal || 1)) * 100),
  }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // 5. Revenue & Orders Over Time (Rolling 6 Months)
  const rollingMonthsData: { date: string, start: Date, end: Date, revenue: number, orders: number }[] = []
  const today = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const targetDate = subMonths(today, i)
    rollingMonthsData.push({
      date: dateFnsFormat(targetDate, 'MMM yyyy'),
      start: startOfMonth(targetDate),
      end: endOfMonth(targetDate),
      revenue: 0,
      orders: 0
    })
  }

  orders.forEach((order) => {
    const orderDate = new Date(order.created_at)
    const monthBucket = rollingMonthsData.find(
      (m) => orderDate >= m.start && orderDate <= m.end
    )
    if (monthBucket) {
      monthBucket.orders += 1
      if (order.status === 'delivered') {
        monthBucket.revenue += Number(order.total_amount)
      }
    }
  })

  // Format explicitly for Recharts
  const revenueData = rollingMonthsData.map(m => ({
    date: m.date,
    revenue: m.revenue,
    orders: m.orders
  }))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.subtitle}>Welcome back. Here's your enterprise summary.</p>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricBottom}>
            <h3 className={styles.metricTitle}>Total Revenue</h3>
            <span className={`${styles.growthBadge} ${metrics.revenueGrowth >= 0 ? styles.growthPositive : styles.growthNegative}`}>
              {metrics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.revenueGrowth).toFixed(1)}%
            </span>
          </div>
          <p className={styles.metricValue}>{formatPrice(totalRevenue)}</p>
          <span className={styles.metricSubtitle}>From delivered orders</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricBottom}>
            <h3 className={styles.metricTitle}>Total Orders</h3>
            <span className={`${styles.growthBadge} ${metrics.ordersGrowth >= 0 ? styles.growthPositive : styles.growthNegative}`}>
              {metrics.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.ordersGrowth).toFixed(1)}%
            </span>
          </div>
          <p className={styles.metricValue}>{orders.length}</p>
          <span className={styles.metricSubtitle}>Across all statuses</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricBottom}>
            <h3 className={styles.metricTitle}>Customers</h3>
            <span className={`${styles.growthBadge} ${metrics.customersGrowth >= 0 ? styles.growthPositive : styles.growthNegative}`}>
              {metrics.customersGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.customersGrowth).toFixed(1)}%
            </span>
          </div>
          <p className={styles.metricValue}>{totalCustomers}</p>
          <span className={styles.metricSubtitle}>Unique buyers</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricBottom}>
            <h3 className={styles.metricTitle}>Inventory Alerts</h3>
          </div>
          <p className={styles.metricValue} style={{ color: outOfStockProducts ? 'var(--color-error)' : 'inherit' }}>
            {outOfStockProducts || 0}
          </p>
          <span className={styles.metricSubtitle}>Products out of stock</span>
        </div>
      </div>

      <DashboardCharts
        statusData={statusData}
        productSalesData={topProducts}
        categorySalesData={topCategories}
        revenueData={revenueData}
      />
    </div>
  )
}
