'use server'

import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function trackVisit() {
  const visitorId = (await cookies()).get('visitor_id')?.value
  
  if (!visitorId) return

  const supabase = await createClient()
  const userAgent = (await headers()).get('user-agent') || ''
  
  // Try to insert the visit. If it's a duplicate visitor_id for the same day, 
  // we could handle it via DB constraints, but for now we'll just insert it.
  // To avoid spamming, we will check if this visitor_id already exists in the last 24 hours.
  
  const { data: existingVisit } = await supabase
    .from('site_visits')
    .select('id')
    .eq('visitor_id', visitorId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1)

  if (!existingVisit || existingVisit.length === 0) {
    await supabase.from('site_visits').insert({
      visitor_id: visitorId,
      user_agent: userAgent
    })
  }
}
