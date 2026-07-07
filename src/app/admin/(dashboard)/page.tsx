import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'
import { Package, Tags, ShoppingCart, DollarSign } from 'lucide-react'

export default async function AdminDashboardOverview() {
  const supabase = await createClient()

  // Fetch quick stats
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })

  // Calculate total revenue (Sum of all DELIVERED orders)
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'delivered')

  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

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
    </div>
  )
}
