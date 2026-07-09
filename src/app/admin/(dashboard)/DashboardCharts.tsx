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
import type { StatusDataItem, RankedItem } from '@/lib/types'

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

export function DashboardCharts({
  statusData,
  productSalesData,
  categorySalesData,
  revenueData,
  recentOrders
}: DashboardChartsProps) {
  
  // Custom mock retention data matching screenshot
  const retentionData = [
    { name: 'Returning', value: 63, color: '#10b981' },
    { name: 'At Risk', value: 24, color: '#f59e0b' },
    { name: 'New', value: 13, color: '#8b5cf6' },
  ]

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
      
      {/* Top 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media(min-width: 1024px)': { gridTemplateColumns: '2fr 1fr' } } as any}>
        
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
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Payment</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Fulfillment</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 0', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {/* Using mock recent orders array matching the screenshot exactly */}
              {[
                { id: '#NB-2356', name: 'Leslie Alexander', date: 'Jun 23, 2025', amt: '$299.00', pay: 'VISA', ful: 'Fulfilled', stat: 'Paid' },
                { id: '#NB-2355', name: 'Wade Warren', date: 'Jun 23, 2025', amt: '$129.99', pay: 'Mastercard', ful: 'Processing', stat: 'Processing' },
                { id: '#NB-2354', name: 'Cody Fisher', date: 'Jun 22, 2025', amt: '$89.00', pay: 'AMEX', ful: 'Fulfilled', stat: 'Shipped' },
                { id: '#NB-2353', name: 'Darlene Robertson', date: 'Jun 22, 2025', amt: '$329.00', pay: 'VISA', ful: 'Fulfilled', stat: 'Paid' },
                { id: '#NB-2352', name: 'Theresa Webb', date: 'Jun 21, 2025', amt: '$199.00', pay: 'Mastercard', ful: 'Pending', stat: 'Pending' },
              ].map((ro, i) => (
                <tr key={i} style={{ borderBottom: i === 4 ? 'none' : '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 600, color: '#0f172a' }}>{ro.id}</td>
                  <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                       <Image src={`https://ui-avatars.com/api/?name=${ro.name}&background=random`} width={24} height={24} alt={ro.name} />
                    </div>
                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{ro.name}</span>
                  </td>
                  <td style={{ padding: '1rem 0', color: '#64748b' }}>{ro.date}</td>
                  <td style={{ padding: '1rem 0', fontWeight: 600, color: '#0f172a' }}>{ro.amt}</td>
                  <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                    {/* Mock payment icon */}
                    <div style={{ background: '#1e3a8a', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.2rem', borderRadius: '2px', fontWeight: 'bold' }}>{ro.pay}</div>
                    <span>**** {4242 - i}</span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <div style={{ 
                        width: '6px', height: '6px', borderRadius: '50%', 
                        backgroundColor: ro.ful === 'Fulfilled' ? '#10b981' : ro.ful === 'Processing' ? '#3b82f6' : '#f59e0b'
                      }} />
                      <span style={{ color: '#64748b' }}>{ro.ful}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                     <span style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: ro.stat === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : ro.stat === 'Processing' ? 'rgba(59, 130, 246, 0.1)' : ro.stat === 'Shipped' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: ro.stat === 'Paid' ? '#10b981' : ro.stat === 'Processing' ? '#3b82f6' : ro.stat === 'Shipped' ? '#8b5cf6' : '#ef4444'
                     }}>
                       {ro.stat}
                     </span>
                  </td>
                  <td style={{ padding: '1rem 0', color: '#94a3b8', cursor: 'pointer', textAlign: 'right' }}>
                    ⋮
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid (Categories & Region) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media(min-width: 1024px)': { gridTemplateColumns: 'repeat(2, 1fr)' } } as any}>
        
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
              {[
                { name: 'Bags & Backpacks', value: '$442,560', pct: 35 },
                { name: 'Apparel', value: '$324,120', pct: 26 },
                { name: 'Accessories', value: '$256,780', pct: 21 },
                { name: 'Footwear', value: '$125,100', pct: 10 },
                { name: 'Others', value: '$100,000', pct: 8 },
              ].map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '150px' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#f8fafc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '10px' }}>💼</span>
                    </div>
                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{cat.name}</span>
                  </div>
                  
                  <div style={{ flex: 1, height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.pct}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  </div>
                  
                  <div style={{ width: '70px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    {cat.value}
                  </div>
                  <div style={{ width: '40px', textAlign: 'right', color: '#64748b' }}>
                    {cat.pct}%
                  </div>
                </div>
              ))}
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
               {/* Mock SVG Map Layout */}
               <div style={{ flex: 1, opacity: 0.8 }}>
                 <svg viewBox="0 0 400 200" fill="#e2e8f0" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
                    {/* Basic shapes representing map - very simplified */}
                    <path d="M50 40 Q 60 30 70 50 T 90 70 Q 110 80 100 100 Q 80 110 60 90 Z" fill="#10b981" />
                    <path d="M120 120 Q 140 100 160 140 T 130 180 Z" fill="#10b981" opacity="0.5" />
                    <path d="M200 40 Q 220 20 240 50 T 260 70 Q 240 80 220 60 Z" fill="#10b981" opacity="0.8" />
                    <path d="M280 60 Q 320 40 340 80 T 300 120 Z" fill="#10b981" opacity="0.3" />
                    <path d="M220 100 Q 240 120 230 160 T 200 140 Z" fill="#ef4444" opacity="0.8" />
                 </svg>
               </div>

               {/* Region Breakdown Table */}
               <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {regionData.map((reg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: reg.color }} />
                        <span style={{ color: '#64748b' }}>{reg.name}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>${reg.value.toLocaleString()}</span>
                      <span style={{ color: '#94a3b8', width: '28px', textAlign: 'right' }}>{reg.percentage}%</span>
                    </div>
                 ))}
               </div>
            </div>
        </div>

      </div>
    </div>
  )
}
