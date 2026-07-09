import { AdminLayoutClient } from './AdminLayoutClient'

export const metadata = {
  title: 'Admin Dashboard - MoncefBuy',
  description: 'Manage your MoncefBuy store.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
