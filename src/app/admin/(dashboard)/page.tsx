/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'
import { DashboardCharts } from './DashboardCharts'
import { format, subDays, isAfter } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardOverview() {
  const supabase = await createClient()

  // 1. Quick Stats
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })

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

  // 3. Advanced Metrics & Growth
  const thirtyDaysAgo = subDays(new Date(), 30)
  const sixtyDaysAgo = subDays(new Date(), 60)
  
  const currentOrders = orders.filter(o => isAfter(new Date(o.created_at), thirtyDaysAgo))
  const currentDelivered = currentOrders.filter(o => o.status === 'delivered')
  const currentRevenue = currentDelivered.reduce((sum, o) => sum + Number(o.total_amount), 0)
  
  const prevOrders = orders.filter(o => isAfter(new Date(o.created_at), sixtyDaysAgo) && !isAfter(new Date(o.created_at), thirtyDaysAgo))
  const prevDelivered = prevOrders.filter(o => o.status === 'delivered')
  const prevRevenue = prevDelivered.reduce((sum, o) => sum + Number(o.total_amount), 0)
  
  const calcGrowth = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0
    return ((current - prev) / prev) * 100
  }
  
  const metrics = {
    revenue: {
      value: currentRevenue,
      growth: calcGrowth(currentRevenue, prevRevenue)
    },
    orders: {
      value: currentOrders.length,
      growth: calcGrowth(currentOrders.length, prevOrders.length)
    },
    aov: {
      value: currentOrders.length > 0 ? currentRevenue / currentOrders.length : 0,
      growth: calcGrowth(
        currentOrders.length > 0 ? currentRevenue / currentOrders.length : 0, 
        prevOrders.length > 0 ? prevRevenue / prevOrders.length : 0
      )
    }
  }

  // Returning Customers
  const emailCounts = orders.reduce((acc: any, order) => {
    const email = (order.shipping_address as any)?.email
    if (email) {
      acc[email] = (acc[email] || 0) + 1
    }
    return acc
  }, {})
  
  let returningCount = 0
  let newCount = 0
  Object.values(emailCounts).forEach((count: any) => {
    if (count > 1) returningCount++
    else newCount++
  })
  
  // Status Breakdown Data
  const statusCounts = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  const statusData = [
    { name: 'Paid/Delivered', value: statusCounts['delivered'] || 0, color: '#10b981' },
    { name: 'Processing', value: statusCounts['pending'] || 0, color: '#3b82f6' },
    { name: 'Shipped', value: statusCounts['shipped'] || 0, color: '#a855f7' },
    { name: 'Cancelled', value: statusCounts['cancelled'] || 0, color: '#ef4444' },
  ].filter(s => s.value > 0)

  // Top Cities
  const cityCounts = orders.reduce((acc: any, order) => {
    let city = (order.shipping_address as any)?.city
    // Clean up city string
    if (!city || city.trim() === '') city = 'Unknown'
    city = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase()
    
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {})
  
  const totalValidOrders = orders.length || 1
  const topCities = Object.entries(cityCounts)
    .map(([name, sales]) => ({ 
      name, 
      sales: sales as number,
      percentage: Math.round(((sales as number) / totalValidOrders) * 100)
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // Top Products
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('quantity, products(title)')

  let productSalesTotal = 0
  const productSales = new Map()
  if (orderItems) {
    orderItems.forEach((item: any) => {
      const product = Array.isArray(item.products) ? item.products[0] : item.products
      const title = product?.title || 'Unknown'
      const qty = item.quantity
      productSales.set(title, (productSales.get(title) || 0) + qty)
      productSalesTotal += qty
    })
  }
  
  const topProducts = Array.from(productSales, ([name, sales]) => ({ 
    name, 
    sales,
    percentage: Math.round((sales / (productSalesTotal || 1)) * 100)
  }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // Revenue Over Time (Year to Date)
  const currentYear = new Date().getFullYear()
  const ytdDeliveredOrders = orders.filter(o => o.status === 'delivered' && new Date(o.created_at).getFullYear() === currentYear)
  
  const currentMonth = new Date().getMonth()
  const revenueMap = new Map()
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  for (let i = 0; i <= currentMonth; i++) {
    revenueMap.set(monthNames[i], 0)
  }

  ytdDeliveredOrders.forEach(order => {
    const monthIndex = new Date(order.created_at).getMonth()
    const monthStr = monthNames[monthIndex]
    if (revenueMap.has(monthStr)) {
      revenueMap.set(monthStr, revenueMap.get(monthStr) + Number(order.total_amount))
    }
  })

  const revenueData = Array.from(revenueMap, ([date, revenue]) => ({ date, revenue }))

  // Recent Activity (Latest 5 orders)
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.id,
    name: (order.shipping_address as any)?.fullName || 'Unknown Customer',
    total: Number(order.total_amount),
    status: order.status,
    date: format(new Date(order.created_at), 'MMM dd, yyyy')
  }))

  return (
    <div>
      <DashboardCharts 
        metrics={metrics}
        productCount={productCount || 0}
        returningCount={returningCount}
        revenueData={revenueData} 
        statusData={statusData} 
        topProducts={topProducts}
        topCities={topCities}
        recentOrders={recentOrders} 
      />
    </div>
  )
}
