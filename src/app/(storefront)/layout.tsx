/* eslint-disable */
// @ts-nocheck
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .order('name', { ascending: true })

  return (
    <>
      <Navbar categories={categories || []} />
      <main style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {children}
      </main>
    </>
  );
}
