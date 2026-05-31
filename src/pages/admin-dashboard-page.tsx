import { CalendarDays } from 'lucide-react'
import { AdminMetricCard } from '@/components/admin/admin-metric-card'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { AdminActionCards, QueuePanel, TierDistributionPanel } from '@/components/admin/admin-side-panels'
import { RevenueChart } from '@/components/admin/revenue-chart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { adminMetrics } from '@/data/admin-dashboard'

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar />
      <AdminTopbar />

      <main className="min-h-screen px-6 pb-6 pt-20 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-7xl">
          <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-medium leading-8 text-primary">Tổng quan hệ thống</h2>
              <p className="text-sm leading-5 text-on-surface-variant">
                Theo dõi hoạt động kinh doanh thời gian thực
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Card className="flex h-10 items-center gap-2 px-4 shadow-sm">
                <CalendarDays className="text-outline" size={16} />
                <span className="text-sm font-medium leading-4 text-on-surface-variant">01/01/2024 - 07/01/2024</span>
              </Card>
              <Button className="h-10 px-4" type="button">
                Hôm nay
              </Button>
            </div>
          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminMetrics.map((metric) => (
              <AdminMetricCard {...metric} key={metric.label} />
            ))}
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <RevenueChart />
              <AdminActionCards />
            </div>
            <div className="space-y-6">
              <QueuePanel />
              <TierDistributionPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
