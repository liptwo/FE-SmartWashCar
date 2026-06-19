import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { AdminPromotionShell } from '@/features/admin/components/admin-promotion-shell'
import { ConfirmSendModal, CreatePromotionDrawer } from '@/features/admin/components/promotion-dialogs'
import { PromotionStats } from '@/features/admin/components/promotion-stats'
import { PromotionTable } from '@/features/admin/components/promotion-table'
import { Button } from '@/shared/components/ui/button'
import { type AdminPromotion } from '@/features/admin/data/admin-promotions'
import { cn } from '@/shared/lib/utils'

const filterTabs = ['Tất cả', 'Đang chạy', 'Hết hạn']

export function AdminPromotionsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<AdminPromotion | null>(null)
  
  // Quản lý trạng thái tab đang active
  const [activeTab, setActiveTab] = useState<number>(0)

  // STATE MỚI THÊM: Lưu danh sách chương trình khuyến mãi thực tế từ Database và trạng thái loading
  const [promotions, setPromotions] = useState<AdminPromotion[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // =========================================================================
  //  ĐỒNG BỘ API + MAP DỮ LIỆU ĐỂ HIỂN THỊ LÊN BẢNG (FIX LỖI LỒNG OBJECT USAGE)
  // =========================================================================
  const fetchPromotions = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8080/api/admin/promotions'
      
      // Chuyển đổi index tab giao diện thành tham số chuỗi gửi lên Backend
      const statusMap = ['ALL', 'ACTIVE', 'EXPIRED']
      const paramStatus = statusMap[activeTab]
      
      if (paramStatus && paramStatus !== 'ALL') {
        url += `?status=${paramStatus}`
      }

      const token = localStorage.getItem('token')

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        
        // BẮP CẦU DỮ LIỆU: Convert dữ liệu Backend Postgres sang định dạng Component Table đang xài
        const formattedData = data.map((item: any) => {
          
          // XỬ LÝ AN TOÀN CHO TRƯỜNG targetTiers (Ép từ chuỗi DB thành Mảng cho FE render)
          let finalTiers: string[] = []
          if (Array.isArray(item.targetTiers)) {
            finalTiers = item.targetTiers
          } else if (typeof item.targetTiers === 'string' && item.targetTiers.trim() !== '') {
            // Nếu lưu chuỗi dạng "GOLD, PLATINUM" thì cắt ra, nếu chỉ có "GOLD" thì bọc vào mảng
            finalTiers = item.targetTiers.includes(',')
              ? item.targetTiers.split(',').map((t: string) => t.trim())
              : [item.targetTiers.trim()]
          } else {
            finalTiers = ['ALL'] // Mặc định nếu null/rỗng
          }

          // Lấy giá trị số lượng thực tế từ các trường phẳng dưới DB
          const currentCount = item.usageCount !== undefined ? item.usageCount : 0
          const limitCount = item.usageLimit !== undefined ? item.usageLimit : 100

          return {
            ...item,
            id: item.promoId || item.id || `PROMO-${Math.random()}`,
            
            // Đút mảng chuẩn vào đây giúp cấu hình render .map() không bao giờ crash
            targetTiers: finalTiers,
            
            // Chuyển đổi boolean isActive thành chuỗi 'ACTIVE' | 'EXPIRED' cho component Table nhận diện
            status: item.isActive === true || String(item.isActive) === 'true' ? 'ACTIVE' : 'EXPIRED',
            
            // Chuyển đổi tên trường promoType từ DB sang type
            type: item.promoType || item.type || 'DISCOUNT',
            
            //  VÁ LỖI CRASH 'current': Bọc cấu hình lồng chính xác để dòng 71 trong Component Table đọc được
            usage: {
              current: currentCount,
              limit: limitCount
            },
            
            // Giữ lại cả biến phẳng phòng hờ các góc xử lý UI khác
            usageLimit: limitCount,
            usageCount: currentCount,
          }
        })

        setPromotions(formattedData)
      }
    } catch (error) {
      console.error('Lỗi khi fetch danh sách khuyến mãi:', error)
    } finally {
      setLoading(false)
    }
  }

  // Tự động gọi lại API nạp dữ liệu mỗi khi Admin nhấn chuyển Tab lọc trạng thái
  useEffect(() => {
    fetchPromotions()
  }, [activeTab])

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

        {/* ĐỒNG BỘ HIỂN THỊ DỮ LIỆU ĐỘNG */}
        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
            Đang tải dữ liệu khuyến mãi từ hệ thống...
          </div>
        ) : (
          <PromotionTable promotions={promotions} onSendPromotion={setSelectedPromotion} />
        )}

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