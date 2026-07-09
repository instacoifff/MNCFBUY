'use client'

import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  growth: number
  vsText: string
  Icon: LucideIcon
  iconColor: string
  iconBg: string
  sparklineData: number[]
  sparklineColor: string
}

export function KpiCard({
  title,
  value,
  growth,
  vsText,
  Icon,
  iconColor,
  iconBg,
  sparklineData,
  sparklineColor
}: KpiCardProps) {
  // Format data for Recharts
  const data = sparklineData.map((val, i) => ({ value: val, index: i }))
  
  const isPositive = growth >= 0

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.025)',
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      height: '140px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', position: 'relative', zIndex: 10 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', margin: 0 }}>{title}</h3>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={14} color={iconColor} />
        </div>
      </div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
          {value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
          <span style={{ 
            color: isPositive ? '#10b981' : '#ef4444', 
            fontWeight: 600 
          }}>
            {isPositive ? '+' : ''}{growth}%
          </span>
          <span style={{ color: '#94a3b8' }}>{vsText}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', zIndex: 1, opacity: 0.6 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={sparklineColor} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
