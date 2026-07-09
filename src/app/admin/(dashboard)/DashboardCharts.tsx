'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Image from 'next/image'
import TunisiaMap from '@svg-maps/tunisia'
import type { StatusDataItem, RankedItem } from '@/lib/types'
import styles from './dashboard.module.css'

// Mock Data for new visuals
const channelData = [
  { name: 'Online Store', value: 842560, percentage: 67, color: '#10b981' },
  { name: 'Shopify POS', value: 241380, percentage: 19, color: '#3b82f6' },
  { name: 'Mobile App', value: 120430, percentage: 10, color: '#8b5cf6' },
  { name: 'Marketplace', value: 44190, percentage: 4, color: '#ec4899' },
]

const regionData = [
  { name: 'North America', value: 742560, percentage: 59, color: '#10b981' },
  { name: 'Europe', value: 284450, percentage: 23, color: '#10b981' },
  { name: 'Asia Pacific', value: 156230, percentage: 12, color: '#10b981' },
  { name: 'South America', value: 42130, percentage: 3, color: '#ef4444' },
  { name: 'Africa', value: 23190, percentage: 2, color: '#ef4444' },
]

interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

interface DashboardChartsProps {
  statusData: StatusDataItem[]
  productSalesData: RankedItem[]
  categorySalesData: RankedItem[]
  revenueData: RevenueDataPoint[]
  recentOrders: any[]
  visitsToday?: number
  uniqueBuyersCount?: number
  products?: any[]
  governorateSales?: { name: string, sales: number, orders: number }[]
}

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '0.75rem',
      }}>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: '#64748b' }}>{label} 2025</p>
        <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>
          ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
        </p>
      </div>
    )
  }
  return null
}

const formatCurrency = (val: number) => `$${val.toLocaleString()}`

export default function DashboardCharts({
  statusData,
  productSalesData,
  categorySalesData,
  revenueData,
  recentOrders,
  visitsToday = 0,
  uniqueBuyersCount = 0,
  products = [],
  governorateSales = []
}: DashboardChartsProps) {
  
  // Custom mock retention data matching screenshot
  const retentionData = [
    { name: 'Returning', value: 63, color: '#10b981' },
    { name: 'At Risk', value: 24, color: '#f59e0b' },
    { name: 'New', value: 13, color: '#8b5cf6' },
  ]

  const salesRevenueDelivered = Math.round(revenueData.reduce((acc, val) => acc + val.revenue, 0))

  const totalGovernorateSales = governorateSales.reduce((acc, g) => acc + g.sales, 0) || 1
  const getGovernorateColor = (baseName: string) => {
    const gov = governorateSales.find(g => g.name === baseName)
    if (!gov || gov.sales === 0) return '#f1f5f9'
    const percentage = gov.sales / totalGovernorateSales
    if (percentage >= 0.3) return '#059669' // dark green
    if (percentage >= 0.1) return '#10b981' // normal green
    if (percentage >= 0.05) return '#34d399' // light green
    return '#6ee7b7' // lighter green
  }

  // Add mock data for Area chart if it's empty to match screenshot curve
  const areaData = revenueData.every(d => d.revenue === 0) 
    ? [
        { date: 'Jan', revenue: 200000 },
        { date: 'Feb', revenue: 400000 },
        { date: 'Mar', revenue: 800000 },
        { date: 'Apr', revenue: 600000 },
        { date: 'May', revenue: 750000 },
        { date: 'Jun', revenue: 650000 },
        { date: 'Jul', revenue: 1248560 },
        { date: 'Aug', revenue: 1100000 },
        { date: 'Sep', revenue: 1400000 },
        { date: 'Oct', revenue: 900000 },
        { date: 'Nov', revenue: 1300000 },
        { date: 'Dec', revenue: 1600000 },
      ]
    : revenueData
    
  // Live Visitors vs Buyers Data
  const visitorTotal = visitsToday + uniqueBuyersCount
  const visitorsData = [
    { name: 'Live Visitors Today', value: visitsToday || 1, color: '#f59e0b' },
    { name: 'Unique Buyers', value: uniqueBuyersCount, color: '#10b981' }
  ]
  const buyerConversion = visitorTotal > 0 ? Math.round((uniqueBuyersCount / visitorTotal) * 100) : 0

  // Calculate Stock Analytics
  const fullStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const lowStockProducts = products.filter(p => p.stock < 10).sort((a,b) => a.stock - b.stock)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
      
      {/* Main 2-Column Layout */}
      <div className={styles.mainGrid}>
        
        {/* Left Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Left Column (Revenue Overview) */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem' }}>Revenue Overview</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>$1,248,560</span>
                <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>+ 12.5%</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>vs Apr 25 - May 24</span>
              </div>
            </div>
            <select style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0', 
              background: '#ffffff',
              fontSize: '0.875rem',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `$${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000) + 'K' : val}`}
                />
                <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

          {/* Middle Grid (Recent Orders) */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Recent Orders</h3>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>View all orders ›</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Products</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Total Price</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Retention</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((ro, i) => {
                // Determine display names for status
                let statColor = '#f59e0b'
                let statBg = 'rgba(245, 158, 11, 0.1)'
                if (ro.status === 'delivered') { statColor = '#10b981'; statBg = 'rgba(16, 185, 129, 0.1)' }
                else if (ro.status === 'shipped') { statColor = '#8b5cf6'; statBg = 'rgba(139, 92, 246, 0.1)' }
                else if (ro.status === 'cancelled') { statColor = '#ef4444'; statBg = 'rgba(239, 68, 68, 0.1)' }
                else if (ro.status === 'confirmed') { statColor = '#3b82f6'; statBg = 'rgba(59, 130, 246, 0.1)' }
                
                const amt = `$${Number(ro.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                const date = new Date(ro.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                
                const city = ro.shipping_address?.city || 'Unknown'
                const name = ro.shipping_address?.fullName || ro.contact_email?.split('@')[0] || 'Guest'
                const phone = ro.contact_phone || 'No phone'
                const email = ro.contact_email
                const custType = ro.customer_status || 'Unknown'

                return (
                <tr key={i} style={{ borderBottom: i === 4 ? 'none' : '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 600, color: '#0f172a' }}>#{ro.id.split('-')[0]}</td>
                  
                  <td style={{ padding: '1rem 0', minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                         <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=72`} width={36} height={36} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{phone}</span>
                        {email && <span style={{ color: '#64748b', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</span>}
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '1rem 0', color: '#64748b' }}>{date}</td>
                  
                  <td style={{ padding: '1rem 0', color: '#64748b' }}>{city}</td>
                  
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '180px' }}>
                      {ro.order_items?.map((item: any, idx: number) => (
                        <div key={idx} style={{ fontSize: '0.75rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.quantity}x {item.product?.title || 'Unknown Product'}
                        </div>
                      ))}
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem 0', fontWeight: 600, color: '#0f172a' }}>{amt}</td>
                  
                  <td style={{ padding: '1rem 0' }}>
                     <span style={{
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        backgroundColor: custType === 'First Time' ? '#f1f5f9' : 'rgba(139, 92, 246, 0.1)',
                        color: custType === 'First Time' ? '#64748b' : '#8b5cf6',
                        textTransform: 'uppercase'
                     }}>
                       {custType}
                     </span>
                  </td>

                  <td style={{ padding: '1rem 0' }}>
                     <span style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: statBg,
                        color: statColor,
                        textTransform: 'capitalize'
                     }}>
                       {ro.status}
                     </span>
                  </td>
                </tr>
              )}) : (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

          {/* Bottom Grid (Categories & Region) */}
      <div className={styles.bottomGrid}>
        
        {/* Top Categories */}
        <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Top Categories</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>View all</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {categorySalesData.length > 0 ? categorySalesData.map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '150px' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#f8fafc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '10px' }}>📁</span>
                    </div>
                    <span style={{ color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                  </div>
                  
                  <div style={{ flex: 1, height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.percentage}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  </div>
                  
                  <div style={{ width: '70px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    {cat.sales} sold
                  </div>
                  <div style={{ width: '40px', textAlign: 'right', color: '#64748b' }}>
                    {cat.percentage}%
                  </div>
                </div>
              )) : (
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>No category sales data yet.</div>
              )}
            </div>
        </div>

        {/* Sales by Region */}
        <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Sales by Region</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>View report ›</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               {/* Real SVG Map Layout */}
               <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                 <svg viewBox={TunisiaMap.viewBox} style={{ width: '100%', height: 'auto', maxHeight: '250px' }}>
                    {TunisiaMap.locations.map((location: any) => {
                      const baseName = location.name.replace(/ \d$/, '')
                      const color = getGovernorateColor(baseName)
                      return (
                        <path
                          key={location.id}
                          d={location.path}
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        >
                          <title>{baseName}</title>
                        </path>
                      )
                    })}
                 </svg>
               </div>

               {/* Region Breakdown Table */}
               <div style={{ width: '230px', maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
                 {governorateSales.map((gov, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getGovernorateColor(gov.name) }} />
                        <span style={{ color: '#64748b' }}>{gov.name} <span style={{ fontSize: '10px', color: '#94a3b8' }}>({gov.orders})</span></span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(gov.sales)}</span>
                      <span style={{ color: '#94a3b8', width: '28px', textAlign: 'right' }}>{Math.round((gov.sales / totalGovernorateSales) * 100)}%</span>
                    </div>
                 ))}
               </div>
            </div>
        </div>

        {/* Stock Analytics & Alerts */}
        <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            gridColumn: '1 / -1' // Span full width of bottom grid
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Stock & Inventory Analytics</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              
              {/* Left Side: Stock Value */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Stock Value (Unsold)</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(fullStockValue)}</div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                     <div style={{ fontSize: '0.7rem', color: '#10b981', marginBottom: '0.25rem' }}>Delivered Value</div>
                     <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>
                       {formatCurrency(statusData.find(s => s.name === 'Delivered')?.value || 0)}
                     </div>
                   </div>
                   <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                     <div style={{ fontSize: '0.7rem', color: '#ef4444', marginBottom: '0.25rem' }}>Cancelled Value</div>
                     <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>
                        {formatCurrency(statusData.find(s => s.name === 'Cancelled')?.value || 0)}
                     </div>
                   </div>
                </div>
              </div>

              {/* Right Side: Low Stock Alerts */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1rem 0' }}>Low Stock Alerts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: p.stock === 0 ? 'rgba(239, 68, 68, 0.05)' : '#ffffff', border: `1px solid ${p.stock === 0 ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {p.image_url && <Image src={p.image_url} alt={p.title} width={24} height={24} style={{ borderRadius: '4px' }}/>}
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>{p.title}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '4px', background: p.stock === 0 ? '#ef4444' : '#f59e0b', color: '#fff' }}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                      </span>
                    </div>
                  )) : (
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Inventory is healthy. No low stock items.</div>
                  )}
                </div>
              </div>

            </div>
        </div>

      </div>
        </div>

        {/* Right Main Column */}
        {/* Right Column (Retention & Channels) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Customer Retention */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            flex: 1
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1.5rem' }}>Customer Retention</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={retentionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {retentionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>63%</div>
                  <div style={{ fontSize: '0.625rem', color: '#64748b' }}>Retention<br/>Rate</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {retentionData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontWeight: 600, color: '#0f172a', width: '30px' }}>{item.value}%</span>
                    <span style={{ color: '#64748b' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales by Channel */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Sales by Channel</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>View report</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {channelData.map((ch, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Placeholder for small icons */}
                      <div style={{ width: '8px', height: '8px', border: `1px solid ${ch.color}`, borderRadius: '2px' }}/>
                    </div>
                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{ch.name}</span>
                  </div>
                  
                  <div style={{ flex: 1, height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${ch.percentage}%`, height: '100%', backgroundColor: ch.color, borderRadius: '2px' }} />
                  </div>
                  
                  <div style={{ width: '70px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    ${ch.value.toLocaleString()}
                  </div>
                  <div style={{ width: '40px', textAlign: 'right', color: '#64748b' }}>
                    {ch.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visitors vs Buyers */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            flex: 1
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1.5rem' }}>Live Visitors vs Buyers</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visitorsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {visitorsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{buyerConversion}%</div>
                  <div style={{ fontSize: '0.625rem', color: '#64748b' }}>Buyer<br/>Rate</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {visitorsData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontWeight: 600, color: '#0f172a', width: '30px' }}>{item.value}</span>
                    <span style={{ color: '#64748b' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            flex: 1
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1.5rem' }}>Order Status Overview</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {statusData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontWeight: 600, color: '#0f172a', width: '20px' }}>{item.value}</span>
                    <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
