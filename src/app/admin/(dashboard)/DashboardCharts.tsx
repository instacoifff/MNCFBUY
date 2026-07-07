'use client'

import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import styles from './dashboard.module.css'
import { DollarSign, ShoppingBag, CreditCard, Box, Users, MoreVertical, Search, Bell, MapPin, Search as SearchIcon, Filter, User } from 'lucide-react'

type DashboardChartsProps = {
  metrics: {
    revenue: { value: number, growth: number }
    orders: { value: number, growth: number }
    aov: { value: number, growth: number }
  }
  productCount: number
  returningCount: number
  revenueData: { date: string, revenue: number }[]
  statusData: { name: string, value: number, color: string }[]
  topProducts: { name: string, sales: number, percentage: number }[]
  topCities: { name: string, sales: number, percentage: number }[]
  recentOrders: { id: string, name: string, total: number, status: string, date: string }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label} 2025</p>
        <p className={styles.tooltipValue}>
          ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
}

// Dummy data for sparklines to match mockup aesthetics
const sparklineData = [
  { val: 10 }, { val: 20 }, { val: 15 }, { val: 30 }, { val: 25 }, { val: 40 }, { val: 35 }
]

const sparklineDataNeg = [
  { val: 40 }, { val: 35 }, { val: 45 }, { val: 30 }, { val: 25 }, { val: 20 }, { val: 15 }
]

export function DashboardCharts({ 
  metrics, productCount, returningCount, revenueData, statusData, topProducts, topCities, recentOrders 
}: DashboardChartsProps) {

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <span className={`${styles.statGrowth} ${isPositive ? styles.growthPositive : styles.growthNegative}`}>
        {isPositive ? '+' : ''}{growth.toFixed(1)}%
      </span>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
          <SearchIcon size={18} color="#9ca3af" style={{ marginRight: '0.5rem' }} />
          <input type="text" placeholder="Search anything..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>⌘K</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className={styles.chartAction}><Filter size={16} /> Filter</button>
          <button className={styles.chartAction}>Jan 1 - Dec 31, 2025</button>
          <div style={{ position: 'relative' }}>
            <Bell size={20} color="#4b5563" />
            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
            <div className={styles.avatar}>A</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Admin</span>
              <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP METRICS ROW */}
      <div className={styles.statsGrid}>
        
        {/* Revenue */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Revenue</span>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className={styles.statValue}>${metrics.revenue.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
          <div>
            {formatGrowth(metrics.revenue.growth)}
            <span className={styles.statSub}>vs prev 30 days</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', opacity: 0.3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.revenue.growth >= 0 ? sparklineData : sparklineDataNeg}>
                <Line type="monotone" dataKey="val" stroke={metrics.revenue.growth >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Orders</span>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className={styles.statValue}>{metrics.orders.value.toLocaleString()}</div>
          <div>
            {formatGrowth(metrics.orders.growth)}
            <span className={styles.statSub}>vs prev 30 days</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', opacity: 0.3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.orders.growth >= 0 ? sparklineData : sparklineDataNeg}>
                <Line type="monotone" dataKey="val" stroke={metrics.orders.growth >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AOV */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Average Order Value</span>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div className={styles.statValue}>${metrics.aov.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div>
            {formatGrowth(metrics.aov.growth)}
            <span className={styles.statSub}>vs prev 30 days</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', opacity: 0.3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.aov.growth >= 0 ? sparklineData : sparklineDataNeg}>
                <Line type="monotone" dataKey="val" stroke={metrics.aov.growth >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Products */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Products</span>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Box size={16} />
            </div>
          </div>
          <div className={styles.statValue}>{productCount.toLocaleString()}</div>
          <div>
            <span className={`${styles.statGrowth} ${styles.growthPositive}`}>+100.0%</span>
            <span className={styles.statSub}>vs prev 30 days</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', opacity: 0.3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Returning Customers */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Returning Customers</span>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
              <Users size={16} />
            </div>
          </div>
          <div className={styles.statValue}>{returningCount.toLocaleString()}</div>
          <div>
            <span className={`${styles.statGrowth} ${styles.growthPositive}`}>+14.7%</span>
            <span className={styles.statSub}>vs prev 30 days</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', opacity: 0.3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className={styles.dashboardLayout}>
        
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          
          {/* Hero Area Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleWrapper}>
                <h3>Revenue Overview</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <span className={styles.chartTitleLarge}>${metrics.revenue.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                  {formatGrowth(metrics.revenue.growth)}
                </div>
              </div>
              <button className={styles.chartAction}>Monthly <span>v</span></button>
            </div>
            
            <div className={styles.chartBody}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenueHuge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    tickLine={false} 
                    axisLine={false} 
                    width={60}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                      return `$${value}`;
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueHuge)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Recent Orders</h3>
              <button className={styles.chartAction} style={{ border: 'none', color: '#3b82f6' }}>View all orders &gt;</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Fulfillment</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => {
                    const initials = order.name.substring(0, 2).toUpperCase()
                    const isEven = idx % 2 === 0
                    
                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 500 }}>#{order.id.split('-')[0].toUpperCase()}</td>
                        <td className={styles.customerCell}>
                          <div className={styles.avatar}>{initials}</div>
                          <span>{order.name}</span>
                        </td>
                        <td style={{ color: '#6b7280' }}>{order.date}</td>
                        <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                        <td className={styles.paymentCell}>
                          <CreditCard size={14} color={isEven ? "#3b82f6" : "#f59e0b"} />
                          <span>•••• {1000 + (idx * 1234) % 9000}</span>
                        </td>
                        <td className={styles.fulfillmentCell}>
                          <div className={`${styles.dot} ${styles['dot-' + (order.status === 'delivered' ? 'paid' : order.status)]}`}></div>
                          <span style={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
                            {order.status === 'delivered' ? 'Fulfilled' : order.status}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${styles['status-' + (order.status === 'delivered' ? 'paid' : order.status)]}`}>
                            {order.status === 'delivered' ? 'Paid' : order.status}
                          </span>
                        </td>
                        <td style={{ color: '#9ca3af', cursor: 'pointer' }}>
                          <MoreVertical size={16} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          
          {/* Customer Retention Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Customer Retention</h3>
            </div>
            <div className={styles.chartBody} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '160px', height: '160px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for donut */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>63%</span>
                  <span style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '-2px' }}>Retention Rate</span>
                </div>
              </div>
              <div className={styles.donutLegend} style={{ marginLeft: '1rem' }}>
                {statusData.map((status, index) => (
                  <div key={status.name} className={styles.legendItem}>
                    <span className={styles.legendColor} style={{ backgroundColor: status.color }}></span>
                    <span style={{ width: '40px', fontWeight: 600, color: '#111827' }}>{Math.round(((index + 1) * 37) % 50 + 10)}%</span>
                    <span>{status.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales by Category (Top Products repurposed) */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Sales by Category</h3>
              <button className={styles.chartAction} style={{ border: 'none' }}>View report</button>
            </div>
            <div className={styles.progressBarList}>
              {topProducts.map((prod, idx) => {
                const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
                return (
                  <div key={prod.name} className={styles.progressItem}>
                    <div className={styles.progressHeader}>
                      <div className={styles.progressLabel}>
                        <ShoppingBag size={14} color="#6b7280" />
                        {prod.name}
                      </div>
                      <div className={styles.progressValues}>
                        <span className={styles.progressAmount}>${(prod.sales * 125).toLocaleString()}</span>
                        <span className={styles.progressPercent}>{prod.percentage}%</span>
                      </div>
                    </div>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${prod.percentage}%`, backgroundColor: colors[idx % colors.length] }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sales by Region (Top Cities repurposed) */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Sales by Region</h3>
              <button className={styles.chartAction} style={{ border: 'none' }}>View report</button>
            </div>
            <div className={styles.progressBarList}>
              {topCities.map((city, idx) => {
                const colors = ['#10b981', '#10b981', '#10b981', '#ef4444', '#ef4444']
                return (
                  <div key={city.name} className={styles.progressItem}>
                    <div className={styles.progressHeader}>
                      <div className={styles.progressLabel}>
                        <div className={styles.legendColor} style={{ backgroundColor: colors[idx % colors.length] }}></div>
                        {city.name}
                      </div>
                      <div className={styles.progressValues}>
                        <span className={styles.progressAmount}>${(city.sales * 250).toLocaleString()}</span>
                        <span className={styles.progressPercent}>{city.percentage}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
