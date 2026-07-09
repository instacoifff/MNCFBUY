'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import styles from './charts.module.css'
import type { StatusDataItem, RankedItem } from '@/lib/types'

// Local Revenue Data Point definition (updated for Dual Axis)
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
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(15, 23, 42, 0.05)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '1rem',
      }}>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#0f172a' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0', color: entry.color }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ fontWeight: 500 }}>{entry.name === 'revenue' ? 'Revenue' : entry.name === 'orders' ? 'Orders' : entry.name}:</span>
            <span style={{ fontWeight: 700 }}>
              {entry.name === 'revenue' ? `${entry.value.toFixed(2)} TND` : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardCharts({
  statusData,
  productSalesData,
  categorySalesData,
  revenueData,
}: DashboardChartsProps) {
  
  // Calculate actual percentages for the legend
  const totalOrders = statusData.reduce((sum, item) => sum + item.value, 0)
  const legendData = statusData.map((item) => ({
    ...item,
    percentage: totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0,
  }))

  return (
    <div className={styles.grid}>
      {/* Revenue & Orders Over Time (Dual Axis) */}
      <div className={styles.chartCardFull}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Revenue & Orders (6 Months)</h3>
            <p className={styles.cardSubtitle}>Rolling performance metrics</p>
          </div>
        </div>
        <div className={styles.chartWrapperFull}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#3b82f6', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value >= 1000 ? value / 1000 + 'k' : value}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8b5cf6', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.02)' }} />
              <Line
                yAxisId="left"
                type="natural"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="natural"
                dataKey="orders"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Top Products</h3>
            <p className={styles.cardSubtitle}>By units sold</p>
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productSalesData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradientProduct" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={110}
                tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.02)' }} content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="url(#barGradientProduct)" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Categories */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Top Categories</h3>
            <p className={styles.cardSubtitle}>By items sold</p>
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categorySalesData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradientCat" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={110}
                tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.02)' }} content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="url(#barGradientCat)" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className={styles.chartCardFull}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Order Status</h3>
            <p className={styles.cardSubtitle}>Current distribution</p>
          </div>
        </div>
        <div className={styles.chartWrapper} style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.legendGrid}>
          {legendData.map((item, i) => (
            <div key={i} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
              <span className={styles.legendLabel}>{item.name}</span>
              <span className={styles.legendValue}>{item.percentage}% ({item.value})</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}
