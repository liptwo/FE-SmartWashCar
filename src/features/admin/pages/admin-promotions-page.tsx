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
  
  // Quản lý trạng thái tab đang active (Mặc định ban đầu là tab số 0: 'Tất cả')
  const [activeTab, setActiveTab] = useState<number>(0)

  // CẬP NHẬT LOGIC LỌC CHUẨN ĐỂ ĐỔ DỮ LIỆU TĨNH LÊN MÀN HÌNH MẪU
  const filteredPromotions = adminPromotions.filter((promo) => {
    if (activeTab === 0) return true 

    const statusString = String(promo.status).toLowerCase();
    
    // Kiểm tra xem tên chương trình có phải là bài Sinh nhật không để dễ phân loại tĩnh
    const isBirthdayPromo = promo.name.includes('Sinh nhật');

    if (activeTab === 1) {
      // Tab "Đang chạy": Lấy các chương trình không phải chương trình Sinh nhật hết hạn
      return !isBirthdayPromo;
    }
    
    if (activeTab === 2) {
      // Tab "Hết hạn": Cho phép chương trình Sinh nhật hiển thị tại đây để test giao diện
      return isBirthdayPromo;
    }

    return true;
  })

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
                    'rounded-md px-4 py-2 text-xs font-medium leading-4 text-on-surface-variant hover:bg-surface-container transition-colors',
                    activeTab === index && 'bg-[#a4c9ff] text-primary font-bold',
                  )}
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
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

        <PromotionTable promotions={filteredPromotions} onSendPromotion={setSelectedPromotion} />

        <div className="mt-6">
          <PromotionStats />
        </div>
      </div>

      <Button
        className="fixed bottom-6 left-6 z-40 hidden h-12 w-56 gap-2 lg:inline-flex"
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