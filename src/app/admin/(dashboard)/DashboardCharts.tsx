'use client'

import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts'
import styles from './dashboard.module.css'

type DashboardChartsProps = {
  revenueData: { date: string, revenue: number }[]
  statusData: { name: string, value: number, color: string }[]
  topProducts: { name: string, sales: number }[]
  recentOrders: { id: string, name: string, total: number, status: string, date: string }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          {payload[0].value.toFixed(2)} TND
        </p>
      </div>
    );
  }
  return null;
}

export function DashboardCharts({ revenueData, statusData, topProducts, recentOrders }: DashboardChartsProps) {
  return (
    <div className={styles.chartsContainer}>
      
      {/* Revenue Area Chart */}
      <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
        <div className={styles.chartHeader}>
          <h3>Revenue Over Time (Year to Date)</h3>
        </div>
        <div className={styles.chartBody}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={false} 
                width={80}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k TND`;
                  return `${value} TND`;
                }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Status Donut Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Orders by Status</h3>
        </div>
        <div className={styles.chartBody} style={{ display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.donutLegend}>
          {statusData.map(status => (
            <div key={status.name} className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: status.color }}></span>
              <span>{status.name} ({status.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products Bar Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Top Products by Sales</h3>
        </div>
        <div className={styles.chartBody}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#0f172a', fontWeight: 500 }} width={100} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
        <div className={styles.chartHeader}>
          <h3>Recent Orders</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className={styles.mono}>{order.id.split('-')[0]}</td>
                  <td className={styles.bold}>{order.name}</td>
                  <td>{order.date}</td>
                  <td className={styles.mono}>{order.total.toFixed(2)} TND</td>
                  <td>
                    <span className={`${styles.badge} ${styles['badge-' + order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  )
}
