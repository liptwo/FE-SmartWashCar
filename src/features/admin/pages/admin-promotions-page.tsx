import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AdminPromotionShell } from '@/features/admin/components/admin-promotion-shell'
import { ConfirmSendModal, CreatePromotionDrawer } from '@/features/admin/components/promotion-dialogs'
import { PromotionStats } from '@/features/admin/components/promotion-stats'
import { PromotionTable } from '@/features/admin/components/promotion-table'
import { Button } from '@/shared/components/ui/button'
import { adminPromotions, type AdminPromotion } from '@/features/admin/data/admin-promotions'
import { cn } from '@/shared/lib/utils'

const filterTabs = ['Tất cả', 'Đang chạy', 'Hết hạn']

export function AdminPromotionsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<AdminPromotion | null>(null)

  return (
    <AdminPromotionShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-2xl font-medium leading-8 text-on-surface">Quản lý Khuyến mãi</h1>
            <p className="text-sm leading-5 text-on-surface-variant">
              Theo dõi và triển khai các chương trình ưu đãi cho từng phân khúc khách hàng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-outline-variant bg-surface p-1">
              {filterTabs.map((tab, index) => (
                <button
                  className={cn(
                    'rounded-md px-4 py-2 text-xs font-medium leading-4 text-on-surface-variant hover:bg-surface-container',
                    index === 0 && 'bg-[#a4c9ff] text-primary',
                  )}
                  key={tab}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button className="gap-2 " type="button" onClick={() => setDrawerOpen(true)}>
              <Plus size={16} />
              Tạo promotion
            </Button>
          </div>
        </section>

        <PromotionTable promotions={adminPromotions} onSendPromotion={setSelectedPromotion} />

        <div className="mt-6">
          <PromotionStats />
        </div>
      </div>

      <Button
        className="fixed bottom-6 left-6 z-40 hidden h-12 w-[calc(16rem-2rem)] gap-2 lg:inline-flex"
        type="button"
        onClick={() => setDrawerOpen(true)}
      >
        <Plus size={18} />
        Tạo promotion
      </Button>

      <ConfirmSendModal promotion={selectedPromotion} onClose={() => setSelectedPromotion(null)} />
      <CreatePromotionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </AdminPromotionShell>
  )
}
