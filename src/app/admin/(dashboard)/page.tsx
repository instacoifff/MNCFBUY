import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'
import { DashboardCharts } from './DashboardCharts'
import { format, subDays, subMonths, isAfter, startOfMonth, endOfMonth, format as dateFnsFormat } from 'date-fns'
import { formatPrice } from '@/lib/utils'
import { KpiCard } from './KpiCard'
import { DollarSign, ShoppingBag, TrendingUp, UserCheck, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardOverview() {
  const supabase = await createClient()

  // 1. Core Metrics Data Fetch
  const [
    { data: allOrders }
  ] = await Promise.all([
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

  const revenueGrowth = calcGrowth(currentRevenue, prevRevenue)
  const ordersGrowth = calcGrowth(currentOrders.length, prevOrders.length)
  const currentAov = currentDelivered.length > 0 ? currentRevenue / currentDelivered.length : 0
  const prevAov = prevDelivered.length > 0 ? prevRevenue / prevDelivered.length : 0
  const aovGrowth = calcGrowth(currentAov, prevAov)
  
  const currentCust = new Set(currentOrders.map(o => o.contact_email)).size
  const prevCust = new Set(prevOrders.map(o => o.contact_email)).size
  const returningCustomersGrowth = calcGrowth(currentCust, prevCust)
  
  // Mock Conversion Rate Growth for visual completeness
  const conversionGrowth = 0.6

  // Generate sparkline mock data (since we don't have daily analytics over 30 days stored easily, we'll generate subtle curves)
  const sparklineRevenue = [10, 15, 12, 18, 16, 22, 28, 25, 30]
  const sparklineOrders = [5, 8, 10, 7, 12, 11, 15, 14, 18]
  const sparklineAov = [40, 45, 42, 48, 50, 46, 52, 54, 53]
  const sparklineConv = [2.1, 2.3, 2.5, 2.4, 2.7, 3.0, 3.2, 3.1, 3.4]
  const sparklineCust = [2, 4, 3, 5, 6, 8, 7, 9, 12]

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

  // 5. Revenue & Orders Over Time (Rolling 12 Months to match Northbay)
  const rollingMonthsData: { date: string, start: Date, end: Date, revenue: number, orders: number }[] = []
  const today = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const targetDate = subMonths(today, i)
    rollingMonthsData.push({
      date: dateFnsFormat(targetDate, 'MMM'),
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

  const revenueData = rollingMonthsData.map(m => ({
    date: m.date,
    revenue: m.revenue,
    orders: m.orders
  }))

  const vsDateText = 'vs Apr 25 - May 24'

  return (
    <div className={styles.container}>
      {/* 5 KPI Cards Row */}
      <div className={styles.metricsGrid}>
        <KpiCard 
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          growth={Number(revenueGrowth.toFixed(1))}
          vsText={vsDateText}
          Icon={DollarSign}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
          sparklineData={sparklineRevenue}
          sparklineColor="#10b981"
        />
        <KpiCard 
          title="Orders"
          value={orders.length.toLocaleString()}
          growth={Number(ordersGrowth.toFixed(1))}
          vsText={vsDateText}
          Icon={ShoppingBag}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
          sparklineData={sparklineOrders}
          sparklineColor="#10b981"
        />
        <KpiCard 
          title="Average Order Value"
          value={formatPrice(aov)}
          growth={Number(aovGrowth.toFixed(1))}
          vsText={vsDateText}
          Icon={TrendingUp}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.1)"
          sparklineData={sparklineAov}
          sparklineColor="#8b5cf6"
        />
        <KpiCard 
          title="Conversion Rate"
          value="3.42%" // Mocked as requested
          growth={conversionGrowth}
          vsText={vsDateText}
          Icon={UserCheck}
          iconColor="#8b5cf6"
          iconBg="rgba(139, 92, 246, 0.1)"
          sparklineData={sparklineConv}
          sparklineColor="#8b5cf6"
        />
        <KpiCard 
          title="Returning Customers"
          value={totalCustomers.toLocaleString()}
          growth={Number(returningCustomersGrowth.toFixed(1))}
          vsText={vsDateText}
          Icon={ShieldCheck}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
          sparklineData={sparklineCust}
          sparklineColor="#10b981"
        />
      </div>

      <DashboardCharts
        statusData={statusData}
        productSalesData={topProducts}
        categorySalesData={topCategories}
        revenueData={revenueData}
        recentOrders={orders.slice(0, 5)}
      />
    </div>
  )
}
