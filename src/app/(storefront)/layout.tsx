import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/types'
import { VisitorTracker } from './VisitorTracker'

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .order('name', { ascending: true })

  return (
    <>
      <Navbar categories={(categories as Pick<Category, 'name' | 'slug'>[]) || []} />
      <main style={{ minHeight: 'calc(100vh - 4rem)' }}>{children}</main>
      <Footer />
      <VisitorTracker />
    </>
  )
}
