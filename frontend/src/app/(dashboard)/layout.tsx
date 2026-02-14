import { Header } from '@/components/layout/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl p-6">{children}</div>
    </div>
  )
}
