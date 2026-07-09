'use client'

import { useEffect } from 'react'
import { trackVisit } from './actions'

export function VisitorTracker() {
  useEffect(() => {
    trackVisit()
  }, [])

  return null
}
