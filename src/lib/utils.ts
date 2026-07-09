/**
 * Shared utility functions used across the application.
 */

import { CURRENCY } from './constants'

/**
 * Format a numeric amount as a price string with currency.
 * @example formatPrice(49.99) => "49.99 TND"
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} ${CURRENCY.symbol}`
}

/**
 * Format a date string or Date object into a human-readable string.
 * @example formatDate('2025-07-01T12:00:00Z') => "Jul 01, 2025"
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    ...options,
  })
}

/**
 * Generate a URL-safe slug from a string.
 * @example generateSlug('Apple Watch Ultra 2') => "apple-watch-ultra-2"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Merge CSS module class names, filtering out falsy values.
 * @example cn(styles.card, isActive && styles.active, className)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Truncate text to a maximum length, adding ellipsis if truncated.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Sanitize a string by stripping HTML tags to prevent XSS.
 * For text fields that should never contain HTML.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

/**
 * Capitalize the first letter of each word.
 * @example capitalize('hello world') => "Hello World"
 */
export function capitalize(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}
