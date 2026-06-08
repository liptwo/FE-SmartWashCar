import { Bell, CircleHelp, Save } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { PointRateCard, RewardCatalog } from '@/components/admin/reward-catalog'
import { TierRuleCard } from '@/components/admin/tier-rule-card'
import { Button } from '@/components/ui/button'
import { tierRules } from '@/data/admin-configuration'

export function AdminConfigurationPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="configuration" />

      <div className="min-h-screen pb-24 lg:ml-64">
        <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-6 lg:left-64">
          <h1 className="text-xl font-medium leading-7 text-primary">Cấu hình hệ thống</h1>
          <div className="flex items-center gap-6">
            <button className="relative text-on-surface-variant hover:text-primary" type="button" aria-label="Thông báo">
              <Bell size={22} />
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-error" />
            </button>
            <button className="text-on-surface-variant hover:text-primary" type="button" aria-label="Trợ giúp">
              <CircleHelp size={22} />
            </button>
          </div>
        </header>

        <main className="mx-auto grid max-w-[1280px] grid-cols-12 gap-6 px-6 pt-24">
          <section className="col-span-12 space-y-4 lg:col-span-7">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-medium leading-7 text-on-surface">Quy tắc phân hạng</h2>
              <span className="text-xs leading-4 text-on-surface-variant">Cập nhật lần cuối: 12/10/2023</span>
            </div>

            {tierRules.map((rule) => (
              <TierRuleCard key={rule.tier} rule={rule} />
            ))}
          </section>

          <section className="col-span-12 space-y-6 lg:col-span-5">
            <PointRateCard />
            <RewardCatalog />
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-end border-t border-border bg-surface/80 px-6 py-4 backdrop-blur-md lg:left-64">
          <div className="flex items-center gap-4">
            <Button className="px-6 text-on-surface-variant" type="button" variant="ghost">
              Hủy
            </Button>
            <Button className="gap-2 px-6" type="button">
              <Save size={18} />
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
